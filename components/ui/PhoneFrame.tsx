import type { PropsWithChildren } from "react";

export interface PhoneFrameProps extends PropsWithChildren {
  readonly className?: string;
  readonly screenClassName?: string;
  readonly showHardware?: boolean;
}

function joinClasses(
  ...classes: readonly (string | false | null | undefined)[]
): string {
  return classes
    .filter((className): className is string => Boolean(className))
    .join(" ");
}

export function PhoneFrame({
  children,
  className,
  screenClassName,
  showHardware = false,
}: PhoneFrameProps) {
  return (
    <div className="relative">
      {showHardware && (
        <>
          <span
            aria-hidden="true"
            className="absolute -left-[3px] top-[108px] h-[30px] w-[3px] rounded-l-full bg-phone-ring"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[3px] top-[151px] h-[54px] w-[3px] rounded-l-full bg-phone-ring"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[3px] top-[132px] h-[72px] w-[3px] rounded-r-full bg-phone-ring"
          />
        </>
      )}
      <div
        className={joinClasses(
          "relative w-[min(320px,86vw)] rounded-[44px] bg-phone-bezel p-[9px]",
          "shadow-phone",
          className,
        )}
      >
      <div
        className={joinClasses(
          "relative w-full overflow-hidden rounded-[36px] bg-bg",
          screenClassName,
        )}
      >
        {children}
      </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
