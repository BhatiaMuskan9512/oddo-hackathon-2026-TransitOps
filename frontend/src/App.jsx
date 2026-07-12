import { useState } from 'react'

import heroImg from './assets/hero.png'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'

import "./App.css";
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import VehiclesPage from './pages/VehiclesPage';
import DriversPage from './pages/DriversPage';
import TripsPage from './pages/TripsPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
        <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/layout" element={<Layout/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/vehicles" element={<VehiclesPage/>}/>
        <Route path="/drivers" element={<DriversPage/>}/>
        <Route path="/trips" element={<TripsPage/>}/>


      </Routes>
    </Router>
     
    </>
  )
}
export default App
