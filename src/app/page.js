import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import NewArrivals from '@/components/NewArrivals';
import Collection from '@/components/Collection';
import CustomOrderForm from '@/components/CustomOrderForm';

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <NewArrivals />
      <Collection />
      <CustomOrderForm />
    </>
  );
}
