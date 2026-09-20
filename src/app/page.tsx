import LandingNavbar from "@/components/LandingNavbar";
import Hero from "@/components/Hero";
import CompanyHero from "@/components/CompanyHero";
import MetricsBanner from "@/components/MetricsBanner";
import AboutCompany from "@/components/AboutCompany";
import CompanyServices from "@/components/CompanyServices";
import CategoryDisplay from "@/components/CategoryDisplay";
import VideoPlayer from "@/components/VideoPlayer";
import DomeGallerySection from "@/components/DomeGallerySection";
import WaitlistFooter from "@/components/WaitlistFooter";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
      {/* Landing Page Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Full-screen hero with video + parallax wordmark */}
        <Hero />

        {/* Enterprise banner — dark with gradient headline */}
        <CompanyHero />

        {/* Animated count-up metrics */}
        <MetricsBanner />

        {/* Product Category Masonry Grid */}
        <div id="categories-section" className="relative z-20">
          <CategoryDisplay />
        </div>

        {/* About Company — dark frosted glass pillar cards */}
        <AboutCompany />

        {/* Cinematic Video Showcase */}
        <div id="video-section" className="relative z-20">
          <VideoPlayer title="About the Application" />
        </div>

        {/* Services Bento Grid */}
        <CompanyServices />

        {/* Interactive 3D Dome Gallery */}
        <DomeGallerySection />
      </main>

      {/* Dark footer with waitlist form */}
      <WaitlistFooter />
    </div>
  );
}
