import React, { useEffect, useState, useRef } from 'react';
import { motion as Motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [isOverDarkSurface, setIsOverDarkSurface] = useState(false);
  const isHiddenRef = useRef(isHidden);
  const isHoveredRef = useRef(isHovered);
  const isOverDarkSurfaceRef = useRef(isOverDarkSurface);

  const cursorSize = isHovered ? 46 : 24;

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
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isOverDarkSurfaceRef.current = isOverDarkSurface;
  }, [isOverDarkSurface]);

  useEffect(() => {
    // Highly optimized passive event handler
    const handleMouseMove = (e) => {
      // By using translateX/Y -50% in the styles, we don't need to calculate offsets here
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (isHiddenRef.current) {
        setIsHidden(false);
      }

      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const nextDarkSurface = Boolean(hoveredElement?.closest('nav, footer, header, [data-cursor-theme="light"]'));
      const nextHovered = Boolean(hoveredElement?.closest('button, a, input, textarea, select, label, .cursor-pointer, [role="button"]'));

      if (nextDarkSurface !== isOverDarkSurfaceRef.current) {
        isOverDarkSurfaceRef.current = nextDarkSurface;
        setIsOverDarkSurface(nextDarkSurface);
      }

      if (nextHovered !== isHoveredRef.current) {
        isHoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnterWindow = () => setIsHidden(false);

    // Use passive listeners to prevent scrolling/input thread blocking
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.body.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.body.addEventListener('mouseenter', handleMouseEnterWindow, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnterWindow);
    };
  }, [mouseX, mouseY]); // Empty dependencies mean event listeners are attached exactly once

  if (typeof window === 'undefined') return null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block">
      <Motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: cursorSize,
          height: cursorSize,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          border: `1px solid ${isOverDarkSurface ? 'rgba(251, 249, 244, 0.72)' : 'rgba(17, 17, 14, 0.48)'}`,
          backgroundColor: isHovered
            ? isOverDarkSurface ? 'rgba(251, 249, 244, 0.12)' : 'rgba(15, 58, 58, 0.08)'
            : 'transparent',
          boxShadow: isOverDarkSurface
            ? '0 0 0 1px rgba(15, 58, 58, 0.18), 0 0 28px rgba(198, 233, 233, 0.22)'
            : '0 0 0 1px rgba(251, 249, 244, 0.35), 0 10px 28px rgba(17, 17, 14, 0.10)',
          opacity: isHidden ? 0 : 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHidden ? 0 : 1, scale: isHovered ? 1.04 : 1 }}
        transition={{ opacity: { duration: 0.15 }, scale: { duration: 0.18 } }}
      >
        <span
          className="absolute left-1/2 top-1/2 h-px w-[62%] -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: isOverDarkSurface ? 'rgba(251, 249, 244, 0.35)' : 'rgba(17, 17, 14, 0.25)' }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-[62%] w-px -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: isOverDarkSurface ? 'rgba(251, 249, 244, 0.35)' : 'rgba(17, 17, 14, 0.25)' }}
        />
      </Motion.div>

      <Motion.div
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: isHovered ? 6 : 7,
          height: isHovered ? 6 : 7,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isOverDarkSurface ? '#FBF9F4' : '#0F3A3A',
          boxShadow: isOverDarkSurface
            ? '0 0 18px rgba(251, 249, 244, 0.55)'
            : '0 0 14px rgba(15, 58, 58, 0.25)',
          opacity: isHidden ? 0 : 1,
        }}
        animate={{ opacity: isHidden ? 0 : 1 }}
        transition={{ opacity: { duration: 0.12 } }}
      />
    </div>
  );
};

export default CustomCursor;
