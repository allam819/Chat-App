import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from './SenderMessage';
import ReceiverMessage from './ReceiverMessage';
import axios from 'axios';
import { serverUrl } from '../main';
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  let {selectedUser,userData,socket}=useSelector(state=>state.user)
  let dispatch=useDispatch()
  let [showPicker,setShowPicker]=useState(false)
  let [input,setInput]=useState("")
  let [frontendImage,setFrontendImage]=useState(null)
  let [backendImage,setBackendImage]=useState(null)
  let image=useRef()
  let {messages}=useSelector(state=>state.message)
  
  const handleImage=(e)=>{
    let file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  
  const handleSendMessage=async (e)=>{
    e.preventDefault()
    if(input.length==0 && backendImage==null){
      return 
    }
    try {
      let formData=new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
      setShowPicker(false)
    } catch (error) {
      console.log(error)
    }
  }
  
  const onEmojiClick = (emojiData) => {
    setInput(prevInput => prevInput + emojiData.emoji)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }
  
  useEffect(()=>{
    socket?.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })

    return ()=>{
      socket?.off("newMessage")
    }
  },[messages,setMessages,socket])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const picker = document.querySelector('.emoji-picker')
      const button = document.querySelector('.emoji-button')
      if (picker && !picker.contains(event.target) && !button.contains(event.target)) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
   
  return (
    <div className={`lg:w-[70%] relative ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-gradient-to-b from-slate-50 to-slate-100 border-l border-gray-200 overflow-hidden`}>
      {selectedUser && 
        <div className='w-full h-[100vh] flex flex-col overflow-hidden'>
          <div className='w-full h-[100px] bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center px-[20px] relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20'></div>
            <div className='flex items-center gap-[20px] relative z-10 w-full'>
              <div className='cursor-pointer transition-transform hover:scale-110' onClick={()=>dispatch(setSelectedUser(null))}>
                <IoIosArrowRoundBack className='w-[40px] h-[40px] text-white'/>
              </div>
              <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center bg-white/90 cursor-pointer shadow-lg border-2 border-purple-200 transition-transform hover:scale-105'>
                <img src={selectedUser?.image || dp} alt="" className='h-[100%] object-cover'/>
              </div>
              <div className='flex flex-col'>
                <h1 className='text-white font-semibold text-[20px]'>{selectedUser?.name || "user"}</h1>
              </div>
            </div>
          </div>

          <div className='w-full flex-1 flex flex-col py-[30px] px-[20px] overflow-auto gap-[20px] relative'>
            {messages && messages.map((mess)=>(
              mess.sender==userData._id ? 
                <SenderMessage key={mess._id} image={mess.image} message={mess.message}/> : 
                <ReceiverMessage key={mess._id} image={mess.image} message={mess.message}/>
            ))}
          </div>

          <div className='w-full px-6 pb-6 relative'>
            {showPicker && 
              <div className='absolute bottom-[80px] left-[20px] z-[200] emoji-picker'>
                <div className='absolute inset-0 -z-10 bg-black/5 backdrop-blur-sm rounded-2xl'></div>
                <EmojiPicker width={300} height={400} className='shadow-xl rounded-2xl' onEmojiClick={onEmojiClick}/>
              </div>
            }
            
            {frontendImage && 
              <div className='mb-4 relative w-fit'>
                <img src={frontendImage} alt="" className='w-[100px] h-[100px] object-cover rounded-lg shadow-lg'/>
                <button 
                  onClick={() => {
                    setFrontendImage(null)
                    setBackendImage(null)
                  }}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors'
                >
                  ×
                </button>
              </div>
            }
            
            <form className='w-full h-[60px] bg-white shadow-lg rounded-full flex items-center gap-[20px] px-[30px] relative' onSubmit={handleSendMessage}>
              <div onClick={()=>setShowPicker(prev=>!prev)} className='cursor-pointer transition-transform hover:scale-110 emoji-button'>
                <RiEmojiStickerLine className={`w-[25px] h-[25px] transition-colors ${showPicker ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}/>
              </div>
              <input type="file" accept="image/*" ref={image} hidden onChange={handleImage}/>
              <input 
                type="text" 
                className='w-full h-full px-[10px] outline-none border-0 text-[17px] text-gray-700 bg-transparent placeholder-gray-400' 
                placeholder='Type your message...' 
                onChange={handleInputChange}
                value={input}
              />
              <div onClick={()=>image.current.click()} className='cursor-pointer transition-transform hover:scale-110'>
                <FaImages className='w-[25px] h-[25px] text-gray-500 hover:text-blue-500 transition-colors'/>
              </div>
              <button type="submit" className='transition-transform hover:scale-110 disabled:opacity-50' disabled={!input.length && !backendImage}>
                <RiSendPlane2Fill className='w-[25px] h-[25px] text-blue-500 hover:text-purple-500 transition-colors'/>
              </button>
            </form>
          </div>
        </div>
      }

      {!selectedUser && 
        <div className='w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50'>
          <h1 className='text-gray-700 font-bold text-[50px] mb-4'>Welcome to ChatIT</h1>
          <span className='text-gray-600 font-semibold text-[24px] bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg'>Start chatting with your friends!</span>
        </div>
      }
    </div>
  )
}

export default MessageArea