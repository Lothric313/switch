import { useEffect, useState } from 'react';
import LightRays from './react-bits/LightRays/LightRays.jsx';

export default function HeroLight() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return <div className="hero-light" aria-hidden="true">
    <LightRays
      raysOrigin="top-center"
      raysColor="#8bbaff"
      raysSpeed={reducedMotion ? 0 : 0.45}
      lightSpread={0.32}
      rayLength={1.6}
      rayDensity={1.8}
      raySharpness={0.5}
      glow={0.55}
      haze={0.3}
      atmosphere={0.45}
      intensity={1.15}
      fadeDistance={1.05}
      followMouse={!reducedMotion}
      mouseInfluence={0.08}
      cursorShadow={false}
      clickPulse={false}
      intro={!reducedMotion}
      maxDevicePixelRatio={1.5}
    />
  </div>;
}
