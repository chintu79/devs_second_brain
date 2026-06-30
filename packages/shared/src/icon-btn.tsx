"use client";

export function IconBtn({
  icon: Icon, label, onClick, disabled, className, iconClass, children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconClass?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="group relative flex">
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={`flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all ${className || ""}`}
      >
        {children || <Icon className={`h-3.5 w-3.5 ${iconClass || ""}`} />}
      </button>
      <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-[11px] font-medium bg-popover text-popover-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 scale-95 group-hover:scale-100">
        {label}
      </span>
    </div>
  );
}
