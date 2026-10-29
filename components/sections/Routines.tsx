import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RoutineImportDemo } from "./RoutineImportDemo";

const WAYS: { title: string; body: string; icon: IconName }[] = [
  { title: "Import from Hevy", body: "History from Hevy Free. Routines and history from Pro.", icon: "download" },
  { title: "Get Stack’s plan", body: "Workouts in order, set by how often you train.", icon: "calendarDays" },
  { title: "Build your own", body: "Choose the exercises and order for each workout.", icon: "pencil" },
  { title: "Share a routine", body: "Send a link. They save their own copy to edit.", icon: "link" },
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
