import { useUsername, usePublicId } from "../store/UserStore";

export function useUserProfile(){
    const username = useUsername();
    const publicId = usePublicId();

    return {
        username,
        publicId
    }

}