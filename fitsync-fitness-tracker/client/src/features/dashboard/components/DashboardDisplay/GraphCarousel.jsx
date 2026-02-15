import { useEffect, useState, useRef, useMemo } from "react";

export default function GraphCarousel({
  children,
  interval = 10000,
}) {
  // Checks if children are in an array if not places them in an array.
  const slides = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeout = useRef(null);
  const intervalRef = useRef(null);
  const isHoveringRef = useRef(false);

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
    clearTimeout(animationTimeout.current);
    animationTimeout.current = setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    return () => clearTimeout(animationTimeout.current);
  }, []);

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    stopInterval();
  };

  const handleMouseLeave = () => {
    if (!isHoveringRef.current) return;
    isHoveringRef.current = false;
    startInterval();
  };

  return (
    <div className="relative w-full h-full min-w-[300px] overflow-hidden">
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div 
          key={i} 
          className="w-full h-[500px] px-25 flex-shrink-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
            {slide}
          </div>
        ))}
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10
                   bg-white/80 hover:bg-white text-gray-800
                   rounded-full p-2 shadow-md transition"
        aria-label="Previous chart"
      >
        &lt;
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10
                   bg-white/80 hover:bg-white text-gray-800
                   rounded-full p-2 shadow-md transition"
        aria-label="Next chart"
      >
        &gt;
      </button>
    </div>
  );
}