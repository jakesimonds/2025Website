export default function Blog() {
  return (
    <div className="fixed inset-0 top-16 left-0 right-0 bottom-0">
      {/* Leaflet iframe embed - full screen minus header */}
      <iframe
        src="https://latenthomer.leaflet.pub/"
        title="Leaflet Blog Content"
        className="w-full h-full border-0"
      />
    </div>
  )
}
