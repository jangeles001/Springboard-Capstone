import { useEffect, useState, useRef } from 'react'

export default function Carousel({ items, interval = 3000 }){

    const [ activeIndex, setActiveIndex ] = useState(1);
    const [ isTransitioning, setIsTransitioning  ] = useState(true);
    const timerID = useRef(null);

    const totalSlides = items.length;

    const clearTimer = () => {
        if(timerID.current) {
            clearInterval(timerID.current)
            timerID.current = null;
        }
    };

    const resetTimer = () => {
        clearTimer();
        timerID.current = setInterval(() => {
            nextSlide(false);
        }, interval)
    }

    useEffect(() => {
        resetTimer();
        
        return () => clearTimer();

    }, [interval]);


    const nextSlide = (reset = true) => {
        setActiveIndex((prev) => prev + 1);
        if (reset) {
            resetTimer()
        };
    }

    const prevSlide = () => {
        setActiveIndex((prev) => prev - 1);
        resetTimer();
    }

    const handleTransitionEnd = () => {
    if (activeIndex === totalSlides + 1) {
      setIsTransitioning(false);
      setActiveIndex(1);
    }
    if (activeIndex === 0) {
      setIsTransitioning(false);
      setActiveIndex(totalSlides);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => setIsTransitioning(true));
    }
  }, [isTransitioning]);

    return (
        <div className="flex relative w-full h-auto items-center overflow-hidden">
            <div
            className={`flex ${isTransitioning ? "transition-transform duration-500" : ""}`}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}>

                <div className="flex w-full items-center justify-center pb-15 flex-shrink-0">
                    <img src={items[totalSlides - 1]} alt="Clone last" />
                </div>

                {items.map((src, i) => (
                <div key={i} className="flex w-full items-center justify-center pb-15 flex-shrink-0">
                    <img key={src} src={src} alt={`Slide ${i}`} className="w-auto" />
                </div>
                ))}

                <div className="flex w-full items-center justify-center pb-15 flex-shrink-0">
                    <img src={items[0]} alt="Clone first" />
                </div>

            </div>

            <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white">
                Prev
            </button>
            <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-700 text-white">
                Next
            </button>
        </div>
    )
}