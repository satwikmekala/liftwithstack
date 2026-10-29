"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { MomentsCluster } from "@/components/moments/MomentsCluster";
import { MiniStack, stackAspect, TRUE_UNIT } from "@/components/stack/MiniStack";
import { Bolt, Icon } from "@/components/ui/Icon";
import { FRIENDS, NUDGES, NUDGES_PER_DAY, type Friend } from "@/lib/circle";
import { GOLD, type BuildSlab } from "@/lib/stack/model";
import { color } from "@/lib/tokens";
import { StatusBar } from "./Phone";

// The Circle's own drawing scale (features/circle/FriendStack.tsx, CircleScreen.tsx).
const UNIT = TRUE_UNIT;
const INSET = 0.12;
const MIN_ASPECT = 0.42;
const MAX_ASPECT = 1.05;
const CELL = 169;

const height = (slabs: readonly BuildSlab[], width: number, max = MAX_ASPECT) =>
  Math.round(width * Math.min(max, stackAspect(slabs, UNIT, MIN_ASPECT, INSET, "shadow")));

function Bar({ left, right, title }: { left: React.ReactNode; right: React.ReactNode; title?: React.ReactNode }) {
  return (
    <div className="cs-bar">
      {left}
      {title && <div className="cs-bar__title">{title}</div>}
      <div className="cs-bar__actions">{right}</div>
    </div>
  );
}

/**
 * Your circle (features/circle/CircleScreen.tsx): you at the top with your week and what friends
 * see, then everyone sharing a block this week in rows of two, each tower on its own floor.
 */
