import { Download } from "@/components/ui/Download";
import { StackMark } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { INSTAGRAM_URL } from "@/lib/site";

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <Reveal className="closing__inner">
        <StackMark size={72} className="closing__mark" />
        <h2 id="closing-title" className="closing__title">Ready to build your own?</h2>
        <Download />
        <p className="closing__access">iPhone beta · Send a DM on Instagram to join.</p>
        <p className="closing__facts">Made for iPhone · No Stack account needed</p>
      </Reveal>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__brand"><StackMark size={18} />Stack</span>
      <span className="footer__meta">
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Built in public</a>
        <span aria-hidden="true">·</span>
        <span>© 2026 Stack</span>
      </span>
    </footer>
  );
}
