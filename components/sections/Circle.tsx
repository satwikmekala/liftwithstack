"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MomentsCluster } from "@/components/moments/MomentsCluster";
import { MiniStack } from "@/components/stack/MiniStack";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { Bolt, Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import {
  DEFAULT_SHARE, effectiveShare, FRIENDS, NUDGES, NUDGES_PER_DAY, SHARE_DEPENDS_ON, SHARE_ROWS, sharingSummary,
  thisWeekSlabs, withoutRecords, yourHistory, type ShareKey, type ShareSettings,
} from "@/lib/circle";
import { EXAMPLE_WEEK } from "@/lib/moments";
import { color } from "@/lib/tokens";

const TILE = { width: 220, height: 320, unit: 24 };

/**
 * Private Circle: the few people you train with, each shown as this week's Stack on one shared
 * floor (features/circle/CircleScreen.tsx). Your own tile is drawn as a friend sees it, from the
 * same switches as "What friends see"; nudges light a block warm for a moment.
 */
export function Circle() {
  const { completed, photos, locks } = useDemoJourney();
  const [share, setShare] = useState<ShareSettings>(DEFAULT_SHARE);
  const can = effectiveShare(share);
  const week = useMemo(() => thisWeekSlabs(completed), [completed]);
  const history = useMemo(() => yourHistory(), []);
  const yours = can.history ? [...history, ...week] : can.weekly ? week : [];
  const shown = can.performance ? yours : withoutRecords(yours);
  const sharedPhotos = [...photos, ...EXAMPLE_WEEK.flatMap((group) => group.prints)].filter((print) => !locks[print.id]);

  const [incoming, setIncoming] = useState<{ from: string; message: string } | null>(null);
  const [warm, setWarm] = useState<{ id: string; at: number } | null>(null);
  const [sent, setSent] = useState<Record<string, number>>({});
  const [nudging, setNudging] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const room = useRef<HTMLDivElement>(null);
  // Each nudge's light is a fresh drawing, so the same tower can light up again.
  const flashes = useRef(0);

  // Someone in your circle nudges you, once, soon after you arrive.
  useEffect(() => {
    const element = room.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => {
        setIncoming({ from: "Maya", message: NUDGES[0] });
        setWarm({ id: "you", at: ++flashes.current });
      }, 1400);
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggle = (key: ShareKey | "paused") => setShare((current) => ({ ...current, [key]: !current[key] }));
  const send = (id: string, message: string) => {
    const name = FRIENDS.find((friend) => friend.id === id)?.name ?? "";
    setSent((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
    setWarm({ id, at: ++flashes.current });
    setNudging(null);
    setToast(`“${message}” sent to ${name}`);
  };

  const yourLine = share.paused ? "Sharing paused" : !can.stack || yours.length === 0 ? "Keeps their Stack private"
    : can.workouts ? "Push · Today" : `${can.history ? "Full Stack" : `${week.length} workouts this week`}`;

  return (
    <section className="circle" id="circle" aria-labelledby="circle-title">
      <Reveal className="section-head">
        <p className="eyebrow">PRIVATE CIRCLE</p>
        <h2 id="circle-title" className="section-title">Better with your people.</h2>
        <p className="section-body">Bring in the few people you train with. Watch each other’s Stacks grow, and send a nudge when it counts. No followers, no feed, no leaderboard.</p>
      </Reveal>

      <div className="circle__layout">
        <div ref={room} className="circle__room" role="group" aria-label="An example circle">
          <div className="circle__bar" aria-hidden="true">
            <span className="circle__bar-button"><Icon name="chevronLeft" size={20} /></span>
            <span className="circle__bar-title">Your circle</span>
            <span className="circle__bar-button"><Icon name="userPlus" size={18} /></span>
          </div>
          <div className="circle__floor" aria-hidden="true" />
          <div className="circle__tiles">
            <div className="circle__tile circle__tile--you">
              <p className="circle__name">
                You{incoming && <span className="bolt-chip" aria-hidden="true"><Bolt width={10} height={12.5} color={color.ink} /></span>}
                <span className="circle__as mono">AS THEY SEE YOU</span>
              </p>
              <div className="circle__tower">
                <MiniStack key={`you-${warm?.id === "you" ? warm.at : 0}`} slabs={shown} width={TILE.width} height={TILE.height} unit={TILE.unit}
                  base="ledge" variant={share.paused || shown.length === 0 ? "private" : "stack"} quietHistory={can.history}
                  sweep={warm?.id === "you"} />
                {can.photos && sharedPhotos.length > 0 && <MomentsCluster photos={sharedPhotos} size={34} className="circle__photos" />}
              </div>
              <p className="circle__activity">{yourLine}</p>
              <span className="circle__nudge circle__nudge--spacer" aria-hidden="true"><Bolt width={11} height={14} color="currentColor" />Nudge</span>
              {incoming && (
                <div className="nudge-bubble" role="status">
                  <span className="nudge-bubble__from mono">{incoming.from.toUpperCase()} NUDGED YOU</span>
                  <span className="nudge-bubble__message">{incoming.message}</span>
                  <button type="button" className="nudge-bubble__close" onClick={() => setIncoming(null)} aria-label="Dismiss nudge"><Icon name="x" size={14} /></button>
                </div>
              )}
            </div>
            {FRIENDS.map((friend) => {
              const count = sent[friend.id] ?? 0;
              return (
                <div key={friend.id} className="circle__tile">
                  <p className="circle__name">{friend.name}</p>
                  <div className="circle__tower">
                    <MiniStack key={`${friend.id}-${warm?.id === friend.id ? warm.at : 0}`} slabs={friend.slabs} width={TILE.width} height={TILE.height}
                      unit={TILE.unit} base="ledge" sweep={warm?.id === friend.id} />
                  </div>
                  <p className="circle__activity">{friend.activity ?? " "}</p>
                  <button type="button" className="circle__nudge" onClick={() => setNudging(nudging === friend.id ? null : friend.id)}
                    aria-expanded={nudging === friend.id} aria-label={`Nudge ${friend.name}`}>
                    <Bolt width={11} height={14} color="currentColor" />Nudge
                  </button>
                  {nudging === friend.id && (
                    <div className="nudge-sheet" role="dialog" aria-label={`Nudge ${friend.name}`}>
                      {count >= NUDGES_PER_DAY ? <p className="nudge-sheet__calm">You’ve already nudged {friend.name} today. You can send another tomorrow.</p> : <>
                        <div className="nudge-sheet__options">
                          {NUDGES.map((message) => <button key={message} type="button" onClick={() => send(friend.id, message)}>{message}</button>)}
                        </div>
                        <p className="nudge-sheet__limit">{NUDGES_PER_DAY - count === 1 ? "Your last nudge to them today" : `Up to ${NUDGES_PER_DAY} a day`} · No replies, just a nudge</p>
                      </>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="circle__toast" role="status" aria-live="polite">{toast ?? ""}</p>
        </div>

        <div className="share-panel">
          <p className="share-panel__title">What friends see</p>
          <p className="share-panel__summary" aria-live="polite">{sharingSummary(share)}</p>
          <ul className="share-panel__rows">
            {SHARE_ROWS.map((row) => {
              const disabled = share.paused || (SHARE_DEPENDS_ON[row.key] ?? []).some((key) => !share[key]);
              return (
                <li key={row.key} className={disabled ? "is-disabled" : ""}>
                  <span className="share-panel__copy"><b>{row.title}</b><span>{row.detail}</span></span>
                  <button type="button" role="switch" aria-checked={share[row.key]} disabled={disabled} aria-label={row.title}
                    className={`ios-switch${share[row.key] ? " is-on" : ""}`} onClick={() => toggle(row.key)}><span /></button>
                </li>
              );
            })}
            <li className="share-panel__pause">
              <span className="share-panel__copy"><b>Pause sharing</b><span>Hide everything from your circle for now.</span></span>
              <button type="button" role="switch" aria-checked={share.paused} aria-label="Pause sharing"
                className={`ios-switch${share.paused ? " is-on" : ""}`} onClick={() => toggle("paused")}><span /></button>
            </li>
          </ul>
        </div>
      </div>

      <ul className="circle__facts">
        <Reveal as="li" delay={0}><Icon name="userPlus" size={20} stroke={1.8} /><b>Invite-only.</b> Nobody can search or browse. Add friends by handle, invite link or Stack code.</Reveal>
        <Reveal as="li" delay={70}><Icon name="eye" size={20} stroke={1.8} /><b>Yours to decide.</b> At first, friends see only this week’s blocks. Turn on more when you want to.</Reveal>
        <Reveal as="li" delay={140}><Bolt width={16} height={20} color="currentColor" /><b>Just good news.</b> Nobody’s tile says they missed a day. Nudges are a few kind words, never a reply thread.</Reveal>
      </ul>
    </section>
  );
}