export function CirclePhoneScreen({ you, onOpen, warm, nudgedBy }: {
  you: BuildSlab[]; onOpen: (id: string) => void; warm: { id: string; at: number } | null; nudgedBy: string | null;
}) {
  const rows = [FRIENDS.slice(0, 2), FRIENDS.slice(2, 4)];
  const [bubble, setBubble] = useState(false);
  // A nudge pops out of its sender's name, stays a few seconds, then folds into the bolt.
  useEffect(() => {
    if (!nudgedBy) return;
    const show = setTimeout(() => setBubble(true), 0);
    const hide = setTimeout(() => setBubble(false), 4200);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [nudgedBy]);
  return (
    <div className="screen cs">
      <div className="cs-room" aria-hidden="true" />
      <StatusBar />
      <div className="cs-content">
        <div className="cs-you" aria-label="You, Wik. Friends see this week’s Stack.">
          <div className="cs-you__text">
            <p className="cs-you__name">Wik</p>
            <p className="cs-you__handle">@wik</p>
            <p className="cs-you__summary">Friends see this week’s Stack.</p>
          </div>
          <MiniStack key={`you-${warm?.id === "you" ? warm.at : 0}`} slabs={you} width={153} height={height(you, 153)} unit={UNIT} inset={INSET}
            base="shadow" sweep={warm?.id === "you"} />
        </div>
        <div className="cs-gallery">
          {rows.map((row) => {
            const viewport = Math.max(...row.map((friend) => height(friend.slabs, CELL)));
            return (
              <div key={row[0].id} className="cs-row">
                {row.map((friend) => (
                  <button key={friend.id} type="button" className="cs-figure" onClick={() => onOpen(friend.id)} aria-label={`${friend.name}, ${friend.slabs.length} workouts this week. Opens ${friend.name}’s Stack.`}>
                    <span className="cs-figure__name">
                      {friend.name}
                      {nudgedBy === friend.id && <span className="cs-bolt"><Bolt width={12} height={15} color={color.accent} />
                        {bubble && <span className="cs-bubble">{NUDGES[0]}</span>}
                      </span>}
                    </span>
                    <span className="cs-figure__viewport" style={{ height: viewport }}>
                      <MiniStack key={`${friend.id}-${warm?.id === friend.id ? warm.at : 0}`} slabs={friend.slabs} width={CELL}
                        height={height(friend.slabs, CELL)} unit={UNIT} inset={INSET} base="shadow" sweep={warm?.id === friend.id} />
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <div className="cs-fade" aria-hidden="true" />
      <Bar left={<span className="cs-button" aria-hidden="true"><Icon name="chevronLeft" size={23} color={color.bone} /></span>}
        title={<><span className="cs-bar__name">Your circle</span><span className="cs-bar__week">5–11 Oct</span></>}
        right={<span className="cs-button" aria-hidden="true"><Icon name="userPlus" size={19} color={color.bone} /></span>} />
    </div>
  );
}

/** One workout as a small block in its colour; a PR is the thin gold seam (FriendParts.tsx WorkoutMark). */
function WorkoutMark({ fill, record }: { fill: string; record: boolean }) {
  return (
    <svg width={22} height={17.6} viewBox="0 0 30 24" aria-hidden="true">
      <polygon points="1,8.4 13.7,14 16.3,14 29,8.4 29,14.4 16.3,20 13.7,20 1,14.4" fill={fill} />
      <polygon points="16.3,14 29,8.4 29,14.4 16.3,20" fill="rgba(0,0,0,0.26)" />
      <polygon points="1,8.4 15,2.2 29,8.4 16.3,14 13.7,14" fill={fill} />
      <polygon points="1,8.4 15,2.2 29,8.4 16.3,14 13.7,14" fill="rgba(255,255,255,0.1)" />
      {record && <polyline points="1,8.4 13.7,14 16.3,14 29,8.4" fill="none" stroke={GOLD} strokeWidth={1.3} />}
    </svg>
  );
}

/**
 * A friend's Stack, drawn over the Circle (features/circle/FriendStack.tsx): their name, this
 * week's Stack with the photos they shared tucked beside it, This week or Full Stack, and their
 * recent training. Nudge sits in the corner, apart from the controls for viewing.
 */
export function FriendPhoneScreen({ friend, open, onBack, onNudge, sent }: {
  friend: Friend; open: boolean; onBack: () => void; onNudge: (message: string) => void; sent: number;
}) {
  const [whole, setWhole] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(timer);
  }, [toast]);
  const slabs = whole ? [...friend.history.slice(-8), ...friend.slabs] : friend.slabs;
  const limited = sent >= NUDGES_PER_DAY;
  const send = (message: string) => {
    onNudge(message);
    setSheet(false);
    setToast(`Sent to ${friend.name}`);
  };
  return (
    <div className={`cs-friend${open ? " is-open" : ""}`} inert={!open} role="dialog" aria-label={`${friend.name}’s Stack`}>
      <div className="screen cs" style={{ background: "transparent" }}>
        <div className="cs-room" aria-hidden="true" />
        <StatusBar />
        <div className="cs-friend__content">
          <p className="cs-friend__name">{friend.name}</p>
          <p className="cs-friend__handle">@{friend.handle}</p>
          <div className="cs-friend__stage">
            <MiniStack key={`${friend.id}-${whole}`} slabs={slabs} width={300} height={whole ? 300 : height(friend.slabs, 300, 0.9)}
              unit={whole ? 5.5 : UNIT} inset={INSET} base="shadow" glow={whole} quietHistory={whole} className="cs-friend__stack" />
            {!whole && friend.photos.length > 0 && <span className="cs-friend__photos"><MomentsCluster photos={friend.photos.map((exercise) => ({ id: exercise, exercise }))} /></span>}
            <p className="cs-friend__context">{whole ? `${friend.history.length} weeks built` : `${friend.slabs.length} workouts this week`}</p>
          </div>
          <div className="cs-segment" role="tablist">
            <button type="button" role="tab" aria-selected={!whole} className={!whole ? "is-on" : ""} onClick={() => setWhole(false)}>This week</button>
            <button type="button" role="tab" aria-selected={whole} className={whole ? "is-on" : ""} onClick={() => setWhole(true)}>Full Stack</button>
          </div>
          <div className="cs-section">
            <p className="cs-section__title">Recent training</p>
            {friend.workouts.map((workout) => {
              const records = workout.lifts.filter((lift) => lift.record).length;
              return (
                <div key={workout.label + workout.day} className="cs-workout" style={{ "--c": workout.color } as CSSProperties}>
                  <WorkoutMark fill={workout.color} record={records > 0} />
                  <span className="cs-workout__text">
                    <b>{workout.label}</b>
                    <span>{[workout.day, records ? `${records} PR` : null].filter(Boolean).join(" · ")}</span>
                  </span>
                  <Icon name="chevronRight" size={17} color={color.ashDim} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="cs-fade" aria-hidden="true" />
        <Bar left={<button type="button" className="cs-button" onClick={onBack} aria-label="Back to your circle"><Icon name="chevronLeft" size={23} color={color.bone} /></button>}
          right={<>
            <span className="cs-button" aria-hidden="true"><Icon name="ellipsis" size={20} color={color.bone} /></span>
            <button type="button" className={`cs-nudge${limited ? " is-limited" : ""}`} onClick={() => setSheet(true)}>
              {limited && <Icon name="check" size={15} stroke={2.6} color={color.accent} />}{limited ? "Nudged" : "Nudge"}
            </button>
          </>} />
        {toast && <p className="cs-toast" role="status"><Icon name="check" size={15} stroke={2.8} color={color.accent} />{toast}</p>}
        <div className={`cs-sheet${sheet ? " is-open" : ""}`} inert={!sheet}>
          <button type="button" className="cs-sheet__scrim" onClick={() => setSheet(false)} aria-label="Close" tabIndex={-1} />
          <div className="cs-sheet__panel" role="dialog" aria-label={`Nudge ${friend.name}`}>
            <p className="cs-sheet__title">{limited ? `You’ve already nudged ${friend.name} today` : `Nudge ${friend.name}`}</p>
            {limited ? <p className="cs-sheet__note">You can send another tomorrow.</p> : <>
              <div className="cs-sheet__options">
                {NUDGES.map((message) => <button key={message} type="button" onClick={() => send(message)}>{message}</button>)}
              </div>
              <p className="cs-sheet__note">{NUDGES_PER_DAY - sent === 1 ? "Your last nudge to them today" : `Up to ${NUDGES_PER_DAY} a day`} · No replies, just a nudge</p>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
