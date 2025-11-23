import { useState, useRef, useEffect } from 'react'

export default function ScoreSettlin() {
  const [appState, setAppState] = useState('ready') // ready, captured, loading, success
  const [stream, setStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [resultMessage, setResultMessage] = useState('')
  const [error, setError] = useState('')

  // Form fields
  const [claim, setClaim] = useState("dogs don't like to play fetch")
  const [claimTouched, setClaimTouched] = useState(false)
  const [walletAddress, setWalletAddress] = useState('jakesimonds.eth')
  const [walletTouched, setWalletTouched] = useState(false)

  const videoRef = useRef(null)
  const cameraVideoRef = useRef(null)
  const canvasRef = useRef(null)
  const livePreviewCanvasRef = useRef(null)
  const filterCanvasRefs = useRef({})

  // Filter definitions
  const filters = {
    none: {
      name: 'Normal',
      process: (imageData) => imageData
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

  // Pixel-level filter functions
  const applySepiaFilter = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
      data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
      data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
    }
    return imageData
  }

  const applyPosterizeFilter = (imageData) => {
    const data = imageData.data
    const levels = 3
    for (let i = 0; i < data.length; i += 4) {
      const step = 255 / (levels - 1)
      data[i] = Math.round(data[i] / step) * step
      data[i + 1] = Math.round(data[i + 1] / step) * step
      data[i + 2] = Math.round(data[i + 2] / step) * step
    }
    return imageData
  }

  const applyInvertFilter = (imageData) => {
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]
      data[i + 1] = 255 - data[i + 1]
      data[i + 2] = 255 - data[i + 2]
    }
    return imageData
  }

  // Real-time canvas preview
  useEffect(() => {
    if (!stream || appState !== 'ready') return

    const interval = setInterval(() => {
      const video = videoRef.current

      // Update main preview canvas
      const mainCanvas = livePreviewCanvasRef.current
      if (mainCanvas && video && video.videoWidth && video.videoHeight) {
        const ctx = mainCanvas.getContext('2d')
        const size = Math.min(video.videoWidth, video.videoHeight)

        mainCanvas.width = 400
        mainCanvas.height = 400

        const sx = (video.videoWidth - size) / 2
        const sy = (video.videoHeight - size) / 2
        ctx.drawImage(video, sx, sy, size, size, 0, 0, 400, 400)

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

          if (key !== 'none') {
            const imageData = ctx.getImageData(0, 0, 64, 64)
            const filtered = filters[key].process(imageData)
            ctx.putImageData(filtered, 0, 0)
          }
        }
      })
    }, 200)

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

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
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

    if (!video.videoWidth || !video.videoHeight) {
      console.error('Video dimensions not available:', video.videoWidth, video.videoHeight)
      alert('Camera not ready. Please wait a moment and try again.')
      return
    }

    const size = Math.min(video.videoWidth, video.videoHeight)
    const maxSize = 1200
    const finalSize = Math.min(size, maxSize)

    canvas.width = finalSize
    canvas.height = finalSize

    const sx = (video.videoWidth - size) / 2
    const sy = (video.videoHeight - size) / 2

    ctx.drawImage(video, sx, sy, size, size, 0, 0, finalSize, finalSize)

    if (selectedFilter !== 'none') {
      const imageData = ctx.getImageData(0, 0, finalSize, finalSize)
      const filtered = filters[selectedFilter].process(imageData, finalSize, finalSize)
      ctx.putImageData(filtered, 0, 0)
    }

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageDataUrl)
    setAppState('captured')
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setResultMessage('')
    setAppState('ready')
  }

  // Backend config - uses .env.development or .env.production automatically
  const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL

  // Bluesky profile where bets get posted
  const BLUESKY_PROFILE = 'https://bsky.app/profile/babysfirst.pds.jakesimonds.com'

  const submitBet = async () => {
    if (!claim.trim()) {
      setResultMessage('Please enter a claim')
      return
    }
    if (!walletAddress.trim()) {
      setResultMessage('Please enter a wallet address, ENS, or email')
      return
    }
    if (!capturedImage) {
      setResultMessage('Please take a photo first')
      return
    }

    setAppState('loading')
    setResultMessage('')

    // Extract base64 data from data URL
    const base64Photo = capturedImage.split(',')[1]

    // Fire and forget - trigger Lambda, don't wait for response
    fetch(LAMBDA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        claim: claim.trim(),
        walletAddress: walletAddress.trim(),
        photo: base64Photo,
      }),
    }).catch(() => {}) // Ignore errors, we're redirecting anyway

    // Wait 2 seconds then redirect to Bluesky
    setTimeout(() => {
      window.location.href = BLUESKY_PROFILE
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Hidden video element for camera feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="hidden"
        />

        {/* Loading View */}
        {appState === 'loading' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-spin text-6xl mb-6">⏳</div>
            <p className="text-gray-700 text-2xl font-bold mb-4">
              Creating smart contract... 
            </p>
            <p className="text-gray-500">
              Posting to Bluesky and registering on Celo
            </p>
          </div>
        )}

        {/* Success View */}
        {appState === 'success' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <p className="text-gray-700 text-2xl font-bold mb-4">
              Bet Started!
            </p>
            <p className="text-gray-600 mb-6">
              Your claim has been posted to Bluesky. When someone replies T or F, the bet will resolve automatically.
            </p>
            <p className="text-green-600 font-semibold mb-6">
              If TRUE: you win 1 JTK!
            </p>
            <button
              onClick={() => {
                setAppState('ready')
                setClaim('')
                setWalletAddress('')
                setCapturedImage(null)
                setResultMessage('')
              }}
              className="w-full bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-600 transition-colors"
            >
              Start New Bet
            </button>
          </div>
        )}

        {/* Main View (ready & captured states) */}
        {(appState === 'ready' || appState === 'captured') && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">

            {/* Form Fields */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={claim}
                onFocus={() => {
                  if (!claimTouched) {
                    setClaim('')
                    setClaimTouched(true)
                  }
                }}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="CLAIM HERE"
                disabled={appState === 'captured'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
              />
              <input
                type="text"
                value={walletAddress}
                onFocus={() => {
                  if (!walletTouched) {
                    setWalletAddress('')
                    setWalletTouched(true)
                  }
                }}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="ens or wallet address"
                disabled={appState === 'captured'}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-600"
              />
            </div>

            {/* Large Square Camera/Preview */}
            <div className="relative w-full aspect-square mb-4 bg-black rounded-xl overflow-hidden">
              {appState === 'ready' && (
                <canvas
                  ref={livePreviewCanvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
                />
              )}

              {appState === 'captured' && (
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Filter Selector */}
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
                Take photo!
              </button>
            )}

            {appState === 'captured' && (
              <div className="space-y-3">
                <button
                  onClick={submitBet}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
                >
                  Submit
                </button>
                <button
                  onClick={retakePhoto}
                  className="w-full bg-gray-500 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow hover:bg-gray-600 transition-colors"
                >
                  Retake
                </button>

                {/* Small print / info section */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl text-left">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your claim will be posted to Bluesky. People will vote T/F on your claim. If you win, you get 1 JakeToken. If you lose, your image is stored in Jake's PDS (Personal Data Server) under lexicon wrong.people.look.like.this
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {resultMessage && (appState === 'captured' || appState === 'ready') && (
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
