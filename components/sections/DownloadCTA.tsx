import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const storeBadgeClassName =
  "inline-flex cursor-not-allowed items-center gap-3 rounded-[15px] px-6 py-3.5";

export function DownloadCTA() {
  return (
    <section
      id="download"
      className="mx-auto max-w-[820px] scroll-mt-[70px] px-[clamp(20px,5vw,32px)] py-[clamp(80px,12vw,150px)] text-center"
    >
      <RevealOnScroll>
        <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(38px,7vw,84px)] font-extrabold leading-[0.98] tracking-[-0.03em] text-text">
          The only decision is showing up.
        </h2>
        <p className="mx-auto mb-10 mt-6 max-w-[36ch] font-body text-[clamp(17px,2.2vw,22px)] leading-normal text-text-muted">
          Stack will help with what comes next.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            disabled
            aria-label="Download on the App Store — coming soon"
            title="Coming soon"
            className={`${storeBadgeClassName} bg-text text-bg`}
          >
            <svg
              aria-hidden="true"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16.5 1.5c.1 1-.3 2-.9 2.8-.7.8-1.7 1.4-2.7 1.3-.1-1 .4-2 .9-2.7.7-.8 1.8-1.3 2.7-1.4zM19.6 8.3c-1.5.9-2.4 2.5-2.4 4.3 0 2 1.2 3.8 3 4.6-.4 1.2-1 2.3-1.8 3.3-1 1.3-2 2.5-3.5 2.5s-1.9-.8-3.5-.8-2.1.8-3.5.9c-1.4.1-2.5-1.4-3.5-2.6C1.8 20 .8 16.4 2.5 13.5c.9-1.5 2.5-2.4 4.2-2.5 1.4 0 2.7.9 3.5.9.8 0 2.4-1.1 4-.9.7 0 2.6.3 3.8 2.1l-.4.1z" />
            </svg>
            <span className="text-left leading-none">
              <span className="block font-body text-[10px] font-medium tracking-[0.02em]">
                Download on the
              </span>
              <span className="mt-0.5 block font-body text-lg font-bold">
                App Store
              </span>
            </span>
          </button>

          <button
            type="button"
            disabled
            aria-label="Get it on Google Play — coming soon"
            title="Coming soon"
            className={`${storeBadgeClassName} border border-white/[0.18] bg-transparent text-text`}
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 2.2v19.6c0 .5.5.8.9.5L15.6 12 3.9 1.7c-.4-.3-.9 0-.9.5z"
                fill="currentColor"
                className="text-accent"
              />
              <path
                d="M17.5 9.8 14.4 8 4.6 1.4l11 8.4z"
                fill="currentColor"
                className="text-text opacity-70"
              />
              <path
                d="M17.5 14.2 20.9 12c.6-.4.6-1.6 0-2l-3.4-2.2-2.9 2.2 2.9 2.2z"
                fill="currentColor"
                className="text-text"
              />
              <path
                d="M4.6 22.6 14.4 16l3.1-1.8-2.9-2.2z"
                fill="currentColor"
                className="text-text opacity-70"
              />
            </svg>
            <span className="text-left leading-none">
              <span className="block font-body text-[10px] font-medium tracking-[0.02em]">
                Get it on
              </span>
              <span className="mt-0.5 block font-body text-lg font-bold">
                Google Play
              </span>
            </span>
          </button>
        </div>

        <div className="mt-[22px] font-mono text-xs font-medium tracking-[0.1em] text-text-dim">
          Free to start · No account needed to try
        </div>
      </RevealOnScroll>
    </section>
  );
}

export default DownloadCTA;
