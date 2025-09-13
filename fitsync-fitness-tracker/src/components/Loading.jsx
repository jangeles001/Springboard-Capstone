export default function Loading({ type }){
    return (
        <>
            { type === 'skeleton' && 
                <div 
                className="animate-pulse space-y-4 p-6 bg-white shadow rounded-2xl h-full w-full"
                role="status"
                aria-live="polite"
                >
                    <div className="h-6 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />

                    <span className="sr-only">Loading content...</span>
                </div>
            }
            {type === 'overlay' &&
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
                    role="status"
                    aria-live="polite" 
                >
                    <div 
                        className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" 
                        aria-hidden="true"    
                    />
                    <span className="sr-only">Loading...</span>
                </div>
            }
            { type === 'full-page' &&
                <div 
                    className="flex items-center justify-center min-h-screen min-w-screen bg-gray-50"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div 
                            className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" 
                            aria-hidden="true"
                        />
                        <p className="text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
            }
            { type === 'content-only' &&
                <div 
                    className="flex items-center justify-center min-h-screen min-w-full bg-gray-50"
                    role="status"
                    aria-live="polite"
                >
                    <div className="flex flex-col items-center space-y-4">
                        <div 
                            className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" 
                            aria-hidden="true"
                        />
                        <p className="text-gray-600 font-medium">Loading...</p>
                    </div>
                </div>
            }
        </>

        

    )
    
}