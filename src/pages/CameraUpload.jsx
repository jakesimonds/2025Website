import { useState, useRef, useEffect } from 'react'

export default function CameraUpload() {
  const [view, setView] = useState('filterSelect') // filterSelect, camera, preview, loading, result
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('none') // Default to no filter
  const [resultMessage, setResultMessage] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [error, setError] = useState('')

  const videoRef = useRef(null)
  const cameraVideoRef = useRef(null)
  const canvasRef = useRef(null)

  // Filter definitions - no filter + 3 simple, reliable filters
  const filters = {
    none: {
      name: 'Normal',
      css: 'none',
      process: (imageData) => imageData // No processing, return as-is
    },
    sepia: {
      name: 'Vintage',
      css: 'sepia(1)',
      process: (imageData) => applySepiaFilter(imageData)
    },
    contrast: {
      name: 'Dramatic',
      css: 'grayscale(1) contrast(2.5) brightness(0.9)',
      process: (imageData) => applyContrastFilter(imageData)
    },
    invert: {
      name: 'Inverted',
      css: 'invert(1)',
      process: (imageData) => applyInvertFilter(imageData)
    }
  }

  // Pixel-level filter functions - simple and reliable
  const applyGrayscaleFilter = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      // Standard grayscale formula
      const gray = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114)
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
    return imageData
  }

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

  const applyContrastFilter = (imageData) => {
    const data = imageData.data
    const contrast = 2.5 // Increased from 1.8
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    for (let i = 0; i < data.length; i += 4) {
      // First apply grayscale
      const gray = (data[i] * 0.299) + (data[i + 1] * 0.587) + (data[i + 2] * 0.114)

      // Then apply high contrast
      let adjusted = factor * (gray - 128) + 128

      // Slight darkening for drama
      adjusted = adjusted * 0.9 // Increased darkening from 0.95

      // Clamp values
      adjusted = Math.max(0, Math.min(255, adjusted))

      data[i] = adjusted
      data[i + 1] = adjusted
      data[i + 2] = adjusted
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

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  // Start camera immediately on mount
  useEffect(() => {
    startCameraForPreview()
  }, [])

  const startCameraForPreview = async () => {
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
      }, 100)
    } catch (err) {
      console.error('Camera error:', err)
      setError('Camera access denied. Please enable camera permissions and try again.')
    }
  }

  const selectFilterAndContinue = (filterKey) => {
    setSelectedFilter(filterKey)
    setView('camera')
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

    // Convert canvas to data URL for preview
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)

    // Stop camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }

    setView('preview')
  }

  const retakePhoto = async () => {
    setCapturedImage(null)
    setView('filterSelect')
  }

  const uploadPhoto = async () => {
    if (!capturedImage) {
      console.error('No captured image available')
      return
    }

    setView('loading')

    // Apply filter to image before uploading using pixel manipulation
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()

    await new Promise((resolve) => {
      img.onload = () => {
        // Draw original image to canvas
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        // Apply pixel-level filter
        if (selectedFilter && filters[selectedFilter]) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const filteredData = filters[selectedFilter].process(imageData)
          ctx.putImageData(filteredData, 0, 0)
        }

        resolve()
      }
      img.src = capturedImage
    })

    // Get filtered image data
    const filteredImageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    const base64Data = filteredImageDataUrl.split(',')[1]

    // Check size
    const sizeInBytes = (base64Data.length * 3) / 4
    const sizeInMB = sizeInBytes / (1024 * 1024)

    if (sizeInMB > 1) {
      alert('Image is too large. Please try again.')
      setView('preview')
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
          timestamp: new Date().toISOString()
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      console.log('Response headers:', Object.fromEntries(response.headers))

      const result = await response.json()
      console.log('Response body:', result)

      if (result.success) {
        setResultMessage('Posted to Bluesky!')
        setPostUrl(result.postUrl || '')
      } else {
        setResultMessage(`Error: ${result.error || 'Upload failed'}`)
      }
    } catch (err) {
      console.error('Upload error:', err)
      console.error('Error details:', err.message)
      setResultMessage(`Upload failed: ${err.message}`)
    }

    setView('result')
  }

  const resetApp = () => {
    setView('filterSelect')
    setCapturedImage(null)
    setSelectedFilter('none')
    setResultMessage('')
    setPostUrl('')
    setError('')
    startCameraForPreview()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Hidden canvas for capturing (always rendered) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Filter Selection View - Live Camera Grid (No labels) */}
        {view === 'filterSelect' && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 text-center">
            {/* Hidden video element for camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(filters).map(([key, filter]) => (
                <button
                  key={key}
                  onClick={() => selectFilterAndContinue(key)}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  {/* Live video preview with filter - square crop */}
                  <div className="relative w-full h-full bg-black overflow-hidden">
                    <video
                      ref={(el) => {
                        if (el && stream) {
                          el.srcObject = stream
                          el.play().catch(e => console.log('Video play issue:', e))
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-auto min-w-full object-cover"
                      style={{ filter: filter.css === 'none' ? '' : filter.css }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera View */}
        {view === 'camera' && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 text-center">
            <div className="relative w-full aspect-square mb-4 bg-black rounded-xl overflow-hidden">
              <video
                ref={(el) => {
                  cameraVideoRef.current = el
                  if (el && stream) {
                    el.srcObject = stream
                    el.play().catch(e => console.log('Video play issue:', e))
                  }
                }}
                autoPlay
                playsInline
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                style={{ filter: filters[selectedFilter]?.css === 'none' ? '' : filters[selectedFilter]?.css }}
              />
            </div>
            <button
              onClick={capturePhoto}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Capture
            </button>
          </div>
        )}

        {/* Preview View */}
        {view === 'preview' && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 text-center">
            <div className="relative w-full aspect-square mb-4">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover rounded-xl"
                style={{ filter: filters[selectedFilter]?.css === 'none' ? '' : filters[selectedFilter]?.css }}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={uploadPhoto}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
              >
                Post to Bluesky
              </button>
              <button
                onClick={retakePhoto}
                className="w-full bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-600 transition-colors"
              >
                Choose Different Filter
              </button>
            </div>
          </div>
        )}

        {/* Loading View */}
        {view === 'loading' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-gray-700 text-xl font-medium">
              Posting to Bluesky...
            </p>
          </div>
        )}

        {/* Result View */}
        {view === 'result' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-4">
              {postUrl ? '✅' : '❌'}
            </div>
            <p className="text-gray-800 text-xl font-medium mb-6">
              {resultMessage}
            </p>
            {postUrl && (
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4"
              >
                View your post
              </a>
            )}
            <button
              onClick={resetApp}
              className="w-full bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-600 transition-colors"
            >
              Take Another Photo
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-4 rounded-xl mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
