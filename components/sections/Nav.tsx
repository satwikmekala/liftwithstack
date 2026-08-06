import { StackLogo } from "@/components/ui/StackLogo";

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-bg/[0.72] px-[clamp(16px,4vw,32px)] py-[14px] backdrop-blur-[18px]">
      <a
        href="#top"
        aria-label="Stack home"
        className="flex items-center gap-[11px] text-text"
      >
        <StackLogo />
      </a>

      <div className="hidden items-center gap-1 md:flex">
        <a
          href="#how-it-works"
          className="rounded-lg px-[14px] py-2 font-body text-[13.5px] font-semibold text-text-muted transition-colors hover:text-text"
        >
          How it works
        </a>
        <a
          href="#progress"
          className="rounded-lg px-[14px] py-2 font-body text-[13.5px] font-semibold text-text-muted transition-colors hover:text-text"
        >
          Progress
        </a>
      </div>

      <a
        href="#download"
        className="rounded-[10px] bg-accent px-[18px] py-[10px] font-body text-[13.5px] font-bold text-ink transition-colors hover:bg-accent-hover hover:text-ink"
      >
        Get launch updates
      </a>
    </nav>
  );
}

export default Nav;
