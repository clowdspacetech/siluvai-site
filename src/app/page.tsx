import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";
import VideoHub from "@/components/VideoHub";
import RegistrationForm from "@/components/RegistrationForm";
import DonationSection from "@/components/DonationSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <VideoHub />
        <RegistrationForm />
        <DonationSection />
      </main>
      <Footer />
    </>
  );
}
