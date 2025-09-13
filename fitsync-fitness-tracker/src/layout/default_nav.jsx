import { Outlet, Link } from '@tanstack/react-router'
// import logo from '../assets/360_thunder.png'
import CookiesNotification from '../features/cookies/component/CookiesNotification'
//import logo from '../assets/360_hand.png'
//import logo from '../assets/360_modern.png'
// import logo from '../assets/Redesign-1.svg'
import logo from '../assets/Redesign-2.svg'


export default function Default_Nav({ links }) {
  return (
    <>
        <div className="flex flex-row">
            <header className="flex-row items-center gap-4 p-2">
              <div className="flex w-auto h-auto">
                <img src={logo} alt="Logo" className="h-30" />
              </div>
                
            </header>
            <nav className="flex mt-auto ml-[4%] gap-4">
                {links.map((link) => {
                    return <Link key={link.path} to={link.path} activeOptions={{ exact: true }} activeProps={{ className: " font-bold text-red-600"}} className="hover:underline">
                        {link.label}
                    </Link>
                    })}
            </nav>
        </div>
      <hr />
      <main>
        <Outlet />
      </main>
      <CookiesNotification />
    </>
  )
}