import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import {Routes, Route, Navigate} from 'react-router-dom'
import './App.css'

const App = () => {
  const [user, setUser] = useState(null)
  const getUser =async()=>{
    try{
      const {data} = await axios.get('http://localhost:3000/auth/login/success', { withCredentials: true });
      console.log(data.user._json)
      setUser(data.user._json)
    }
    catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getUser()
  }, [])

  return (
    <div className='container'>
      <Routes>
        <Route path='/' 
               element={user? <Home user={user} />: <Navigate to="/login" />} 
        />

        <Route path='/login' 
               element={user? <Navigate to="/"/> : <Login />} 
        />

        <Route path='/signup' 
               element={user? <Navigate to="/"/>: <Signup />} 
        />


      </Routes>
    </div>
  )
}

export default App
