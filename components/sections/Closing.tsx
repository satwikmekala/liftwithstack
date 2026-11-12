import { MiniStack, TRUE_UNIT } from "@/components/stack/MiniStack";
import { Download } from "@/components/ui/Download";
import { StackMark } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FRIENDS, thisWeekSlabs, yourHistory } from "@/lib/circle";
import { INSTAGRAM_URL } from "@/lib/site";

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <Reveal className="closing__inner">
        <div className="closing__stacks" aria-hidden="true">
          <MiniStack slabs={FRIENDS[0].slabs} width={104} height={150} unit={TRUE_UNIT} base="ledge" />
          <MiniStack slabs={[...yourHistory(), ...thisWeekSlabs(null)]} width={150} height={216} unit={TRUE_UNIT} glow quietHistory className="is-you" />
          <MiniStack slabs={FRIENDS[1].slabs} width={104} height={150} unit={TRUE_UNIT} base="ledge" />
        </div>
        <h2 id="closing-title" className="closing__title">Ready to build your own?</h2>
        <Download />
        <p className="closing__access">iPhone beta · Send a DM on Instagram to join.</p>
        <p className="closing__facts">Made for iPhone · Works offline · No account needed to start</p>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__brand"><StackMark size={18} />Stack</span>
      <span className="footer__meta">
        {/* A plain anchor: next/link pulls a second React into the vinext dev bundle. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/about">What is Stack?</a>
        <span aria-hidden="true">·</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Built in public</a>
        <span aria-hidden="true">·</span>
        <span>© 2026 Stack</span>
      </span>
    </footer>
  );
}
