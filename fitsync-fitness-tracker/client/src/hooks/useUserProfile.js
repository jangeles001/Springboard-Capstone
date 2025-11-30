import { useUsername, usePublicId } from "../store/userStore";

export function useUserProfile(){
    const username = useUsername();
    const publicId = usePublicId();

    return {
        username,
        publicId
    }

}