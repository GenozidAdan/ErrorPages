import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import UserDataTable from "./components/UserDataTable";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/404";
import CustomUserForm from "./components/newUser";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { motion } from "framer-motion";
{/* Forma de navegar con animaciones */}
import { AnimatePresence } from "framer-motion";
const AnimatedRoutes = () => {
  const location = useLocation();
  return(
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/register' element={<CustomUserForm />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

//Componente Home
function Home(){
  const[sesion, setSesion] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem('accessToken');
    setSesion(item !== null) // Si el item existe
  }, [])

  return(
    <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
              className="page"
            >
    {sesion ? (
      <div>
        <h1>Bienvenido usuario logueado</h1>
        <UserDataTable />
      </div>
      ) : (
        <h4>Por favor inicia sesión para ver más información</h4>
      )}
    </motion.div>
  );
}

function App() {
  const[sesion, setSesion] = useState(false);

  useEffect(() => {
    const item = localStorage.getItem('accessToken');
    setSesion(item !== null) // Si el item existe
  }, [])

  return (
    <Router>
      <Navbar sesion={sesion} />
      <div className='container mt-4'>
        <div className='row'>
          <div className='col'>            
            <AnimatedRoutes />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
