export default function FieldErrorMessages({ field, error }) {
    return (
        <div>
            {error?.map((error,index) => (
                <p 
                key={`${field}${index}`} 
                className=' text-red-700 text-sm'
                data-testid={`${field}-error-${index}`}
                >
                    *{error}
                </p>
            ))
            }   
        </div>
    )
}