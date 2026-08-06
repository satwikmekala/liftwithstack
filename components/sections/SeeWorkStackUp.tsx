"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

const lifts = [
  { name: "Bench Press", weight: "50", gain: "+7.5 kg", tone: "orange" },
  { name: "Deadlift", weight: "110", gain: "+12.5 kg", tone: "blue" },
  { name: "Squat", weight: "90", gain: "+10 kg", tone: "lime" },
  { name: "Overhead Press", weight: "35", gain: "+5 kg", tone: "purple" },
] as const;

const recentRecords = [
  { name: "Deadlift", detail: "110 kg × 5 reps", age: "3d ago", tone: "blue" },
  { name: "Bench Press", detail: "50 kg × 8 reps", age: "6d ago", tone: "orange" },
  { name: "Squat", detail: "90 kg × 5 reps", age: "9d ago", tone: "lime" },
] as const;

const recordMonths = [
  {
    month: "OCTOBER 2025",
    records: [
      { name: "Deadlift", detail: "110 kg × 5", tone: "blue" },
      { name: "Bench Press", detail: "50 kg × 8", tone: "orange" },
      { name: "Squat", detail: "90 kg × 5", tone: "lime" },
      { name: "Overhead Press", detail: "35 kg × 6", tone: "purple" },
    ],
  },
  {
    month: "SEPTEMBER 2025",
    records: [
      { name: "Barbell Row", detail: "70 kg × 8", tone: "blue" },
      { name: "Bench Press", detail: "47.5 kg × 8", tone: "orange" },
      { name: "Hanging Leg Raise", detail: "BW × 15", tone: "pink" },
    ],
  },
] as const;

const consistency = [
  1, 1, 1, 1, 0, 1, 1, 1,
  1, 1, 0, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 0, 1,
  1, 1, 1, 1, 1, 1, 1, 1,
] as const;

type Tone = "orange" | "blue" | "lime" | "purple" | "pink";

function StatusBar({ time = "2:38" }: { readonly time?: string }) {
  return (
    <div className="progress-app__status" aria-hidden="true">
      <strong>{time}</strong>
      <span>▥ ᯤ <b>87</b></span>
    </div>
  );
}

function SectionHeading({
  children,
  action,
}: {
  readonly children: React.ReactNode;
  readonly action?: React.ReactNode;
}) {
  return (
    <div className="progress-app__section-heading">
      <h4>{children}</h4>
      {action}
    </div>
  );
}

function RecordMark({ tone }: { readonly tone: Tone }) {
  return <span className={`progress-app__record-mark is-${tone}`}>PR</span>;
}

function BottomControl() {
  return (
    <div className="progress-app__control" aria-hidden="true">
      <span className="progress-app__bolt">ϟ</span>
      <span className="progress-app__control-active">
        <i /><i /><i />
      </span>
    </div>
  );
}

