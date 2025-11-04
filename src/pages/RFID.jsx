import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaMastodon, FaYoutube, FaCalendar } from 'react-icons/fa6'
import { SiBluesky } from 'react-icons/si'
import { socialConfig } from '../config/social'

const socialIcons = {
  github: { Icon: FaGithub, label: 'GitHub', color: 'bg-gray-800 hover:bg-gray-900' },
  linkedin: { Icon: FaLinkedin, label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
  youtube: { Icon: FaYoutube, label: 'YouTube', color: 'bg-red-600 hover:bg-red-700' },
  calendly: { Icon: FaCalendar, label: 'Calendly', color: 'bg-blue-500 hover:bg-blue-600' },
  bluesky: { Icon: SiBluesky, label: 'Bluesky', color: 'bg-sky-500 hover:bg-sky-600' },
  mastodon: { Icon: FaMastodon, label: 'Mastodon', color: 'bg-purple-600 hover:bg-purple-700' },
  x: { Icon: FaXTwitter, label: 'X (Twitter)', color: 'bg-black hover:bg-gray-900' },
  instagram: { Icon: FaInstagram, label: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600' },
}

export default function RFID() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Connect With Me
          </h1>
          <p className="text-gray-600">
            Tap any link to visit my profiles
          </p>
        </div>

        {/* Social Links */}
        <div className="space-y-4 mb-12">
          {Object.entries(socialConfig)
            .filter(([platform]) => socialIcons[platform])
            .map(([platform, config]) => {
              const { Icon, label, color } = socialIcons[platform]
              return (
                <a
                  key={platform}
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    ${color}
                    flex items-center gap-4 p-6 rounded-2xl
                    text-white font-semibold text-lg
                    transform transition-all duration-200
                    active:scale-95 shadow-lg
                    min-h-[80px]
                  `}
                >
                  <Icon className="text-3xl flex-shrink-0" />
                  <span className="flex-grow text-left">{label}</span>
                  <svg
                    className="w-6 h-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )
            })}
        </div>

        {/* Instructions Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            NFC Instructions
          </h2>

          <div className="space-y-4 text-gray-700">
            <p className="font-semibold text-gray-900">
              Enable NFC Tag Reading on Your Phone:
            </p>

            {/* iOS Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
                iPhone (iOS 13+)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Open <span className="font-semibold">Settings</span></li>
                <li>Scroll down and tap <span className="font-semibold">Privacy & Security</span></li>
                <li>Tap <span className="font-semibold">NFC</span> (if available)</li>
                <li>Toggle on <span className="font-semibold bg-yellow-100 px-2 py-0.5 rounded">Allow Apps to Read NFC Tags</span></li>
                <li className="text-xs text-gray-600 mt-2">
                  Note: Most iPhones automatically read NFC tags when the screen is on
                </li>
              </ol>
            </div>

            {/* Android Instructions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6,9.48L17.6,9.48c0-1.53-1.24-2.77-2.77-2.77h0c-0.65,0-1.26,0.23-1.73,0.63L12,8.15l-1.1-0.81 C10.43,6.94,9.82,6.71,9.17,6.71h0C7.64,6.71,6.4,7.95,6.4,9.48h0c0,0.85,0.37,1.62,0.96,2.15l4.64,3.93l4.64-3.93 C17.23,11.1,17.6,10.33,17.6,9.48z M6,2h12c1.1,0,2,0.9,2,2v16c0,1.1-0.9,2-2,2H6c-1.1,0-2-0.9-2-2V4C4,2.9,4.9,2,6,2z"/>
                </svg>
                Android
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Swipe down to open <span className="font-semibold">Quick Settings</span></li>
                <li>Look for the <span className="font-semibold">NFC</span> icon and tap to enable</li>
                <li className="text-xs text-gray-600">OR: Settings → Connected devices → Connection preferences → NFC</li>
              </ol>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm">
                <span className="font-semibold">💡 Tip:</span> Once NFC is enabled, simply hold your phone near an NFC tag to automatically open this page!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by NFC Technology</p>
        </div>
      </div>
    </div>
  )
}
