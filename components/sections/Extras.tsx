import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const EXTRAS: { icon: IconName; title: string; body: string }[] = [
  { icon: "link", title: "Supersets", body: "Pair two exercises and alternate their sets." },
  { icon: "message", title: "Notes", body: "Leave yourself a cue on any exercise. It’s there next time." },
  { icon: "calendarPlus", title: "Past workouts", body: "Forgot to log one? Add it after, on the right day." },
  { icon: "pencil", title: "Edit anything", body: "Fix a set or delete a workout from its summary." },
];

/** The smaller things in the logger and summary, from components/SupersetSheet.tsx to app/edit-workout.tsx. */
export function Extras() {
  return (
    <section className="extras" aria-labelledby="extras-title">
      <Reveal className="section-head">
        <p className="eyebrow">AND THE LITTLE THINGS</p>
        <h2 id="extras-title" className="section-title">Made for how you actually train.</h2>
      </Reveal>
      <div className="toolkit">
        {EXTRAS.map((item, index) => (
          <Reveal key={item.title} className="toolkit__item" delay={index * 60}>
            <span className="toolkit__icon"><Icon name={item.icon} size={20} stroke={1.8} /></span>
            <span><b>{item.title}</b><span>{item.body}</span></span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
