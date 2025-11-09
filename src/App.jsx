import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Blog from './pages/Blog'
import RFID from './pages/RFID'
import Services from './pages/Services'
import ElevatorSelfie from './pages/ElevatorSelfie'
import CameraUpload from './pages/CameraUpload'


function App() {
  return (
    <Router>
      <Routes>
        {/* Main site routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/RFID" element={<RFID />} />
          <Route path="/services" element={<Services />} />
          <Route path="/takeAnElevatorSelfie" element={<ElevatorSelfie />} />
        </Route>

        {/* Standalone routes without Layout/Navigation */}
        <Route path="/qr7f9k2h8d4j6m1p3s5w" element={<CameraUpload />} />
      </Routes>
    </Router>
  )
}

export default App
