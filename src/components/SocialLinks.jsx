import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram, FaMastodon, FaYoutube } from 'react-icons/fa6'
import { SiBluesky } from 'react-icons/si'
import { socialConfig } from '../config/social'

const socialIcons = {
  github: { Icon: FaGithub, label: 'GitHub' },
  linkedin: { Icon: FaLinkedin, label: 'LinkedIn' },
  youtube: { Icon: FaYoutube, label: 'YouTube' },
  bluesky: { Icon: SiBluesky, label: 'Bluesky' },
  mastodon: { Icon: FaMastodon, label: 'Mastodon' },
  x: { Icon: FaXTwitter, label: 'X' },
  instagram: { Icon: FaInstagram, label: 'Instagram' },
}

export default function SocialLinks({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  }

  return (
    <div className="flex gap-4 items-center">
      {Object.entries(socialConfig)
        .filter(([platform]) => socialIcons[platform]) // Only show platforms with icons
        .map(([platform, config]) => {
          const { Icon, label } = socialIcons[platform]
          return (
            <a
              key={platform}
              href={config.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`
                ${sizeClasses[size]}
                flex items-center justify-center
                rounded-full
                bg-gray-900 text-white
                hover:bg-gray-700
                transition-colors duration-200
              `}
            >
              <Icon />
            </a>
          )
        })}
    </div>
  )
}
