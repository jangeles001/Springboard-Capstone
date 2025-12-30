import { Outlet, Link } from '@tanstack/react-router'
// import logo from '../assets/360_thunder.png'
import CookiesNotification from '../features/cookies/component/CookiesNotification'
//import logo from '../assets/360_hand.png'
//import logo from '../assets/360_modern.png'
// import logo from '../assets/Redesign-1.svg'
import logo from '../assets/Rebrand-2.svg'
import ProfileBlock from '../components/ProfileBlock'
import LogoutButton from '../features/logout/components/LogoutButton'
import { useUsername } from '../store/UserStore'
import { useAuthUser } from '../hooks/useAuthUser'


export default function DefaultNav({ links, queryEnabled = true }) {
  const { isLoading } = useAuthUser(queryEnabled);
  const username = useUsername();

  if (isLoading && !username) return <div>Loading...</div>;

  return (
    <>
      <header className="flex items-center bg-gray-100 px-4">
        <div className="flex-shrink-0">
          <img src={logo} alt="Logo" className="h-32 w-auto" />
        </div>

        {/* Nav links */}
        <nav className="flex mt-25 p-10 gap-4">
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

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-4">
          {username ? (
            <>
              <ProfileBlock />
            </>
          ) : (
            <button className="border rounded-md p-3 mt-5">Login</button>
          )}
        </div>
      </header>
      <hr />
      <main className='flex-1 min-h-[600px] min-w-[1000px] bg-gray-100'>
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10"></footer>
      <CookiesNotification />
    </>
  )
}