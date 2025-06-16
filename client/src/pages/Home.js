import { useEffect } from 'react'
import { useAuth } from '../authContext'
import { NavLink } from 'react-router-dom'

function Home() {
  const { user } = useAuth()
  useEffect(() => {
    console.log(user)
    console.log(user?.fullname)
  }, [user])

  return (
    <>
      <div className="w-full flex flex-row items-center justify-center h-full h-min-screen">
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center mt-10 relative">
      
          <h1 align="center" className="text-center text-6xl leading-snug font-bold text-text">
            Platform Terpadu untuk Freelancer & Client IT – Bersama <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">Zilium</span>
          </h1>
            <p className="text-xl w-2/3 mt-9 font-light text-center text-text max-w-xl leading-relaxed tracking-wide">
Transaksi terproteksi, milestone terstruktur, komunikasi terintegrasi—semua demi hasil profesional.            </p>
          <div className='mt-7 flex items-center justify-center space-x-3 font-normal tracking-wide'>
            <NavLink to="/service" className="text-center bg-secondary/40 text-text px-8 py-3 rounded-md hover:bg-primary hover:scale-105 transition ease-in-out duration-300">Search Project</NavLink>
            <NavLink to="/auth/register" className="text-lg font-medium text-center bg-accent text-text px-10 py-4 rounded-md hover:shadow-accent hover:shadow-[0_0px_200px_0px_rgba(0,0,0,1)] hover:scale-105 transition ease-in-out duration-300">Register Now</NavLink>
            <NavLink to="/service" className="text-center bg-secondary/40 text-text px-8 py-3 rounded-md hover:bg-primary hover:scale-105 transition ease-in-out duration-300">Explore Services</NavLink>
            </div>
          </div>
              
        </div>
    </>
  )
}

export default Home
