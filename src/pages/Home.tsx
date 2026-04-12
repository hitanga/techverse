import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedStories from '../components/FeaturedStories';
import LatestUpdates from '../components/LatestUpdates';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedStories />
      <LatestUpdates />
      <Newsletter />
    </>
  );
}
