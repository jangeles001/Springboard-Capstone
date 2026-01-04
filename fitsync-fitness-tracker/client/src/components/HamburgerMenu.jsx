import { Link } from "@tanstack/react-router"
import LogoutButton from "../features/logout/components/LogoutButton"

export default function HamburgerMenu({ links, setHamburgerOpen, username }){
   return ( 
        <div className="lg:hidden absolute left-0 top-full w-screen bg-gray-50 shadow-lg border-t z-50">
            <nav className="flex flex-col gap-2 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setHamburgerOpen(false)}
                  className="py-2 px-2 rounded hover:bg-gray-200 hover:underline"
                >
                  {link.label}
                </Link>
              ))}
              {username ? (
                <div className=" px-2 py-2 hover:bg-gray-200">
                  <LogoutButton />
                </div>
              ) :
              (
                <Link className="px-2 py-2 hover:underline" to={"/auth/login"}>
                  Login
                </Link>
              )}
            </nav>
        </div>
    )
}