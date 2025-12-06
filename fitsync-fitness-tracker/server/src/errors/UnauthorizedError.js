import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError{
    constructor(){
        super("UNAUTHORIZED_REQUEST", 403, {
            type:"FORBIDDEN"
        });
    }
}