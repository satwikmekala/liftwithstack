"use client";

import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/lib/tokens";
import { StatusBar } from "./Phone";
import { SlideToStart } from "./SlideToStart";

/** Train, with Stack’s plan active (app/(tabs)/index.tsx). */
export function TrainScreen({ onStart, resetKey }: { onStart: (origin: { x: number; y: number }) => void; resetKey: number }) {
  return (
    <div className="screen train">
      <div className="train__bg" aria-hidden="true" />
      <StatusBar />
      <div className="train__content">
        <p className="train__date">Thursday, 8 Oct</p>
        <p className="train__greeting">Morning, Wik</p>
        <div className="hero-card card-surface" style={{ "--c": color.accent } as CSSProperties}>
          <div className="hero-card__topline">
            <span className="status-pill" style={{ "--c": color.accent } as CSSProperties}>TODAY</span>
            <span className="hero-card__change"><Icon name="arrowLeftRight" size={16} color={color.ash} />Change workout</span>
          </div>
          <div className="hero-card__identity">
            <p className="hero-card__title">Push (Chest, Shoulders, Triceps)</p>
            <p className="hero-card__meta">Push · 6 exercises</p>
          </div>
          <SlideToStart key={resetKey} color={color.accent} onStart={onStart} />
        </div>
        <div className="train__secondary">
          <div className="train__empty">
            <Icon name="plus" size={22} color={color.accent} />
            <span className="train__copy"><span className="train__row-title">Start empty workout</span><span className="train__row-detail">Build as you go</span></span>
            <Icon name="chevronRight" size={18} color={color.accent} />
          </div>
          <div className="train__routine">
            <Icon name="calendarDays" size={22} color={color.ash} />
            <span className="train__copy"><span className="train__row-title">Your routines</span><span className="train__row-detail">Stack’s plan</span></span>
            <Icon name="chevronRight" size={20} stroke={2.2} color={color.ash} />
          </div>
        </div>
      </div>
      <TabBar />
    </div>
  );
}

function TabBar() {
  return (
    <div className="tab-bar" aria-hidden="true">
      <span className="tab-bar__item is-selected">
        <svg width="28" height="28" viewBox="0 0 28 28"><g fill="currentColor"><rect x="2.5" y="10.5" width="3" height="7" rx="1.2" /><rect x="5.8" y="7.5" width="4" height="13" rx="1.6" /><rect x="9.6" y="12.6" width="8.8" height="2.8" rx="1" /><rect x="18.2" y="7.5" width="4" height="13" rx="1.6" /><rect x="22.5" y="10.5" width="3" height="7" rx="1.2" /></g></svg>
        <span>Train</span>
      </span>
      <span className="tab-bar__item">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="10.5" width="3.5" height="12" rx="0.55" /><rect x="9" y="3.5" width="3.5" height="19" rx="0.55" /><rect x="15" y="7.5" width="3.5" height="15" rx="0.55" /><rect x="21" y="13.5" width="3.5" height="9" rx="0.55" /><path d="M2.5 25.5h23" /></svg>
        <span>Progress</span>
      </span>
      <span className="tab-bar__item">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M14 4.2 24.2 9.4 14 14.6 3.8 9.4Z" /><path d="M3.8 13.8 14 19l10.2-5.2" /><path d="M3.8 18.2 14 23.4l10.2-5.2" /></svg>
        <span>My Stack</span>
      </span>
    </div>
  );
}
