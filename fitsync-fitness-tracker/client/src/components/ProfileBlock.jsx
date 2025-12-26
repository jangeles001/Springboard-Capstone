import { useUserProfile } from "../hooks/useUserProfile.js";

export default function ProfileBlock() {
    const { username, publicId } = useUserProfile(); 
    
    return (
        <div className='ml-auto mr-5 mt-15 mb-2 border-1 rounded shadow-md min-w-60 p-1'>
        <h1 className="mt-10">Username: {username}</h1>
        <p>Public ID: {publicId}</p>
        </div>
    );
}