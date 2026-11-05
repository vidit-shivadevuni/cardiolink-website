"use client";

import { useState } from "react";
import { Icon, Section, Stack, styles, t } from "./shared";

const faqs = [
  {
    question: "What is CardioLink?",
    answer:
      "CardioLink is a concept for remote cardiac patient monitoring. It brings home readings, symptom check-ins and care-team review together between clinic visits.",
  },
  {
    question: "Is CardioLink an emergency service?",
    answer:
      "No. It is not intended for emergencies or continuous observation. Review times and response expectations must be agreed with the care team.",
  },
  {
    question: "Which devices and clinical systems can connect?",
    answer:
      "Compatibility depends on the device, clinical system and implementation. A technical assessment would establish supported connections before any rollout.",
  },
  {
    question: "Who decides what a patient should monitor?",
    answer:
      "The treating team defines the monitoring plan, appropriate ranges and follow-up process. CardioLink does not replace professional medical advice.",
  },
  {
    question: "What should an organization review before a pilot?",
    answer:
      "Clinical responsibilities, patient consent, data handling, security requirements, integration needs and local regulatory obligations should all be assessed before use.",
  },
];

function FaqItem({ question, answer }: (typeof faqs)[number]) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.full}>
      <div className={styles.divider} />
      <Stack gap={12} className={styles.full} style={{ padding: "20px 0" }}>
        <h3 className={styles.full}>
          <button
            type="button"
            className={styles.question}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className={t("s17 w6 lh14 navy grow")}>{question}</span>
            <span className={`${styles.toggle} ${open ? "" : styles.toggleClosed}`}>
              <Icon name="minus" size={18} />
            </span>
          </button>
        </h3>
        {open && <p className={t("s15 lh16 ink full")}>{answer}</p>}
      </Stack>
    </div>
  );
}

export function Faq() {
  return (
    <Section id="faqs">
      <div className={styles.faq}>
        <Stack gap={24} className={styles.faqIntro}>
          <p className={styles.eyebrow}>A little more clarity</p>
          <h2 className={styles.heading}>Good questions. Clear answers.</h2>
          <p className={styles.lede}>
            Understand the concept, its boundaries and what a thoughtful implementation would
            involve.
          </p>
          <a href="#request-a-demo" className={styles.textLink}>
            Talk with our team
            <Icon name="arrow-up-right-1" size={18} />
          </a>
        </Stack>
        <div className={`${styles.stack} ${styles.grow}`} style={{ alignSelf: "stretch" }}>
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
          <div className={styles.divider} />
        </div>
      </div>
    </Section>
  );
}
