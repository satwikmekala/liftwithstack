import { Download } from "@/components/ui/Download";
import { Icon, StackMark } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { INSTAGRAM_URL } from "@/lib/site";

const CONNECT = [
  { title: "Follow on Instagram", detail: "@liftwithstack", icon: true },
  { title: "Free updates", detail: "See what’s new first", icon: false },
  { title: "Beta request", detail: "Send a DM to join", icon: false },
];

export function Closing() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <Reveal className="closing__inner">
        <StackMark size={56} className="closing__mark" />
        <h2 id="closing-title" className="closing__title">Don’t slack. Just stack.</h2>
        <Download label="Beta testing now" pulse />
        <ul className="connect">
          {CONNECT.map((item) => (
            <li key={item.title}>
              <a className="connect__item" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <span className="connect__title">
                  {item.icon && <Icon name="instagram" size={17} stroke={1.8} />}
                  {item.title}
                  <Icon name="arrowUpRight" size={14} stroke={2} className="connect__arrow" />
                </span>
                <span className="connect__detail">{item.detail}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="closing__facts">Made for iPhone · No account · Your workouts stay on your phone</p>
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
