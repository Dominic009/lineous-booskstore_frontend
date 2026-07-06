import HeroBanner from "../components/HeroBanner";
import NewReleases from "../components/NewReleases";
import Featured from "../components/Featured";
import DealOfTheDay from "../components/DealOfTheDay";
import PopularBooks from "../components/PopularBooks";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 lg:pt-20">
        <HeroBanner />
        <NewReleases />
        <Featured />
        <DealOfTheDay />
        <PopularBooks />
      </main>
    </div>
  );
};

export default HomePage;
