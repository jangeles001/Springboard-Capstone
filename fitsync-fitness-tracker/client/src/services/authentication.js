import axios from "axios";

export default function AuthenticateFormData(path, formData){
    try{
        const results = axios.post(path, formData);
        return results.data;
    }catch(error){
        return error.message;
    }
}