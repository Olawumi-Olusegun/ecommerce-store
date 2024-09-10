import React from 'react'
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <div className='w-full z-30 p-5 py-10 lg:py-20 border-b-8 border-emerald-800 border-t border-t-emerald-900/50 '>
      <div className="grid grid-cols-12 gap-5 gap-y-10">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
        <Link to={"/"} className='w-fit inline-block' >
          <img src="/logo.png" alt="logo" className='size-20' />
        </Link>
          
          <h2 className="font-bold text-2xl lg:text-4xl leading-10 mt-5 ">
            We growing up your business with personal AI Manager.
          </h2>
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-5 gap-y-10 text-sm">
          <div className='flex flex-col gap-5'>
            <h2 className="font-bold text-emerald-500">Platforms</h2>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Plans & Pricing </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Personal AI Manager </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > All Business Writer </Link>
          </div>
          <div className='flex flex-col gap-5'>
          <h2 className="font-bold text-emerald-500">Companies</h2>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Blog </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Careers </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > News </Link>
          </div>
          <div className='flex flex-col gap-5'>
          <h2 className="font-bold text-emerald-500">Resources</h2>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Documentation </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Papers </Link>
            <Link to={"#"} className='hover:translate-x-1 duration-300' > Press Conference </Link>
          </div>
          <div className='flex flex-col items-start gap-5 self-start '>
          <h2 className="font-bold text-emerald-500">Applications</h2>
            <button className='bg-emerald-800 hover:bg-emerald-900 hover:scale-105 duration-300 rounded-full px-4 py-2'>Windows</button>
            <button className='bg-emerald-800 hover:bg-emerald-900 hover:scale-105 duration-300 rounded-full px-4 py-2'>macOS</button>
          </div>
        </div>
       
      </div>
    </div>
  )
}

export default Footer