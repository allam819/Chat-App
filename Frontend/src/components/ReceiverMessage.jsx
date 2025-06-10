import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'

function ReceiverMessage({image, message}) {
  let scroll = useRef()
  let {selectedUser} = useSelector(state=>state.user)
  
  useEffect(()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  },[message,image])
  
  const handleImageScroll=()=>{
    scroll?.current.scrollIntoView({behavior:"smooth"})
  }
  
  return (
    <div className='flex items-start gap-[10px]'>
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white/90 shadow-lg border-2 border-purple-200 hover:scale-105 transition-transform duration-300'>
        <img src={selectedUser.image || dp} alt="" className='h-[100%] object-cover'/>
      </div>
      <div ref={scroll} className='w-fit max-w-[500px] px-[20px] py-[10px] bg-white text-gray-700 text-[17px] rounded-[20px] rounded-tl-[5px] relative left-0 shadow-lg hover:shadow-xl transition-all duration-300 gap-[10px] flex flex-col'>
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
    </div>
  )
}

export default ReceiverMessage
