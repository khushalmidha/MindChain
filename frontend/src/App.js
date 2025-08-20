import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import React from 'react'
import Navbar from './components/Navbar.js'
import Home from './pages/home.js'
import NotFound from './pages/notFound.js'
import Activities from './pages/activities.js'
import CalmColorMatching from './components/colorMatching.js'
import Breadth from './components/Breadth.js'
import Workshop from './pages/workshop.js'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Transactions from './pages/transactions.js'
import CreateWorkshop from './pages/createWorkshop.js'
import About from './pages/about.js'
import PersonalWorkshop from './pages/personalWorkshop.js'
function App() {
  return (
    <div className='transition duration-500 bg-[#fdf5eb] bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 min-h-screen overflow-x-hidden'>
      <ToastContainer
        position='bottom-right'
        autoClose={2000}
        limit={5}
        hideProgressBar={false}
        newestOnTop={true}
        pauseOnFocusLoss={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme='dark'
      />
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/activities'
          element={<Activities />}
        />
        <Route
          path='*'
          element={<NotFound />}
        />
        <Route
          path='/meditate'
          element={<Breadth />}
        />
        <Route
          path='/workshop'
          element={<Workshop />}
        />
        <Route
          path='/color-matching'
          element={<CalmColorMatching />}
        />
        <Route
          path='/my-transactions'
          element={<Transactions />}
        />
        <Route
          path='/create-workshop'
          element={<CreateWorkshop />}
        />
        <Route
          path='/about'
          element={<About />}
        />
        <Route
          path='/my-Workshops'
          element={<PersonalWorkshop />}
        />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
