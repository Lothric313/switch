// Original CSS / SVG scene. No bitmap or WebGL is needed for the first screen.
export default function Horizon() {
  return <div className="horizon" aria-hidden="true">
    <div className="sky-haze" /><div className="sunrise" /><div className="sunrise-core" />
    <svg className="planet" viewBox="0 191 1600 600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="planetFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#080e14" /><stop offset=".4" stopColor="#050608" /></linearGradient>
        <linearGradient id="arc" x1="0" x2="1"><stop stopColor="#1e6fff" stopOpacity=".05" /><stop offset=".25" stopColor="#3b9eff" /><stop offset=".5" stopColor="#c9f6ff" /><stop offset=".75" stopColor="#3b9eff" /><stop offset="1" stopColor="#1e6fff" stopOpacity=".05" /></linearGradient>
        <filter id="glow" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <path className="arc-glow" d="M-100 442Q800 -60 1700 442" stroke="#5fd4ff" strokeWidth="13" fill="none" filter="url(#glow)" />
      <path d="M-100 442Q800 -60 1700 442V650H-100Z" fill="url(#planetFill)" />
      <path d="M-100 442Q800 -60 1700 442" stroke="url(#arc)" strokeWidth="2" fill="none" />
    </svg>
    <div className="horizon-fade" />
  </div>;
}
