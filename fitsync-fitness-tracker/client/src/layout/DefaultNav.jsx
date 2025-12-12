import { Outlet, Link } from '@tanstack/react-router'
// import logo from '../assets/360_thunder.png'
import CookiesNotification from '../features/cookies/component/CookiesNotification'
//import logo from '../assets/360_hand.png'
//import logo from '../assets/360_modern.png'
// import logo from '../assets/Redesign-1.svg'
import logo from '../assets/Rebrand-2.svg'
import ProfileBlock from '../components/ProfileBlock'
import LogoutButton from '../features/logout/components/LogoutButton'


export default function DefaultNav({ links }) {
  return (
    <>
        <div className="flex flex-row bg-gray-100">
            <header className="flex-row items-center gap-4 p-2">
              <div className="flex w-auto h-auto">
                <img src={logo} alt="Logo" className="h-40" />
              </div>
                
            </header>
            <nav className="flex mt-auto ml-[4%] gap-4 mb-2">
              {links.map((link) => {
                  return <Link key={link.path} to={link.path} activeOptions={{ exact: true }} activeProps={{ className: " font-bold rounded-md text-blue-500"}} className="hover:underline">
                      {link.label}
                  </Link>
                })}
            </nav>
            {/*<ProfileBlock />*/}
        </div>
      <hr />
      <main>
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10"></footer>
      <CookiesNotification />
    </>
  )
}