import { useLogout } from "../hooks/useLogout";
import { useRouter,  } from "@tanstack/react-router";

export default function LogoutButton(){
    const router = useRouter();
    const handleLogout = useLogout({
        onSuccess: () => router.navigate({ to: '/'})
    });

    return (
        <div className="border-2">
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}