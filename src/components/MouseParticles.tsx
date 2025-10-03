import { useState, useEffect } from "react";

const MouseParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Créer une nouvelle particule
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        life: 120,
        size: Math.random() * 4 + 2, // Taille augmentée
        color: Math.random() > 0.5 ? 'bg-pink-400' : 'bg-purple-400'
      };

      setParticles(prev => [...prev.slice(-20), newParticle]); // Garder seulement les 20 dernières particules
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation des particules
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 3, // Disparaît plus vite
        vx: particle.vx * 0.95,
        vy: particle.vy * 0.95
      })).filter(particle => particle.life > 0));
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`fixed rounded-full ${particle.color} pointer-events-none z-50`}
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            opacity: particle.life / 120,
            transition: 'opacity 0.2s ease-out'
          }}
        />
      ))}
    </>
  );
};

export default MouseParticles;