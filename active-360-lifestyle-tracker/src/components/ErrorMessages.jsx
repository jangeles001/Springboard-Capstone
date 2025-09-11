export default function ErrorMessages({ errors }) {
    return (
        <div>
            {Object.entries(errors).map(([field, messages]) => {
                    return (
                        messages.map((msg, idx) => ( 
                        <p key={`${field}-${idx}`} className='text-red-700 text-sm'>
                            *{msg}
                        </p>
                        ))
                    )
                })
            } 
        </div>
    )
}