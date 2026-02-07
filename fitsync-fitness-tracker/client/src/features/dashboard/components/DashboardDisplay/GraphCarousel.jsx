import { useEffect, useState, useRef } from "react";

export default function GraphCarousel({
  children,
  interval = 10000,
}) {
  const slides = Array.isArray(children) ? children : [children];
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef(null);

    // Function to start the auto-slide interval
  const startInterval = () => {
    if (intervalRef.current) return; // prevent multiple intervals
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
  };

  // Function to stop the auto-slide interval
  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Auto-play
  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, [interval, slides.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 700);
  };

  const restartInterval = () => {

  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div 
          key={i} 
          className="w-full h-[500px] px-25 flex-shrink-0"
          onMouseEnter={stopInterval}
          onMouseLeave={startInterval}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Previous button */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                   bg-white/80 hover:bg-white text-gray-800
                   rounded-full p-2 shadow-md transition"
        aria-label="Previous chart"
      >
        ‹
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                   bg-white/80 hover:bg-white text-gray-800
                   rounded-full p-2 shadow-md transition"
        aria-label="Next chart"
      >
        ›
      </button>
    </div>
  );
}