export function R3FCanvas({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#6366F1]/5 via-[#6366F1]/3 to-transparent pointer-events-none" />
  );
}
