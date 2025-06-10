import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function SenderMessage({image, message}) {
  let scroll = useRef()
  let {userData} = useSelector(state=>state.user)
  
  useEffect(()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  },[message,image])
  
  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  }
  
  return (
    <div className='flex items-start gap-[10px] justify-end'>
      <div ref={scroll} className='w-fit max-w-[500px] px-[20px] py-[10px] bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[17px] rounded-[20px] rounded-tr-[5px] relative right-0 shadow-lg hover:shadow-xl transition-all duration-300 gap-[10px] flex flex-col'>
        {image && 
          <img 
            src={image} 
            alt="" 
            className='w-[200px] rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-zoom-in' 
            onLoad={handleImageScroll}
          />
        }
        {message && <span className='break-words'>{message}</span>}
      </div>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white/90 shadow-lg border-2 border-purple-200 hover:scale-105 transition-transform duration-300'>
        <img src={userData.image || dp} alt="" className='h-[100%] object-cover'/>
      </div>
    </div>
  )
}

export default SenderMessage