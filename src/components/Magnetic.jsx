import React, { useRef, useState } from 'react';
import { motion as Motion } from 'framer-motion';

const Magnetic = ({ children, magnetism = 30 }) => {
  const ref = useRef(null);
  const boundsRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const canUseMagnet = () => (
    typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  const updateBounds = () => {
    if (!ref.current || !canUseMagnet()) return;
    boundsRef.current = ref.current.getBoundingClientRect();
  };

  const handleMouse = (e) => {
    if (!canUseMagnet()) return;
    const { clientX, clientY } = e;
    const bounds = boundsRef.current || ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const { height, width, left, top } = bounds;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * (magnetism / 100), y: middleY * (magnetism / 100) });
  };

  const reset = () => {
    boundsRef.current = null;
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <Motion.div
      ref={ref}
      onMouseEnter={updateBounds}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </Motion.div>
  );
};

export default Magnetic;
