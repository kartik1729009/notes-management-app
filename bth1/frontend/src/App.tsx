import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element = {<div><Signup/></div>}/>
      <Route path='/login' element = {<div><Login/></div>}/>
      <Route path='*' element = {<div>Not Found</div>}/>
    </Routes>

    </>
  )
}

export default App
