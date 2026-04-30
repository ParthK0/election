import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

const CursorGlow = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-0 lg:opacity-100"
      style={{
        background: `radial-gradient(600px circle at ${springX}px ${springY}px, rgba(139, 92, 246, 0.07), transparent 80%)`,
      }}
    />
  );
};

export default CursorGlow;
