"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { MomentPhoto } from "@/components/moments/MomentPhoto";
import { MiniStack } from "@/components/stack/MiniStack";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { Bolt, Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FRIENDS, NUDGES, NUDGES_PER_DAY, thisWeekSlabs } from "@/lib/circle";
import { color } from "@/lib/tokens";

const TILE = { width: 200, height: 300, unit: 22 };

/**
 * Private Circle: everyone you train with on one floor, each as this week's Stack
 * (features/circle/CircleScreen.tsx), and one friend's Stack opened up as you'd see it
 * (FriendStack.tsx): their week or whole Stack, recent training and the photos they share.
 */
export function Circle() {
  const { completed } = useDemoJourney();
  const week = useMemo(() => thisWeekSlabs(completed), [completed]);
  const [selected, setSelected] = useState("maya");
  const [whole, setWhole] = useState(false);
  const [warm, setWarm] = useState<{ id: string; at: number } | null>(null);
  const [incoming, setIncoming] = useState(false);
  const [sent, setSent] = useState<Record<string, number>>({});
  const [nudging, setNudging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const room = useRef<HTMLDivElement>(null);
  // Each nudge's light is a fresh drawing, so the same tower can light up again.
  const flashes = useRef(0);
  const friend = FRIENDS.find((item) => item.id === selected) ?? FRIENDS[0];
  const count = sent[friend.id] ?? 0;

  // Someone in your circle nudges you, once, soon after you arrive.
  useEffect(() => {
    const element = room.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => {
        setIncoming(true);
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

  const open = (id: string) => { setSelected(id); setWhole(false); setNudging(false); };
  const send = (message: string) => {
    setSent((current) => ({ ...current, [friend.id]: (current[friend.id] ?? 0) + 1 }));
    setWarm({ id: friend.id, at: ++flashes.current });
    setNudging(false);
    setToast(`Sent to ${friend.name}: ${message}`);
  };

  return (
    <section className="circle" id="circle" aria-labelledby="circle-title">
      <Reveal className="section-head">
        <p className="eyebrow">PRIVATE CIRCLE</p>
        <h2 id="circle-title" className="section-title">Stack up together.</h2>
        <p className="section-body">See how your friends are stacking up, and give them a nudge when they need one.</p>
      </Reveal>

      <div className="circle__layout">
        <div ref={room} className="circle__room" role="group" aria-label="Your circle, an example">
          <div className="circle__bar" aria-hidden="true">
            <span className="circle__bar-button"><Icon name="chevronLeft" size={20} /></span>
            <span className="circle__bar-title">Your circle</span>
            <span className="circle__bar-button"><Icon name="userPlus" size={18} /></span>
          </div>
          <div className="circle__floor" aria-hidden="true" />
          <div className="circle__tiles">
            <div className="circle__tile circle__tile--you">
              <p className="circle__name">You{incoming && <span className="bolt-chip" aria-hidden="true"><Bolt width={10} height={12.5} color={color.ink} /></span>}</p>
              <div className="circle__tower">
                <MiniStack key={`you-${warm?.id === "you" ? warm.at : 0}`} slabs={week} width={TILE.width} height={TILE.height} unit={TILE.unit}
                  base="ledge" sweep={warm?.id === "you"} />
              </div>
              <p className="circle__activity">{week.length} this week</p>
              {incoming && (
                <div className="nudge-bubble" role="status">
                  <span className="nudge-bubble__from mono">MAYA NUDGED YOU</span>
                  <span className="nudge-bubble__message">{NUDGES[0]}</span>
                  <button type="button" className="nudge-bubble__close" onClick={() => setIncoming(false)} aria-label="Dismiss nudge"><Icon name="x" size={14} /></button>
                </div>
              )}
            </div>
            {FRIENDS.map((item) => (
              <button key={item.id} type="button" className={`circle__tile${item.id === selected ? " is-selected" : ""}`}
                onClick={() => open(item.id)} aria-pressed={item.id === selected} aria-label={`Open ${item.name}’s Stack`}>
                <span className="circle__name">{item.name}</span>
                <span className="circle__tower">
                  <MiniStack key={`${item.id}-${warm?.id === item.id ? warm.at : 0}`} slabs={item.slabs} width={TILE.width} height={TILE.height}
                    unit={TILE.unit} base="ledge" sweep={warm?.id === item.id} />
                </span>
                <span className="circle__activity">{item.activity ?? " "}</span>
              </button>
            ))}
          </div>
          <p className="circle__toast" role="status" aria-live="polite">{toast ?? ""}</p>
        </div>

        <div key={friend.id} className="friend" aria-label={`${friend.name}’s Stack`} role="region">
          <div className="friend__bar">
            <span className="friend__who"><b>{friend.name}</b><span>@{friend.handle}</span></span>
            <div className="friend__segment" role="radiogroup" aria-label="Show">
              <button type="button" role="radio" aria-checked={!whole} className={!whole ? "is-on" : ""} onClick={() => setWhole(false)}>This week</button>
              <button type="button" role="radio" aria-checked={whole} className={whole ? "is-on" : ""} onClick={() => setWhole(true)}>Full Stack</button>
            </div>
          </div>
          <div className="friend__stage">
            <MiniStack key={`${friend.id}-${whole}`} slabs={whole ? [...friend.history, ...friend.slabs] : friend.slabs} width={220} height={260}
              unit={whole ? 7 : 20} glow quietHistory={whole} className="friend__stack" />
            <p className="friend__context">{whole ? `${friend.history.length} weeks stacked` : `${friend.slabs.length} workouts this week`}</p>
          </div>
          <p className="friend__label mono">RECENT TRAINING</p>
          <ul className="friend__workouts">
            {friend.workouts.map((workout) => (
              <li key={workout.label + workout.day} style={{ "--c": workout.color } as CSSProperties}>
                <p className="friend__workout"><i /><b>{workout.label}</b><span>{workout.day}</span></p>
                {workout.lifts.map((lift) => (
                  <p key={lift.name} className="friend__lift"><span>{lift.name}</span><span>{lift.record && <em>PR</em>}{lift.sets}</span></p>
                ))}
              </li>
            ))}
          </ul>
          {friend.photos.length > 0 && <>
            <p className="friend__label mono">PHOTOS THIS WEEK</p>
            <div className="friend__photos">{friend.photos.map((exercise) => <MomentPhoto key={exercise} exercise={exercise} line={null} label={false} />)}</div>
          </>}
          <p className="friend__soon"><span className="mono">COMING SOON</span>Their routines and gym playlist.</p>
          <div className="friend__nudge">
            <button type="button" className="friend__nudge-button" onClick={() => setNudging((value) => !value)} aria-expanded={nudging}>
              <Bolt width={12} height={15} color="currentColor" />Nudge {friend.name}
            </button>
            {nudging && (
              <div className="nudge-sheet" role="dialog" aria-label={`Nudge ${friend.name}`}>
                {count >= NUDGES_PER_DAY ? <p className="nudge-sheet__calm">You’ve already nudged {friend.name} today. You can send another tomorrow.</p> : <>
                  <div className="nudge-sheet__options">
                    {NUDGES.map((message) => <button key={message} type="button" onClick={() => send(message)}>{message}</button>)}
                  </div>
                  <p className="nudge-sheet__limit">{NUDGES_PER_DAY - count === 1 ? "Your last nudge to them today" : `Up to ${NUDGES_PER_DAY} a day`} · No replies, just a nudge</p>
                </>}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="circle__note">Invite only, by link, code or handle. You choose what friends see, and you can change it any time.</p>
    </section>
  );
}
