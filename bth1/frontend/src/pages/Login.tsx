// import React from 'react'

import { Link } from "react-router-dom"
import axios from "axios"
import { useState } from "react"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful", response.data);
      alert("Login successful");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Email</label>
        <input type='email' placeholder='enter your name' value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>
        <label>Password</label>
        <input type='password' placeholder='enter your name' value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
        <button type="submit">Login</button><br/>
        <Link to="/">Signup</Link>
      </form>
    </div>
  )
}

export default Login
