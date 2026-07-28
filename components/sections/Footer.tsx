import { StackLogo } from "@/components/ui/StackLogo";

const footerLinkClassName =
  "rounded-lg px-3 py-2 font-body text-[13.5px] font-semibold text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Footer() {
  return (
    // TEMPORARY PLACEHOLDER: replace when final Stack footer content is supplied.
    <footer className="border-t border-white/[0.08] bg-surface">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-6 px-[clamp(20px,5vw,32px)] py-12 sm:flex-row">
        <a
          href="#top"
          aria-label="Stack home"
          className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <StackLogo />
        </a>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-1"
        >
          <a href="#how" className={footerLinkClassName}>
            How it works
          </a>
          <a href="#principles" className={footerLinkClassName}>
            Training principles
          </a>
          <a href="#download" className={footerLinkClassName}>
            Download Stack
          </a>
        </nav>

        <span className="font-mono text-xs font-medium tracking-[0.08em] text-text-dim">
          © Stack
        </span>
      </div>
    </footer>
  );
}

export default Footer;
