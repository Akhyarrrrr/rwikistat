import Hero from "@/components/landing-page/hero";
import FeatureWhy from "@/components/landing-page/features-why";
import Header from "@/components/landing-page/header";
import Features from "@/components/landing-page/features";
import DownloadNow from "@/components/landing-page/download-now";
import Footer from "@/components/landing-page/footer";

export const metadata = {
  title: "Rwikistat",
  description:
    "Rwikistat Learning App for Data Science, under licensed by RWikiStat Team.",
};

export default function home() {
  return (
    <>
      <Header />
      <Hero />
      <FeatureWhy />
      <Features />
      <DownloadNow />
      <Footer />
    </>
  );
}
