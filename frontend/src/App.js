import { Route, BrowserRouter,Routes } from "react-router-dom";
import Footer from "./components/Footer";
import React, {useState, useEffect} from 'react';
import Navbar from "./components/Navbar.js";
import Home from "./pages/home.js";
import NotFound from "./pages/notFound.js";
import DropdownMenu from "./components/DropDown.js";
import Banner from "./components/Banner";


function App() {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    const HideMenu = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', HideMenu);

    return () => {
      window.removeEventListener('resize', HideMenu);
    }
  })



  return (
    <div className='transition duration-500'>
      <Banner />
      
      <Navbar toggle={toggle}/>
      <DropdownMenu isOpen={isOpen} toggle={toggle}/>

      {/* <Home /> */}
       <Routes>
       <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound/>} />
       </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
