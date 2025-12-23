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
    <div className="flex flex-col min-h-screen">
        <div className="flex flex-row bg-gray-100">
            <header className="flex-row items-center gap-4 p-2">
              <div className="flex w-auto h-auto">
                <img src={logo} alt="Logo" className="h-40" />
              </div>
                
            </header>
            <nav className="flex mt-auto ml-[4%] gap-4 mb-2">
              {links.map((link) => {
                  return ( 
                    <Link 
                    key={link.path} 
                    to={link.path} 
                    activeOptions={{ exact: true }} 
                    activeProps={{ className: " font-bold rounded-md text-blue-500"}}
                    className="hover:underline"
                    >
                      {link.label}
                    </Link>
                  )
                })}
              {username && <LogoutButton />}
            </nav>
            { username ? <ProfileBlock /> : <button className='border rounded-md ml-auto mr-5 mt-auto mb-2 max-h-min p-3'>Login</button>}
        </div>
      <hr />
      <main className='flex-1 pb-10 bg-gray-100'>
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10"></footer>
      <CookiesNotification />
    </div>
  )
}