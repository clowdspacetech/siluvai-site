import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoHub from "@/components/VideoHub";
import EventsSection from "@/components/EventsSection";
import RegistrationForm from "@/components/RegistrationForm";
import DonationSection from "@/components/DonationSection";
import ThemedShell from "@/components/ThemedShell";
import { localRepository } from "@/lib/db/local-repository";

export default async function HomePage() {
  const events = await localRepository.getEvents();

  return (
    <>
      <Header />
      <ThemedShell hero={<Hero />}>
        <About />
        <VideoHub />
        <EventsSection events={events} />
        <RegistrationForm />
        <DonationSection />
      </ThemedShell>
      <Footer />
    </>
  );
}
