export function NoImage({ label }: { label: string }) {
  return <div className="no-image" role="img" aria-label={label}>
    <svg aria-hidden="true" viewBox="0 0 48 48"><path d="M8 11h32v26H8zM8 31l9-9 7 7 5-5 11 11M31 18h.01"/></svg>
    <span>{label}</span>
  </div>;
}
