// import React from 'react'

import axios from "axios";
import { useState } from "react"
import { Link } from "react-router-dom"

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signuphandler = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
            try{
                const response = await axios.post("http://localhost:3000/api/auth/createUser", {
                fullName: name,
                email,
                password,
            })
            console.log("signup successful: ", response.data);
            alert("sign up successfull");
            }
            catch(err){
                console.error(err);
                alert("signup failed");
            }
            
        

    }

  return (
    <div>
      <form onSubmit={signuphandler}>
        <label>Full Name</label>
        <input type='text' placeholder='enter your name' value={name} onChange={(e)=>setName(e.target.value)}/><br/>
        <label>Email</label>
        <input type='email' placeholder='enter your name' value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>
        <label>Password</label>
        <input type='password' placeholder='enter your name' value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
        <button type="submit">Signup</button><br/>
        <Link to="/Login">Login</Link>
      </form>
    </div>
  )
}

export default Signup
