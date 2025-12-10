import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export function PortalTooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef(null);

  useEffect(() => {
    if (!visible || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    setCoords({
      top: rect.top - 10,
      left: rect.left + rect.width / 2
    });
  }, [visible]);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="inline-block cursor-pointer"
      >
        {children}
      </span>

      {visible &&
        createPortal(
          <div
            style={{
              top: coords.top,
              left: coords.left,
              transform: "translate(-50%, -100%)"
            }}
            className="fixed z-50 w-64 p-3 bg-gray-800 text-white text-sm rounded-lg shadow-xl"
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}