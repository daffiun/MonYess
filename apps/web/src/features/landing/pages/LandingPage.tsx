import { useState, useEffect } from 'react';
import Lenis from 'lenis';

// Global & Navigation UI Components
import Preloader from '../components/Preloader';
import CustomCursor from '../components/CustomCursor';
import ScrollProgressBar from '../components/ScrollProgressBar';
import Navbar from '../components/Navbar';
import ChapterNav from '../components/ChapterNav';
import ProjectModal from '../components/ProjectModal';
import ShowreelModal from '../components/ShowreelModal';

// 16 Sections in Strict Order
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import FeaturedWorkSection from '../components/FeaturedWorkSection';
import PitchdeckSection from '../components/PitchdeckSection';
import WhatWeDoSection from '../components/WhatWeDoSection';
import HappyClientsSection from '../components/HappyClientsSection';
import CultureTeaserSection from '../components/CultureTeaserSection';
import WhoWeAreSection from '../components/WhoWeAreSection';
import OurVibeSection from '../components/OurVibeSection';
import CoreValuesSection from '../components/CoreValuesSection';
import WhatWeBelieveSection from '../components/WhatWeBelieveSection';
import TheWorkSection from '../components/TheWorkSection';
import AwardsSection from '../components/AwardsSection';
import ClientsHeartSection from '../components/ClientsHeartSection';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';

export default function LandingPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);

  // Initialize smooth scrolling with Lenis
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070708] text-[#F5F5F7] selection:bg-accent selection:text-black">
      {/* 0% -> 100% Animated Preloader */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* Award-style Interactive Custom Cursor */}
      <CustomCursor />

      {/* Minimal Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Floating Vertical Chapter Navigation */}
      <ChapterNav />

      {/* Fixed Header */}
      <Navbar onOpenProjectModal={() => setProjectModalOpen(true)} />

      {/* Main Single-Page Award Flow */}
      <main>
        {/* 01. HERO */}
        <HeroSection
          onOpenShowreel={() => setShowreelOpen(true)}
          onOpenProjectModal={() => setProjectModalOpen(true)}
        />

        {/* 02. INTRO STATEMENT */}
        <IntroSection />

        {/* 03. FEATURED WORK */}
        <FeaturedWorkSection />

        {/* 04. PITCHDECK TEASER */}
        <PitchdeckSection />

        {/* 05. WHAT WE DO */}
        <WhatWeDoSection />

        {/* 06. HAPPY CLIENTS */}
        <HappyClientsSection />

        {/* 07. CULTURE TEASER */}
        <CultureTeaserSection />

        {/* 08. WHO WE ARE */}
        <WhoWeAreSection />

        {/* 09. OUR VIBE */}
        <OurVibeSection />

        {/* 10. CORE VALUES */}
        <CoreValuesSection />

        {/* 11. WHAT WE BELIEVE */}
        <WhatWeBelieveSection />

        {/* 12. THE WORK */}
        <TheWorkSection />

        {/* 13. AWARDS */}
        <AwardsSection />

        {/* 14. CLIENTS WITH A HEART */}
        <ClientsHeartSection />

        {/* 15. CONTACT CTA */}
        <ContactSection onOpenProjectModal={() => setProjectModalOpen(true)} />
      </main>

      {/* 16. FOOTER */}
      <FooterSection />

      {/* Multi-step "Start a project" modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />

      {/* Fullscreen Video Showreel Modal */}
      <ShowreelModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
      />
    </div>
  );
}
