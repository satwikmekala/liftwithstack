import { APP_STORE_URL } from "@/lib/site";

/**
 * The one download control. Until the App Store listing exists it says Stack is in beta.
 * When the listing is live, Apple’s guidelines ask for the official badge artwork here.
 */
export function Download({ size = "large", label, pulse = false, apple = false }: {
  size?: "large" | "small"; label?: string; pulse?: boolean; apple?: boolean;
}) {
  if (APP_STORE_URL) {
    return (
      <a className={`download download--${size}`} href={APP_STORE_URL}>
        Download on the App Store
      </a>
    );
  }
  return (
    <span className={`download download--${size} download--soon`}>
      {apple ? <AppleGlyph /> : <span className={`download__dot${pulse ? " download__dot--pulse" : ""}`} aria-hidden="true" />}
      {label ? <span>{label}</span> : <span>Now in beta<span className="download__more"> on iPhone</span></span>}
    </span>
  );
}

function AppleGlyph() {
  return (
    <svg className="download__apple" width="15" height="18" viewBox="0 0 15 18" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M12.4 9.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8C3 4.4 1.6 5.3.8 6.7c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 3 2.4 1.2-.1 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.9ZM10.1 2.8c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.2Z" />
    </svg>
  );
}
