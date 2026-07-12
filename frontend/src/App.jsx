import { useState } from 'react'

import heroImg from './assets/hero.png'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'

import "./App.css";
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>

      </Routes>
    </Router>
     
    </>
  )
}
export default App
