import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Subject from './pages/Subject'
import Chapter from './pages/Chapters'
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element = {<div><Home/></div>}/>
        <Route path='/subject' element = {<div><Subject/></div>}/>
        <Route path='/chapter' element = {<div><Chapter/></div>}/>
      </Routes>
      
    </>
  )
}

export default App
