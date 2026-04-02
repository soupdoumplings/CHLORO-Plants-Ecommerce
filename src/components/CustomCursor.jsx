import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const cursorSize = isHovered ? 40 : 12;

  // Use motion values for position to avoid React re-renders on every mouse move
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - cursorSize / 2);
      mouseY.set(e.clientY - cursorSize / 2);
      if (isHidden) setIsHidden(false);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnterWindow = () => setIsHidden(false);

    // Setup interactive hovers for cursor expansion
    const setupInteractions = () => {
      const interactables = document.querySelectorAll('button, a, input, select, .cursor-pointer');
      
      const onEnter = () => setIsHovered(true);
      const onLeave = () => setIsHovered(false);

      interactables.forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

      return () => {
        interactables.forEach((el) => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        });
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnterWindow);
    
    // Slight delay to allow DOM to render dynamically
    const cleanupInteractions = setTimeout(setupInteractions, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnterWindow);
      clearTimeout(cleanupInteractions);
    };
  }, [cursorSize, isHidden, mouseX, mouseY]);

  if (typeof window === 'undefined') return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        width: cursorSize,
        height: cursorSize,
        x: cursorX,
        y: cursorY,
        backgroundColor: isHovered ? 'white' : 'transparent',
        borderColor: 'white',
        borderWidth: isHovered ? '0px' : '1px',
        opacity: isHidden ? 0 : 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    />
  );
};

export default CustomCursor;
