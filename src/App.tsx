import React from 'react';
import Admin from './pages/Admin';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';

function RequireAuth({children}:{children:React.ReactNode}){
  const token=localStorage.getItem('token');
  if(!token){ window.location.href='/login'; return <></>; }
  return children;
}

function App() {
  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
      <Route path="/admin" element={<RequireAuth><Admin/></RequireAuth>} />
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
