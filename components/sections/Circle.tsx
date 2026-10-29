"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CirclePhoneScreen, FriendPhoneScreen } from "@/components/phone/CircleScreens";
import { Phone } from "@/components/phone/Phone";
import { useDemoJourney } from "@/components/stack/DemoJourney";
import { Bolt, Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { FRIENDS, thisWeekSlabs } from "@/lib/circle";

/**
 * Private Circle, on the app's own screens: your circle, and any friend's Stack opened over it.
 * The visitor's own block from the story is the newest block on their tower.
 */
export function Circle() {
  const { completed } = useDemoJourney();
  const you = useMemo(() => thisWeekSlabs(completed), [completed]);
  const [visiting, setVisitingState] = useState<string | null>(null);
  // The friend last opened stays drawn while their page slides away.
  const [friendId, setFriendId] = useState("maya");
  const setVisiting = (id: string | null) => { if (id) setFriendId(id); setVisitingState(id); };
  const [warm, setWarm] = useState<{ id: string; at: number } | null>(null);
  const [nudgedBy, setNudgedBy] = useState<string | null>(null);
  const [sent, setSent] = useState<Record<string, number>>({});
  const flashes = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const friend = FRIENDS.find((item) => item.id === friendId) ?? FRIENDS[1];

  // Soon after you arrive, Maya's nudge lands: her bubble, and light running up your Stack.
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      timer = setTimeout(() => { setNudgedBy("maya"); setWarm({ id: "you", at: ++flashes.current }); }, 1200);
    }, { threshold: 0.6 });
    observer.observe(element);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  const nudge = () => {
    setSent((current) => ({ ...current, [friend.id]: (current[friend.id] ?? 0) + 1 }));
    setWarm({ id: friend.id, at: ++flashes.current });
  };

  return (
    <section className="circle" id="circle" aria-labelledby="circle-title">
      <Reveal className="circle__copy">
        <p className="eyebrow">PRIVATE CIRCLE</p>
        <h2 id="circle-title" className="section-title">Stack up together.</h2>
        <p className="section-body">Bring in the few people you train with. See how their Stacks are growing, and nudge them when they need it.</p>
        <ul className="circle__points">
          <li><Icon name="eye" size={18} stroke={1.8} /><span><b>See their week.</b> Open anyone’s Stack for their blocks, recent training and the photos they share.</span></li>
          <li><Bolt width={14} height={18} color="currentColor" /><span><b>Send a nudge.</b> A few kind words. No replies, no streaks, no leaderboard.</span></li>
          <li><Icon name="lock" size={17} stroke={1.8} /><span><b>Yours to decide.</b> Invite only. You choose what friends see, and can change it any time.</span></li>
        </ul>
        <p className="circle__soon"><span className="mono">COMING SOON</span>Your friends’ routines and gym playlists.</p>
        <div className="circle__picks" role="group" aria-label="Open a friend’s Stack">
          {FRIENDS.map((item) => (
            <button key={item.id} type="button" className={visiting === item.id ? "is-on" : ""} onClick={() => setVisiting(item.id)} aria-pressed={visiting === item.id}>{item.name}</button>
          ))}
          {visiting && <button type="button" className="circle__back" onClick={() => setVisiting(null)}>Back to your circle</button>}
        </div>
      </Reveal>
      <div ref={stage} className="circle__stage">
        <Phone className="circle__phone" label="Your circle in Stack, an example">
          <div className={`cs-base${visiting ? " is-covered" : ""}`} inert={visiting !== null}>
            <CirclePhoneScreen you={you} onOpen={setVisiting} warm={warm} nudgedBy={nudgedBy} />
          </div>
          <FriendPhoneScreen key={friend.id} friend={friend} open={visiting !== null} onBack={() => setVisiting(null)} onNudge={nudge} sent={sent[friend.id] ?? 0} />
        </Phone>
        <p className="circle__hint"><span className="story__hint-dot" />{visiting ? "Try Full Stack, or send a nudge" : "Tap a friend’s Stack"}</p>
      </div>
    </section>
  );
}
