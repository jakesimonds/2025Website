export default function Projects() {
  return (
    <div className="prose max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-2">Project 1</h2>
          <p className="text-gray-700 mb-4">
            Description of your first project. What technologies did you use?
            What problem does it solve?
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            View Project →
          </a>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-2">Project 2</h2>
          <p className="text-gray-700 mb-4">
            Description of your second project. Add links to GitHub, live demos,
            or case studies.
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
            View Project →
          </a>
        </div>
      </div>
    </div>
  )
}
