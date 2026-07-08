import { Hero } from "@/components/Hero";
import { ScheduleSection } from "@/components/ScheduleSection";
import { MinistryStory } from "@/components/MinistryStory";
import { LocationSection } from "@/components/LocationSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  const resendConfigured = Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.RESEND_TO_EMAIL
  );

  return (
    <>
      <Hero />
      <ScheduleSection />
      <MinistryStory />
      <LocationSection />
      <ContactSection resendConfigured={resendConfigured} />
    </>
  );
}
