import { useState, useEffect } from 'react'
import { logout, isAuthenticated } from '../auth'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
        if (isAuthenticated()) {
          setAuth(true)
        } else {
          setAuth(false)
        }
  }, [])

  return (
    <nav className='sticky-top bg-gray-800 p-5 text-gray-200'>
      <div className='flex flex-row gap-5'>
        <NavLink to='/'>Home</NavLink>
        {!auth && (
          <>
            <NavLink to='/auth/login'>Login</NavLink>
            <NavLink to='/auth/register'>Register</NavLink>
          </>
        )}
        {auth && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  )
}

