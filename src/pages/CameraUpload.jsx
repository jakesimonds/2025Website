import { useState, useRef, useEffect } from 'react'

export default function CameraUpload() {
  const [view, setView] = useState('info') // info, camera, preview, loading, result
  const [showInfoModal, setShowInfoModal] = useState(true)
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [error, setError] = useState('')

  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      setStream(mediaStream)
      setView('camera')
      setShowInfoModal(false)

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
      alert('Camera access denied. Please enable camera permissions.')
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error('Video or canvas ref not available')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Check if video dimensions are available
    if (!video.videoWidth || !video.videoHeight) {
      console.error('Video dimensions not available:', video.videoWidth, video.videoHeight)
      alert('Camera not ready. Please wait a moment and try again.')
      return
    }

    console.log('Capturing photo with dimensions:', video.videoWidth, 'x', video.videoHeight)

    // Resize to max 1200px width
    const maxWidth = 1200
    const scale = maxWidth / video.videoWidth
    canvas.width = maxWidth
    canvas.height = video.videoHeight * scale

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

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
    await startCamera()
  }

  const uploadPhoto = async () => {
    if (!capturedImage) {
      console.error('No captured image available')
      return
    }

    // capturedImage is already a data URL
    const base64Data = capturedImage.split(',')[1]

    // Check size
    const sizeInBytes = (base64Data.length * 3) / 4
    const sizeInMB = sizeInBytes / (1024 * 1024)

    if (sizeInMB > 1) {
      alert('Image is too large. Please try again.')
      return
    }

    setView('loading')

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
    setView('info')
    setShowInfoModal(true)
    setCapturedImage(null)
    setResultMessage('')
    setPostUrl('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Hidden canvas for capturing (always rendered) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Info Modal */}
        {showInfoModal && view === 'info' && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 text-center">
            <div className="text-5xl mb-4">📸</div>
            <p className="text-gray-700 text-lg font-medium mb-6">
              Photo you take will post to <span className="font-bold text-indigo-600">@elevatorselfie.jakesimonds.com</span> on Bluesky
            </p>
            <button
              onClick={startCamera}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              Take Photo
            </button>
          </div>
        )}

        {/* Camera View */}
        {view === 'camera' && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 text-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-xl mb-4 bg-black"
            />
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
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-xl mb-4"
            />
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
                Retake
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
