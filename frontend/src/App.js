import { Route,Routes } from "react-router-dom";
import Footer from "./components/Footer";
import React, {useState, useEffect} from 'react';
import Navbar from "./components/Navbar.js";
import Home from "./pages/home.js";
import NotFound from "./pages/notFound.js";
import DropdownMenu from "./components/DropDown.js";
import Banner from "./components/Banner";
import Activities from "./pages/activities.js";
import CalmColorMatching from "./components/colorMatching.js";
import DivingCircleGame from "./components/DrivingCircle.js";
import Breadth from "./components/Breadth.js";
import Workshop from "./pages/workshop.js";
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
        {/* <Workshop /> */}
       {/* <Home /> */}
       <Routes>
       <Route path='/' element={<Home />} />
       <Route path="/activities" element={<Activities/>}/>
       <Route path='*' element={<NotFound/>} />
        <Route path="/colormatching" element={<CalmColorMatching />}/>
        <Route path="/drivingcircle" element={<DivingCircleGame />}/>
        <Route path="/meditate" element={<Breadth />}/>
        <Route path="/workshop" element={<workshop />}/>

       </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
