export function Arrow({ direction = 'up', ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d={direction === 'down' ? 'M12 4v16m-6-6 6 6 6-6' : direction === 'left' ? 'M20 12H4m6-6-6 6 6 6' : direction === 'right' ? 'M4 12h16m-6-6 6 6-6 6' : 'M5 19 19 5M5 5h14v14'} /></svg>;
}
export function SocialIcon({ id, ...props }) {
  const paths = {
    telegram: <path d="m21 4-3.5 16-5.5-4.2-3 2.7.7-5L18 6.5 7.7 12.8 3 11.3 21 4Z" />,
    tiktok: <path d="M14 3v12.3a4.7 4.7 0 1 1-4-4.6v3.2a1.7 1.7 0 1 0 1 1.5V3h3Zm0 0c.5 3 2.2 4.8 5 5v3c-2-.2-3.7-1-5-2.4" />,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 6 3-6 3V9Z" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[id]}</svg>;
}
