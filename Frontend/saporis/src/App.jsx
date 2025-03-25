import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import './App.css'

function App() {
  return (
    <div className="min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </div>
  );
}

export default App;
