import { useEffect, useState } from 'react'

export default function Carousel({ items, interval = 3000 }){

    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ isTransforming, setIsTransforming ] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [items.length, interval]);

    return (
        <div className="flex relative w-full h-auto items-center overflow-hidden">
            <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {items.map((src, i) => (
                <div key={i} className="flex w-full items-center justify-center pb-15 flex-shrink-0">
                    <img key={src} src={src} alt={`Slide ${i}`} className="w-auto" />
                </div>
                ))}
            </div>

            <button
            onClick={() =>
            setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
            }
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white">
                Prev
            </button>
            <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white">
                Next
            </button>
        </div>
    )
}