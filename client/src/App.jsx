import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import Homepage from './pages/Homepage'


axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true

function App() {


  return (
    <BrowserRouter>
      <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
