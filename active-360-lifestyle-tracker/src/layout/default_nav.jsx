import { Outlet } from '@tanstack/react-router'
import logo from '../assets/360_thunder.png'
import CookiesNotification from '../features/cookies/component/CookiesNotification'
//import logo from '../../assets/360_hand.png'
//import logo from '../../assets/360_modern.png'

export default function Default_Nav({ links }) {
  return (
    <>
        <div className="flex flex-row">
            <header className="flex-row items-center gap-4 p-2">
                <img src={logo} alt="Logo" className="h-20 w-auto" />
            </header>
            <nav className="flex mt-auto ml-[4%] gap-4">
                {links.map((link) => {
                    return <a key={link.path} href={link.path} className="hover:underline">
                        {link.label}
                    </a>
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