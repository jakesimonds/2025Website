import SocialLinks from '../components/SocialLinks'

export default function About() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700 mb-4">
          This is where you can share information about yourself, your background,
          skills, and experience.
        </p>
        <h2 className="text-2xl font-semibold mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">JavaScript</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Tailwind CSS</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Web Development</span>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Contact</h2>
        <p className="text-gray-700 mb-4">
          Feel free to reach out via email or connect on social media.
        </p>
        <SocialLinks size="md" />
      </div>
    </div>
  )
}
