import { useEffect, useState } from 'react'

export default function ElevatorSelfie() {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    fetch('/elevatorSelfie.html')
      .then(response => response.text())
      .then(html => setHtmlContent(html))
      .catch(error => console.error('Error loading elevatorSelfie.html:', error))
  }, [])

  return (
    <div className="raw-html" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  )
}