function ProgressDashboard({ onViewRecords }: { readonly onViewRecords: () => void }) {
  return (
    <div className="progress-app__page">
      <StatusBar />

      <header className="progress-app__header">
        <h3>Progress</h3>
        <span className="progress-app__gear" aria-hidden="true">⚙</span>
      </header>

      <section className="progress-app__goal" aria-label="Weekly workout goal, zero of three workouts complete">
        <div className="progress-app__goal-copy">
          <span>WEEKLY WORKOUT GOAL</span>
          <h4>3 workouts<br />to go.</h4>
        </div>
        <div className="progress-app__goal-count"><strong>0</strong><span>/3</span></div>
        <div className="progress-app__goal-track" aria-hidden="true"><i /><i /><i /></div>
        <p>Complete 3 more to hit your target.</p>
      </section>

      <section className="progress-app__section">
        <SectionHeading action={<span className="progress-app__filter">4 weeks&nbsp;&nbsp;☷</span>}>
          STRENGTH PROGRESSION
        </SectionHeading>
        <div className="progress-app__lifts">
          {lifts.map((lift) => (
            <article key={lift.name} className={`progress-app__lift is-${lift.tone}`}>
              <h5><i />{lift.name}</h5>
              <strong>{lift.weight} <small>kg</small></strong>
              <b>↑{lift.gain}</b>
              <span>in 4 weeks</span>
            </article>
          ))}
        </div>
      </section>

      <section className="progress-app__section">
        <SectionHeading>CONSISTENCY</SectionHeading>
        <div className="progress-app__heatmap" aria-label="Thirty workouts completed across the last four weeks">
          {consistency.map((done, index) => <i key={index} className={done ? "is-done" : ""} />)}
        </div>
      </section>

      <section className="progress-app__section">
        <SectionHeading>VOLUME</SectionHeading>
        <div className="progress-app__volume">
          <article><span>This week</span><strong>24,500</strong><small>kg lifted</small></article>
          <article><span>All-time</span><strong>312,400</strong><small>kg lifted</small></article>
        </div>
      </section>

      <section className="progress-app__section progress-app__records">
        <SectionHeading action={
          <button type="button" onClick={onViewRecords}>VIEW ALL&nbsp;&nbsp;→</button>
        }>
          PERSONAL RECORDS
        </SectionHeading>
        <div className="progress-app__record-list">
          {recentRecords.map((record) => (
            <article key={record.name}>
              <RecordMark tone={record.tone} />
              <div><strong>{record.name}</strong><span>{record.detail}</span></div>
              <small>{record.age}</small>
            </article>
          ))}
        </div>
      </section>

      <BottomControl />
    </div>
  );
}

function AllRecords({ onBack }: { readonly onBack: () => void }) {
  return (
    <div className="progress-app__page progress-app__all-records">
      <StatusBar time="2:39" />
      <header className="progress-app__records-header">
        <button type="button" onClick={onBack} aria-label="Back to progress">‹</button>
        <h3>All Records</h3>
      </header>

      <nav className="progress-app__muscles" aria-label="Filter records by muscle group">
        <span>CHEST</span><span>BACK</span><span>SHOULDERS</span><span>ARMS</span><span>LEGS</span><span>CORE</span>
      </nav>

      {recordMonths.map((group) => (
        <section key={group.month} className="progress-app__record-month">
          <h4>{group.month}</h4>
          <div>
            {group.records.map((record) => (
              <article key={`${group.month}-${record.name}`}>
                <i className={`is-${record.tone}`} />
                <strong>{record.name}</strong>
                <span>{record.detail}</span>
              </article>
            ))}
          </div>
        </section>
      ))}

      <BottomControl />
    </div>
  );
}

function ProgressAppMockup() {
  const [showRecords, setShowRecords] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="progress-app" aria-label="Stack progress screen preview">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={showRecords ? "records" : "progress"}
          initial={reduceMotion ? false : { opacity: 0, x: showRecords ? 22 : -22 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: showRecords ? -22 : 22 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        >
          {showRecords
            ? <AllRecords onBack={() => setShowRecords(false)} />
            : <ProgressDashboard onViewRecords={() => setShowRecords(true)} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function SeeWorkStackUp() {
  return (
    <section id="progress" className="work-stacks-section scroll-mt-24">
      <div className="work-stacks-section__inner">
        <RevealOnScroll className="work-stacks-section__intro">
          <div className="work-stacks-section__eyebrow">YOUR PROGRESS</div>
          <h2>See the work <span>stack up.</span></h2>
          <p>One workout rarely feels like much. Stack remembers all of them—and shows you what they became together.</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="work-stacks-section__showcase">
          <ProgressAppMockup />
        </RevealOnScroll>

        <RevealOnScroll delay={0.08} className="work-stacks-section__conclusion">
          <p>None of those workouts felt transformational alone.<br /><span>Together, they changed you.</span></p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default SeeWorkStackUp;
