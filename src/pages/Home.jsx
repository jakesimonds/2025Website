import { useEffect, useState } from 'react'

export default function Home() {
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    fetch('/home.html')
      .then(response => response.text())
      .then(html => setHtmlContent(html))
      .catch(error => console.error('Error loading home.html:', error))
  }, [])

  return (
    <div className="raw-html" dangerouslySetInnerHTML={{ __html: htmlContent }} />
  )
}
