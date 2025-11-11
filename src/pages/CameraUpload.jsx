import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ATProto Facts Configuration - Feel free to edit these!
const ATPROTO_FACTS = [
  "here we go...",
  "cross your fingers",
  "hope this works"
]

export default function CameraUpload() {
  const navigate = useNavigate()
  const [appState, setAppState] = useState('ready') // ready, captured, loading
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('none') // Default to no filter
  const [resultMessage, setResultMessage] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [error, setError] = useState('')
  const [currentFactIndex, setCurrentFactIndex] = useState(0)

  const videoRef = useRef(null)
  const cameraVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const livePreviewCanvasRef = useRef(null) // Canvas for live preview with pixel manipulation
  const filterCanvasRefs = useRef({}) // Canvases for filter selector thumbnails

  // Filter definitions - all use real-time pixel manipulation for 100% accuracy
  const filters = {
    none: {
      name: 'Normal',
      process: (imageData) => imageData // No processing, return as-is
    },
    sepia: {
      name: 'Vintage',
      process: (imageData) => applySepiaFilter(imageData)
    },
    posterize: {
      name: 'Warhol',
      process: (imageData) => applyPosterizeFilter(imageData)
    },
    invert: {
      name: 'Inverted',
      process: (imageData) => applyInvertFilter(imageData)
    }
  }

  // Pixel-level filter functions - simple and reliable
  const applySepiaFilter = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      // Standard sepia tone matrix
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
    }
    return imageData
  }

  const applyPosterizeFilter = (imageData) => {
    const data = imageData.data
    const levels = 3 // Number of color levels per channel (fewer = more dramatic/Warhol-like)

    for (let i = 0; i < data.length; i += 4) {
      // Posterize each color channel by reducing to N levels
      const step = 255 / (levels - 1)

      data[i] = Math.round(data[i] / step) * step         // Red
      data[i + 1] = Math.round(data[i + 1] / step) * step // Green
      data[i + 2] = Math.round(data[i + 2] / step) * step // Blue
      // Alpha stays the same
    }
    return imageData
  }

  const applyInvertFilter = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      // Invert RGB values (super simple!)
      data[i] = 255 - data[i]       // Red
      data[i + 1] = 255 - data[i + 1] // Green
      data[i + 2] = 255 - data[i + 2] // Blue
      // Alpha stays the same
    }
    return imageData
  }

  // Real-time canvas preview with actual pixel manipulation (updates every 200ms)
  useEffect(() => {
    if (!stream || appState !== 'ready') return

    const interval = setInterval(() => {
      const video = videoRef.current

      // Update main preview canvas
      const mainCanvas = livePreviewCanvasRef.current
      if (mainCanvas && video && video.videoWidth && video.videoHeight) {
        const ctx = mainCanvas.getContext('2d')
        const size = Math.min(video.videoWidth, video.videoHeight)

        // Set canvas size (smaller for performance)
        mainCanvas.width = 400
        mainCanvas.height = 400

        // Draw center-cropped video frame
        const sx = (video.videoWidth - size) / 2
        const sy = (video.videoHeight - size) / 2
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400)

        // Apply selected filter
        if (selectedFilter !== 'none') {
          const imageData = ctx.getImageData(0, 0, 400, 400)
          const filtered = filters[selectedFilter].process(imageData)
          ctx.putImageData(filtered, 0, 0)
        }
      }

      // Update filter selector thumbnails
      Object.entries(filterCanvasRefs.current).forEach(([key, canvas]) => {
        if (canvas && video && video.videoWidth && video.videoHeight) {
          const ctx = canvas.getContext('2d')
          const size = Math.min(video.videoWidth, video.videoHeight)

          canvas.width = 64
          canvas.height = 64

          const sx = (video.videoWidth - size) / 2
          const sy = (video.videoHeight - size) / 2
          ctx.drawImage(video, sx, sy, size, size, 0, 0, 64, 64)

          // Apply the filter for this thumbnail
          if (key !== 'none') {
            const imageData = ctx.getImageData(0, 0, 64, 64)
            const filtered = filters[key].process(imageData)
            ctx.putImageData(filtered, 0, 0)
          }
        }
      })
    }, 200) // Update 5 times per second

    return () => clearInterval(interval)
  }, [stream, selectedFilter, appState])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])



  // Rotate ATProto facts during loading
  useEffect(() => {
    if (appState !== 'loading') return

    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % ATPROTO_FACTS.length)
    }, 500) // Rotate every 2.5 seconds

    return () => clearInterval(interval)
  }, [appState])

  // Start camera on mount
  useEffect(() => {
    startCameraForMain()
  }, [])

  const startCameraForMain = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      setStream(mediaStream)

      // Wait for next render, then set stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          // Ensure video plays
          videoRef.current.play().catch(e => console.error('Video play error:', e))
        }
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = mediaStream
          cameraVideoRef.current.play().catch(e => console.error('Video play error:', e))
        }
      }, 100)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera access denied. Please enable camera permissions and try again.')
    }
  }

  const capturePhoto = () => {
    const video = cameraVideoRef.current || videoRef.current

    if (!video || !canvasRef.current) {
      console.error('Video or canvas ref not available')
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Check if video dimensions are available
    if (!video.videoWidth || !video.videoHeight) {
      console.error('Video dimensions not available:', video.videoWidth, video.videoHeight)
      alert('Camera not ready. Please wait a moment and try again.')
      return
    }

    console.log('Capturing photo with dimensions:', video.videoWidth, 'x', video.videoHeight)

    // Make it SQUARE - crop to smallest dimension
    const size = Math.min(video.videoWidth, video.videoHeight)
    const maxSize = 1200
    const finalSize = Math.min(size, maxSize)

    canvas.width = finalSize
    canvas.height = finalSize

    // Center crop the video frame
    const sx = (video.videoWidth - size) / 2
    const sy = (video.videoHeight - size) / 2

    // Draw square cropped video frame to canvas
    ctx.drawImage(video, sx, sy, size, size, 0, 0, finalSize, finalSize)

    // Apply the selected filter to the captured image
    if (selectedFilter !== 'none') {
      const imageData = ctx.getImageData(0, 0, finalSize, finalSize)
      const filtered = filters[selectedFilter].process(imageData, finalSize, finalSize)
      ctx.putImageData(filtered, 0, 0)
    }

    // Convert canvas to data URL for preview (with filter already applied)
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)

    // Don't stop camera stream - keep it for retake
    setAppState('captured')
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setAppState('ready')
  }

  const uploadPhoto = async () => {
    if (!capturedImage) {
      console.error('No captured image available')
      return
    }

    setAppState('loading')

    // Filter is already baked into capturedImage from capturePhoto()
    // Just need to extract the base64 data
    const base64Data = capturedImage.split(',')[1]

    // Check size
    const sizeInBytes = (base64Data.length * 3) / 4
    const sizeInMB = sizeInBytes / (1024 * 1024)

    if (sizeInMB > 1) {
      alert('Image is too large. Please try again.')
      setAppState('captured')
      return
    }

    try {
      const response = await fetch('https://hdgs7oe2bps2fxp7tqgfjauuuq0jzkpx.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64Data,
          tagId: 'web-upload',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers))

      const result = await response.json()
      console.log('Response body:', result)

      if (result.success) {
        setResultMessage('Posted to Bluesky!')
        const postUrl = result.postUrl || ''
        setPostUrl(postUrl)
        // Redirect to success page
        navigate('/elevatorselfie', { state: { postUrl } })
      } else {
        setResultMessage(`Error: ${result.error || 'Upload failed'}`)
        setAppState('captured') // Stay in captured state to allow retry
      }
    } catch (err) {
      console.error('Upload error:', err)
      console.error('Error details:', err.message)
      setResultMessage(`Upload failed: ${err.message}`)
      setAppState('captured') // Stay in captured state to allow retry
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Hidden canvas for capturing (always rendered) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Hidden video element for camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="hidden"
        />

        {/* Loading View (overlay) */}
        {appState === 'loading' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-spin text-6xl mb-6">⏳</div>
            <p className="text-gray-700 text-2xl font-bold mb-8">
              Posting...
            </p>

            <div className="bg-indigo-50 rounded-xl p-6 min-h-[120px] flex flex-col justify-center">
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-2">
                Thank you for participating!
              </p>
              <p className="text-gray-800 text-base leading-relaxed transition-opacity duration-500">
                {ATPROTO_FACTS[currentFactIndex]}
              </p>
            </div>
          </div>
        )}

        {/* Main Single-Page View (ready & captured states) */}
        {(appState === 'ready' || appState === 'captured') && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">

            {/* Info Text */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-1000 mb-2">
                Say 👋
              </h1>
              <p className="text-xs text-gray-500">
                photo will post to @elevatorselfies.bsky.social
              </p>
            </div>

            {/* Large Square Camera/Preview */}
            <div className="relative w-full aspect-square mb-4 bg-black rounded-xl overflow-hidden">
              {appState === 'ready' && (
                // Live camera with real-time pixel manipulation filter
                <canvas
                  ref={livePreviewCanvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                />
              )}

              {appState === 'captured' && (
                // Captured photo preview (filter already applied during capture)
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Single Row Filter Selector - Tiny Live Previews */}
            <div className="flex gap-2 mb-4 justify-center">
              {Object.entries(filters).map(([key]) => (
                <button
                  key={key}
                  onClick={() => setSelectedFilter(key)}
                  disabled={appState === 'captured'}
                  className={`
                    relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-200
                    ${selectedFilter === key
                      ? 'ring-4 ring-purple-500 shadow-lg'
                      : 'ring-2 ring-gray-200'
                    }
                    ${appState === 'captured'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-110 active:scale-95'
                    }
                  `}
                >
                  {/* Live canvas preview with actual filter applied */}
                  <div className="relative w-full h-full bg-black">
                    <canvas
                      ref={(el) => {
                        if (el) filterCanvasRefs.current[key] = el
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            {appState === 'ready' && (
              <button
                onClick={capturePhoto}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                cheese!
              </button>
            )}

            {appState === 'captured' && (
              <div className="space-y-3">
                <button
                  onClick={uploadPhoto}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  post
                </button>
                <button
                  onClick={retakePhoto}
                  className="w-full bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-600 transition-colors"
                >
                  retake
                </button>
              </div>
            )}

            {/* Error message */}
            {resultMessage && appState === 'captured' && (
              <div className="mt-4 bg-red-100 border-2 border-red-500 text-red-700 p-3 rounded-xl text-sm">
                {resultMessage}
              </div>
            )}
          </div>
        )}

        {/* General error display */}
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-xl mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
