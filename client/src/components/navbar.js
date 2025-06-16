import { useState } from 'react'
import { useAuth } from '../authContext'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const { logout, user, auth } = useAuth()

  const [openMenu, setOpenMenu] = useState(false)

  return (
    <nav className="bg-background text-space-nowrap border-b border-primary/50 sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.svg" className="h-8" alt="Logo" />
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {auth ? (
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center text-sm bg-accent rounded-full"
                  id="user-menu-button"
                  aria-expanded={openMenu}
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-10 h-10 rounded-full"
                    src={`http://localhost:8080${user?.PersonalInfo.PfpPath}`}
                    alt="User profile"
                  />
                </button>
                {openMenu && (
                  <div
                    className="absolute z-50 mt-2 right-0 w-48 bg-primary rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <div className="px-4 py-3">
                      <span className="block text-lg text-accent font-semibold">{user?.PersonalInfo.Fullname}</span>
                      <span className="block text-xs text-text/50 truncate ">{user?.Email}</span>
                    </div>
                    <ul className="py-2" role="none">
                      <li>
                        <NavLink
                          to="/user/edit"
                          className="block px-4 py-2 text-sm text-text hover:bg-secondary"
                          role="menuitem"
                        >
                          Edit Profile
                        </NavLink>
                      </li>
                      <li>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-text hover:bg-secondary"
                          role="menuitem"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                                <NavLink to="/auth/login"  className="transition ease-in-out duration-300 text-text px-10 bg-accent hover:bg-accent/70 py-2 rounded-md font-semibold" aria-current="page">Login</NavLink>

                                <NavLink to="/auth/register"  className="transition ease-in-out duration-300 text-accent px-10 hover:text-accent/70 font-semibold" aria-current="page">Register</NavLink>

              </>
            )}
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
              <li>
                <NavLink to="/"  className="transition ease-in-out duration-300 text-text px-4 hover:text-accent font-semibold" aria-current="page">Home</NavLink>
              </li>
              <li>
                <NavLink  to="/services"  className="transition ease-in-out duration-300 text-text hover:text-accent px-4 font-semibold" aria-current="page">Services</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

