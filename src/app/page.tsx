import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoHub from "@/components/VideoHub";
import EventsSection from "@/components/EventsSection";
import RegistrationForm from "@/components/RegistrationForm";
import DonationSection from "@/components/DonationSection";
import { localRepository } from "@/lib/db/local-repository";

export default async function HomePage() {
  const events = await localRepository.getEvents();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <VideoHub />
        <EventsSection events={events} />
        <RegistrationForm />
        <DonationSection />
      </main>
      <Footer />
    </>
  );
}
