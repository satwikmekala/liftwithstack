import { APP_STORE_URL, INSTAGRAM_URL } from "@/lib/site";

/** A single access destination, shared by the hero and closing action. */
export function Download({ size = "large" }: { size?: "large" | "small" }) {
  return (
    <a className={`download download--${size}`} href={APP_STORE_URL ?? INSTAGRAM_URL}
      target="_blank" rel="noopener noreferrer">
      {APP_STORE_URL ? "Download on the App Store" : "Request beta access"}
    </a>
  );
}
