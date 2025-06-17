import Image from "next/image";
import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import FeatureGrid from "@/components/features/FeatureGrid";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-black text-white">
      <Navbar />
      <Hero />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
