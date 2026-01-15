import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import LoadingScreen from '@/components/LoadingScreen';
import HeroSection from '@/components/HeroSection';
import ExploreCollections from '@/components/ExploreCollections';

import FeaturedProducts from '@/components/FeaturedProducts';
import Newsletter from '@/components/Newsletter';



const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('dapper-loaded');
    if (hasLoaded) setIsLoading(false);
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('dapper-loaded', 'true');
    setIsLoading(false);
  };

  if (isLoading) return <LoadingScreen onComplete={handleLoadingComplete} />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />
      <main>
        <HeroSection />
        <ExploreCollections />

        <FeaturedProducts />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
