export default function FieldErrorMessages({ field, error }) {
    return (
        <div>
            {error.map((error) => <p key={`${field}`} className='text-red-700 text-sm'>
                *{error}
                </p>
                )
            }   
        </div>
    )
}