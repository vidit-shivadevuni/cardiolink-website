import { Icon, Section, SectionIntro, Stack, styles } from "./shared";

const audiences = [
  {
    icon: "stethoscope",
    title: "For cardiologists",
    body: "Put readings and symptoms in context, so the next conversation starts with a fuller picture.",
    tag: "Clinical clarity",
  },
  {
    icon: "hospital",
    title: "For care organizations",
    body: "Shape a coordinated monitoring workflow around your team, review capacity and care pathways.",
    tag: "Connected operations",
  },
  {
    icon: "heart-handshake-1",
    title: "For cardiac patients",
    body: "Know what to measure, share how you feel and stay connected to the people supporting your care.",
    tag: "Everyday confidence",
  },
];

export function Audience() {
  return (
    <Section id="who-we-support">
      <Stack gap={32}>
        <SectionIntro
          eyebrow="One connection. Three perspectives."
          title={["Care is a team effort."]}
          lede="Designed to bring the clinic and everyday life closer, without losing sight of the person."
        />
        <div className={styles.cols3}>
          {audiences.map((audience) => (
            <Stack key={audience.title} gap={20} className={`${styles.card} ${styles.grow}`}>
              <Icon name={audience.icon} size={30} />
              <h3 className={styles.cardTitle}>{audience.title}</h3>
              <p className={styles.body}>{audience.body}</p>
              <p className={styles.eyebrow}>{audience.tag}</p>
            </Stack>
          ))}
        </div>
      </Stack>
    </Section>
  );
}
