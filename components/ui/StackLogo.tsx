export interface StackLogoProps {
  readonly className?: string;
}

export function StackLogo({ className = "" }: StackLogoProps) {
  return (
    <span className={`flex items-center gap-[11px] ${className}`.trim()}>
      <span
        aria-hidden="true"
        className="relative block size-[22px] flex-none"
      >
        <span className="absolute bottom-0 left-1 size-[14px] rounded-[4px] bg-accent opacity-35" />
        <span className="absolute bottom-[3px] left-0.5 size-[14px] rounded-[4px] bg-accent opacity-70" />
        <span className="absolute bottom-1.5 left-0 size-[14px] rounded-[4px] bg-accent" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-[-0.01em] text-text">
        stack
      </span>
    </span>
  );
}

export default StackLogo;
