import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryMarquee } from './components/CategoryMarquee';
import { TrendingSection } from './components/TrendingSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { CreatorSection } from './components/CreatorSection';
import { CategorySection } from './components/CategorySection';
import { DiscoverPage } from './components/DiscoverPage';
import { ProductDetail } from './components/ProductDetail';
import { ArticlesPage } from './components/ArticlesPage';
import { ArticleDetail } from './components/ArticleDetail';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccess } from './components/OrderSuccess';
import { LoginPage } from './components/LoginPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { ToastNotification } from './components/ToastNotification';
import { AuthModal } from './components/AuthModal';
import { AccountDrawer } from './components/AccountDrawer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentPath } = useCart();
  const cleanPath = currentPath.split('?')[0];

  // Route Resolver
  let pageContent: React.ReactNode;

  if (cleanPath.startsWith('/food/')) {
    const slug = cleanPath.replace('/food/', '');
    pageContent = <ProductDetail slug={slug} />;
  } else if (cleanPath.startsWith('/article/')) {
    const slug = cleanPath.replace('/article/', '');
    pageContent = <ArticleDetail slug={slug} />;
  } else if (cleanPath === '/articles') {
    pageContent = <ArticlesPage />;
  } else if (cleanPath === '/discover') {
    pageContent = <DiscoverPage />;
  } else if (cleanPath === '/checkout') {
    pageContent = <CheckoutPage />;
  } else if (cleanPath === '/order-success') {
    pageContent = <OrderSuccess />;
  } else if (cleanPath === '/login' || cleanPath === '/account') {
    pageContent = <LoginPage />;
  } else {
    // Default Home Page View
    pageContent = (
      <main>
        <Hero />
        <CategoryMarquee />
        <TrendingSection />
        <ReviewsSection />
        <ArticlesSection />
        <CreatorSection />
        <CategorySection />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#241A14] flex flex-col justify-between selection:bg-[#E85D32]/20 selection:text-[#241A14]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Page Body */}
      <div className="flex-grow">
        {pageContent}
      </div>

      {/* Global Modals & Overlays */}
      <CartDrawer />
      <SearchOverlay />
      <ToastNotification />
      <AuthModal />
      <AccountDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
