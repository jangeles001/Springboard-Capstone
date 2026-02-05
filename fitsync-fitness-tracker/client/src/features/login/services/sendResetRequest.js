import { api } from '../../../services/api';

export function sendResetRequest(formDataEmail) {
    console.log('Sending reset password request for email:', formDataEmail);
    const response = api.post(`/auth/reset-password/`, formDataEmail);
    
    return response.data;
} 