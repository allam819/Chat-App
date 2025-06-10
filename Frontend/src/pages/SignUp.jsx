import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverUrl } from '../main'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
    let navigate = useNavigate()
    let [show, setShow] = useState(false)
    let [userName, setUserName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err, setErr] = useState("")
    let dispatch = useDispatch()

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(`${serverUrl}/api/auth/signup`, {
                userName, email, password
            }, {withCredentials: true})
            dispatch(setUserData(result.data))
            navigate("/profile")
            setEmail("")
            setPassword("")
            setLoading(false)
            setErr("")
        } catch (error) {
            console.log(error)
            setLoading(false)
            setErr(error?.response?.data?.message)
        }
    }

    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4'>
            <div className='w-full max-w-[500px] bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden'>
                <div className='w-full h-[200px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-[30%] shadow-lg flex flex-col items-center justify-center relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20'></div>
                    <h1 className='text-white font-bold text-[32px] relative z-10 mb-2'>Create Account</h1>
                    <p className='text-white/90 text-lg relative z-10'>Join <span className='font-semibold'>ChatIT</span> today</p>
                </div>
                
                <form className='w-full flex flex-col gap-[20px] items-center p-8' onSubmit={handleSignUp}>
                    <div className='w-full space-y-4'>
                        <input 
                            type="text" 
                            placeholder='Username' 
                            className='w-full h-[50px] px-6 py-2 bg-white rounded-xl shadow-md border border-purple-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-gray-700 text-[17px]' 
                            onChange={(e)=>setUserName(e.target.value)} 
                            value={userName}
                        />
                        
                        <input 
                            type="email" 
                            placeholder='Email' 
                            className='w-full h-[50px] px-6 py-2 bg-white rounded-xl shadow-md border border-purple-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-gray-700 text-[17px]' 
                            onChange={(e)=>setEmail(e.target.value)} 
                            value={email}
                        />
                        
                        <div className='w-full h-[50px] relative'>
                            <input 
                                type={show ? "text" : "password"} 
                                placeholder='Password' 
                                className='w-full h-full px-6 py-2 bg-white rounded-xl shadow-md border border-purple-100 outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 text-gray-700 text-[17px]' 
                                onChange={(e)=>setPassword(e.target.value)} 
                                value={password}
                            />
                            <button 
                                type="button"
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300 text-[15px] font-medium'
                                onClick={()=>setShow(prev=>!prev)}
                            >
                                {show ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {err && <p className='text-red-500 text-sm'>{"*" + err}</p>}
                    
                    <button 
                        className='w-full max-w-[200px] h-[45px] bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-[17px]' 
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Sign Up"}
                    </button>
                    
                    <p className='text-gray-600'>
                        Already have an account? {" "}
                        <button 
                            type="button"
                            className='text-blue-500 hover:text-blue-700 font-semibold transition-colors duration-300'
                            onClick={()=>navigate("/login")}
                        >
                            Login
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp
