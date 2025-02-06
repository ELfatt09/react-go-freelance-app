import React from 'react'
import { NavLink } from 'react-router-dom'

export default function navbar() {
  return (
    <nav className='sticky-top bg-gray-800 p-5'>
      <div className='flex flex-row gap-5'>
      <NavLink to='/' className='cl'>Home</NavLink>
      <NavLink to='/Login'>Login</NavLink>
      <NavLink to='/Register'>Register</NavLink>
      </div>
    </nav>
  )
}
