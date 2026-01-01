import { useLogout } from "../hooks/useLogout";
import { useRouter,  } from "@tanstack/react-router";

export default function LogoutButton(){
    const router = useRouter();
    const handleLogout = useLogout({
        onSuccess: () => router.navigate({ to: '/'})
    });

    return (
        <div className="hover:cursor-pointer" onClick={handleLogout}>
            <button className="hover:underline hover:cursor-pointer" onClick={handleLogout}>Logout</button>
        </div>
    )
}