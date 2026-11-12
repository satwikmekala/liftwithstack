import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RoutineImportDemo } from "./RoutineImportDemo";

const WAYS: { title: string; body: string; icon: IconName }[] = [
  { title: "Import from Hevy", body: "History from Hevy Free. Routines and history from Pro.", icon: "download" },
  { title: "Get Stack’s plan", body: "Answer four questions. Get a plan that fits your week and your gym.", icon: "calendarDays" },
  { title: "Build your own", body: "Choose the exercises and order for each workout.", icon: "pencil" },
  { title: "Share a routine", body: "Send a link. They save their own copy to edit.", icon: "link" },
];

/** The four questions Get Stack’s Plan asks (features/stacked-plan/steps), with one example answer each. */
const ANSWERS = [
  { q: "How familiar are you with the gym?", a: "Getting comfortable" },
  { q: "How often can you hit the gym?", a: "Up to 4 days" },
  { q: "What’s in your gym?", a: "A typical gym" },
  { q: "What would you like to focus on?", a: "Balanced physique" },
];

export function Routines() {
  return (
    <section className="routines" id="routines" aria-labelledby="routines-title">
      <Reveal className="section-head">
        <p className="eyebrow">GET STARTED</p>
        <h2 id="routines-title" className="section-title">Already training? Bring it with you.</h2>
        <p className="section-body">Import your workouts so Stack knows what you’ve lifted. Paste a routine from your notes or ChatGPT, and Stack builds it for you.</p>
      </Reveal>

      <RoutineImportDemo />

      <div className="plan" id="plan">
        <Reveal className="plan__copy">
          <p className="eyebrow">GET STACK’S PLAN</p>
          <h3 className="plan__title">Not sure what to train?</h3>
          <p className="section-body">Tell Stack how you train. Get a plan that fits.</p>
          <ol className="plan__steps">
            {ANSWERS.map((answer, index) => (
              <li key={answer.q}><span className="mono">{index + 1}</span><span><small>{answer.q}</small><b>{answer.a}</b></span></li>
            ))}
          </ol>
        </Reveal>
        <Reveal className="plan-card" delay={100} aria-label="Stack’s recommended plan, an example">
          <p className="plan-card__read mono">COMFORTABLE · BALANCED PHYSIQUE</p>
          <p className="plan-card__ready">Your training plan is ready.</p>
          <div className="plan-card__pick">
            <p className="plan-card__tag mono">RECOMMENDED</p>
            <p className="plan-card__name">Upper / Lower</p>
            <p className="plan-card__meta mono">4 days a week</p>
            <div className="plan-card__days">
              {["Upper A", "Lower A", "Upper B", "Lower B"].map((day, index) => (
                <span key={day}><i className="mono">{"ABCD"[index]}</i>{day}</span>
              ))}
            </div>
            <p className="plan-card__why">Upper and lower days alternate, so every major muscle is trained twice a week.</p>
            <p className="plan-card__link">See the workouts<Icon name="chevronRight" size={15} /></p>
          </div>
        </Reveal>
      </div>

      <div className="ways">
        {WAYS.map((way, index) => (
          <Reveal key={way.title} className="way" delay={index * 70}>
            <span className="way__icon"><Icon name={way.icon} size={22} stroke={1.8} /></span>
            <p className="way__title">{way.title}</p>
            <p className="way__body">{way.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
