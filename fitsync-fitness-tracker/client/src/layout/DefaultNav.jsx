import { Outlet, Link } from '@tanstack/react-router'
import { useState } from 'react'
import CookiesNotification from '../features/cookies/component/CookiesNotification'
import logo from '../assets/Rebrand-2.svg'
import ProfileBlock from '../components/ProfileBlock'
import LogoutButton from '../features/logout/components/LogoutButton'
import HamburgerMenu from '../components/HamburgerMenu'
import { useUsername } from '../store/UserStore'
import { useAuthUser } from '../hooks/useAuthUser'


export default function DefaultNav({ links, queryEnabled = true }) {
  const { isLoading } = useAuthUser(queryEnabled);
  const username = useUsername();
  const [hamburgerOpen, setHamburgerOpen] = useState(false)

  if (isLoading && !username) return <div>Loading...</div>;

  return (
    <div className="w-full border-b bg-gray-100">
      <header className="relative z-40 border-b">
        <div className="max-w-screen flex items-center px-4 py-4">
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-32" />
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex mt-auto gap-6 min-w-min">
          {links.map((link) => (
            <Link
            key={link.path}
            to={link.path}
            activeOptions={{ exact: true }}
            activeProps={{ className: "font-bold text-blue-500" }}
            className="hover:underline"
            >
              {link.label}
            </Link>
          ))}
          {username && <LogoutButton />}
        </nav>


        {/* Hamburger Menu */}
          <button
          className="lg:hidden mt-auto p-2 rounded-md hover:bg-gray-200"
          onClick={() => setHamburgerOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          >
            <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {
            hamburgerOpen && 
              <HamburgerMenu links={links} setHamburgerOpen={setHamburgerOpen} username={username} />
          }

        {/* Right-side actions */}
        <div className="ml-auto mt-auto pl-[40px] flex mr-[50px] min-w-max">
          {username ? (
            <>
              <ProfileBlock />
            </>
          ) : (
            <Link className="border rounded-md p-3 mt-5" to={"/auth/login"}>
              Login
            </Link>
          )}
        </div>
        </div>
      </header>
      <hr className='w-full'/>
      <main className='flex-1 min-h-[600px] w-full bg-gray-100'>
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10"></footer>
      <CookiesNotification />
    </div>
  )
}