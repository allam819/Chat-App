import React from 'react'
import SideBar from '../components/sidebar'
import MessageArea from '../components/MessageArea'
import { useSelector } from 'react-redux'
import getMessage from '../customHooks/getMessages'
const Home = () => {
  
  getMessage()
  return (
    <div className='w-full h-[100vh] flex overflow-hidden'>
      <SideBar/>
      <MessageArea/>
    </div>
  )
}

export default Home
