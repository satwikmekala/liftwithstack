import { StackMark } from "@/components/ui/Icon";
import { INSTAGRAM_URL } from "@/lib/site";

export function ScienceNav() {
  return (
    <header className="nav sci-nav">
      {/* A plain anchor: next/link pulls a second React into the vinext dev bundle. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className="nav__brand" href="/" aria-label="Stack, home">
        <StackMark size={26} />
        <span>Stack</span>
      </a>
      <span className="sci-nav__title mono">WHY THE SAME WEIGHT GETS EASIER</span>
      <a className="download download--small download--soon" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Get the beta</a>
    </header>
  );
}
