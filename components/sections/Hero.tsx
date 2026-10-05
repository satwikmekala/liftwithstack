import { HeroStack } from "@/components/stack/HeroStack";
import { Download } from "@/components/ui/Download";
import { Icon, StackMark } from "@/components/ui/Icon";
import { INSTAGRAM_URL } from "@/lib/site";

export function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top" aria-label="Stack, back to top">
        <StackMark size={26} />
        <span>Stack</span>
      </a>
      <a className="download download--small download--soon nav__beta" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
        aria-label="DM Stack on Instagram for beta access">
        DM on <Icon name="instagram" size={16} stroke={1.8} /> for beta access
      </a>
    </header>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__copy">
        <h1 className="hero__title">
          <span className="line"><span>Every workout</span></span>
          <span className="line"><span>stacks up.</span></span>
        </h1>
        <p className="hero__body">Log your training.<br />See your progress take shape.</p>
        <div className="hero__actions">
          <Download label="Beta testing on iOS" apple />
          <a className="text-link" href="#how">See how it works<Icon name="arrowDown" size={16} /></a>
        </div>
      </div>
      <div className="hero__object">
        <HeroStack />
      </div>
    </section>
  );
}
