import React, { useEffect, useState, useRef } from 'react';
import { motion as Motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isOverDarkSurface, setIsOverDarkSurface] = useState(false);
  const isHiddenRef = useRef(isHidden);

  const cursorSize = isHovered ? 40 : 12;

  // Use motion values for position to avoid React re-renders on every mouse move
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 450, mass: 0.3 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Keep ref in sync without triggering hook dependencies
    isHiddenRef.current = isHidden;
  }, [isHidden]);

  useEffect(() => {
    // Highly optimized passive event handler
    const handleMouseMove = (e) => {
      // By using translateX/Y -50% in the styles, we don't need to calculate offsets here
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (isHiddenRef.current) {
        setIsHidden(false);
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnterWindow = () => setIsHidden(false);

    // Event delegation is much cheaper than binding to 100+ elements
    const handleMouseOver = (e) => {
      const isDarkSurface = e.target.closest('nav, footer, header, [data-cursor-theme="light"]');
      setIsOverDarkSurface(!!isDarkSurface);
      const isInteractable = e.target.closest('button, a, input, select, .cursor-pointer, [role="button"]');
      setIsHovered(!!isInteractable);
    };

    // Use passive listeners to prevent scrolling/input thread blocking
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.body.addEventListener('mouseenter', handleMouseEnterWindow, { passive: true });
    document.body.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.body.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]); // Empty dependencies mean event listeners are attached exactly once

  if (typeof window === 'undefined') return null;

  return (
    <Motion.div
      className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999] hidden md:block"
      style={{
        width: cursorSize,
        height: cursorSize,
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: isHovered
          ? isOverDarkSurface ? 'rgba(251, 249, 244, 0.16)' : 'rgba(49, 51, 44, 0.1)'
          : 'transparent',
        borderColor: isHovered
          ? isOverDarkSurface ? 'rgba(251, 249, 244, 0.35)' : 'transparent'
          : isOverDarkSurface ? 'rgba(251, 249, 244, 0.78)' : 'rgba(49, 51, 44, 0.62)',
        borderWidth: '1px',
        opacity: isHidden ? 0 : 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isHidden ? 0 : 1, scale: isHovered ? 1 : 1 }}
      transition={{ opacity: { duration: 0.15 }, width: { duration: 0.18 }, height: { duration: 0.18 } }}
    />
  );
};

export default CustomCursor;
