import { StackLogo } from "@/components/ui/StackLogo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-bg">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-7 px-[clamp(20px,5vw,40px)] py-10 sm:flex-row sm:items-end">
        <div>
        <a
          href="#top"
          aria-label="Stack home"
          className="inline-flex rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <StackLogo />
        </a>
          <p className="mt-3 font-body text-sm text-text-muted">
            Strength training for busy people.
          </p>
        </div>

        <span className="font-mono text-xs font-medium tracking-[0.08em] text-text-dim">
          © 2026 Stack. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
