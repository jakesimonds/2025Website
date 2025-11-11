import { useLocation, useNavigate } from 'react-router-dom'

export default function ElevatorSelfieSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  const postUrl = location.state?.postUrl

  return (
    <a
      href={postUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="min-h-screen bg-white flex flex-col items-center justify-center cursor-pointer active:opacity-80 transition-opacity duration-200"
    >
      {/* Giant celebration emoji taking up most of the space */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[25rem] leading-none">🎉</div>
      </div>

      {/* Tiny text at bottom */}
      <p className="text-gray-400 text-xs pb-8">
        view post
      </p>
    </a>
  )
}
