import { useEffect, useRef } from 'react';

export default function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let animation;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (!reduced.matches) animation = node.animate(
        [{ opacity: 0, transform: 'translateY(25px)', filter: 'blur(5px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
        { duration: 800, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
      );
    }, { threshold: .08 });
    observer.observe(node);
    return () => { observer.disconnect(); animation?.cancel(); };
  }, [delay]);
  return <Tag ref={ref} className={className} {...props}>{children}</Tag>;
}
