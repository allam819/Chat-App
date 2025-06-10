import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoIosSearch } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { BiLogOutCircle } from "react-icons/bi";
import { serverUrl } from '../main';
import axios from 'axios';
import { setOtherUsers, setSearchData, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function SideBar() {
    let {userData,otherUsers,selectedUser,onlineUsers,searchData} = useSelector(state=>state.user)
    let [search,setSearch]=useState(false)
    let [input,setInput]=useState("")
    let dispatch=useDispatch()
    let navigate=useNavigate()

    const handleLogOut=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setOtherUsers(null))
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const handlesearch=async ()=>{
        try {
            let result =await axios.get(`${serverUrl}/api/user/search?query=${input}`,{withCredentials:true})
            dispatch(setSearchData(result.data))
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
            handlesearch()
        }
    },[input])

    return (
        <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-gradient-to-b from-slate-50 to-slate-100 relative ${!selectedUser?"block":"hidden"}`}>
            <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white cursor-pointer shadow-lg transition-all duration-300 fixed bottom-[20px] left-[10px] z-[1000]' onClick={handleLogOut}>
                <BiLogOutCircle className='w-[25px] h-[25px]'/>
            </div>

            {input.length>0 && 
                <div className='flex absolute top-[250px] bg-white/95 backdrop-blur-sm w-full h-[500px] overflow-y-auto items-center pt-[20px] flex-col gap-[10px] z-[150] shadow-xl rounded-t-2xl'>
                    {searchData?.map((user)=>(
                        <div className='w-[95%] h-[70px] flex items-center gap-[20px] px-[10px] hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-b border-gray-200 cursor-pointer transition-all duration-300' 
                            onClick={()=>{
                                dispatch(setSelectedUser(user))
                                setInput("")
                                setSearch(false)
                            }}>
                            <div className='relative rounded-full bg-white flex justify-center items-center'>
                                <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center border-2 border-purple-200'>
                                    <img src={user.image || dp} alt="" className='h-[100%] object-cover'/>
                                </div>
                                {onlineUsers?.includes(user._id) &&
                                    <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-green-400 shadow-lg border-2 border-white'></span>
                                }
                            </div>
                            <h1 className='text-gray-700 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                        </div>
                    ))}
                </div>
            }

            <div className='w-full h-[300px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-[30%] shadow-lg flex flex-col justify-center px-[20px] relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20'></div>
                <h1 className='text-white font-bold text-[32px] relative z-10'>ChatIT</h1>
                <div className='w-full flex justify-between items-center relative z-10'>
                    <h1 className='text-white font-bold text-[25px]'>Hi, {userData.name || "user"}</h1>
                    <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center bg-white/90 cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300 border-2 border-purple-200' onClick={()=>navigate("/profile")}>
                        <img src={userData.image || dp} alt="" className='h-[100%] object-cover'/>
                    </div>
                </div>
                <div className='w-full flex items-center gap-[20px] overflow-y-auto py-[18px] relative z-10'>
                    {!search && 
                        <div className='w-[60px] h-[60px] mt-[10px] rounded-full overflow-hidden flex justify-center items-center bg-white/90 shadow-lg cursor-pointer hover:bg-white transition-all duration-300' onClick={()=>setSearch(true)}>
                            <IoIosSearch className='w-[25px] h-[25px] text-gray-700'/>
                        </div>
                    }

                    {search && 
                        <form className='w-full h-[60px] bg-white/90 shadow-lg flex items-center gap-[10px] mt-[10px] rounded-full overflow-hidden px-[20px] relative transition-all duration-300'>
                            <IoIosSearch className='w-[25px] h-[25px] text-gray-500'/>
                            <input type="text" placeholder='Search users...' className='w-full h-full p-[10px] text-[17px] outline-none border-0 bg-transparent' onChange={(e)=>setInput(e.target.value)} value={input}/>
                            <RxCross2 className='w-[25px] h-[25px] cursor-pointer text-gray-500 hover:text-gray-700' onClick={()=>setSearch(false)}/>
                        </form>
                    }

                    {!search && otherUsers?.map((user)=>(
                        onlineUsers?.includes(user._id) &&
                        <div className='relative rounded-full shadow-lg bg-white/90 flex justify-center items-center mt-[10px] cursor-pointer hover:scale-105 transition-transform duration-300' onClick={()=>dispatch(setSelectedUser(user))}>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center border-2 border-purple-200'>
                                <img src={user.image || dp} alt="" className='h-[100%] object-cover'/>
                            </div>
                            <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-green-400 shadow-lg border-2 border-white'></span>
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full h-[50%] overflow-auto flex flex-col gap-[20px] items-center mt-[20px] px-4'>
                {otherUsers?.map((user)=>(
                    <div className='w-full h-[70px] flex items-center gap-[20px] bg-white shadow-lg rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300 p-2' onClick={()=>dispatch(setSelectedUser(user))}>
                        <div className='relative rounded-full flex justify-center items-center'>
                            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center border-2 border-purple-200'>
                                <img src={user.image || dp} alt="" className='h-[100%] object-cover'/>
                            </div>
                            {onlineUsers?.includes(user._id) &&
                                <span className='w-[12px] h-[12px] rounded-full absolute bottom-[6px] right-[-1px] bg-green-400 shadow-lg border-2 border-white'></span>
                            }
                        </div>
                        <h1 className='text-gray-700 font-semibold text-[20px]'>{user.name || user.userName}</h1>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SideBar