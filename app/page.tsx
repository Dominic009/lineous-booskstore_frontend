import HeroBanner from "../components/HeroBanner";
import NewReleases from "../components/NewReleases";
import Featured from "../components/Featured";
import DealOfTheDay from "../components/DealOfTheDay";
import PopularBooks from "../components/PopularBooks";
import WhyChooseUs from "../components/home/WhyChooseUs";
import SiteStats from "../components/home/SiteStats";
import CommunityCTA from "../components/home/CommunityCTA";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <HeroBanner />
        <NewReleases />
        <Featured />
        <WhyChooseUs />
        {/* <DealOfTheDay /> */}
        <SiteStats />
        <PopularBooks />
        <CommunityCTA />
      </main>
    </div>
  );
};

export default HomePage;
