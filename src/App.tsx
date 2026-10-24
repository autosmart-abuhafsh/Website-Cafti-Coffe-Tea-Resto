/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteConfig, defaultSiteConfig } from './data/siteConfig';
import { MenuItem } from './data/menu';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandStory } from './components/BrandStory';
import { MenuSection } from './components/MenuSection';
import { ScrollStorySection } from './components/ScrollStorySection';
import { ExperienceSection } from './components/ExperienceSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialSection } from './components/TestimonialSection';
import { LocationSection } from './components/LocationSection';
import { ReservationForm, OrderLineItem } from './components/ReservationForm';
import { Footer } from './components/Footer';
import { OrderDrawer } from './components/OrderDrawer';
import { ConfigPreviewDrawer } from './components/ConfigPreviewDrawer';

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion safely across all browsers
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(Boolean(mediaQuery.matches));

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(Boolean(e.matches));
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, []);

  const handleAddToOrder = (item: MenuItem, quantity: number, note: string) => {
    setOrderItems((prev) => {
      const existingIdx = prev.findIndex((entry) => entry.item.id === item.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          note: note.trim() || updated[existingIdx].note,
        };
        return updated;
      }
      return [...prev, { item, quantity, note: note.trim() }];
    });
  };

  const handleUpdateOrderQty = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((entry) =>
          entry.item.id === id
            ? { ...entry, quantity: entry.quantity + delta }
            : entry,
        )
        .filter((entry) => entry.quantity > 0),
    );
  };

  const handleRemoveOrderItem = (id: string) => {
    setOrderItems((prev) => prev.filter((entry) => entry.item.id !== id));
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const totalOrderCount = orderItems.reduce(
    (sum, entry) => sum + entry.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-[#171918] text-[#FAF9F6] selection:bg-[#B8754D] selection:text-[#FAF9F6]">
      {/* Skip to Main Content for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-[#B8754D] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#FAF9F6]"
      >
        Lewati ke konten utama
      </a>

      {/* Top Navigation Bar */}
      <Navbar
        config={siteConfig}
        orderCount={totalOrderCount}
        onOpenOrderDrawer={() => setOrderDrawerOpen(true)}
        reducedMotion={reducedMotion}
      />

      {/* Main Content */}
      <main id="main-content">
        {/* 1. Hero Section — Cinematic 3D Experience */}
        <HeroSection config={siteConfig} reducedMotion={reducedMotion} />

        {/* 2. Brand Story Section */}
        <BrandStory config={siteConfig} reducedMotion={reducedMotion} />

        {/* 3. Signature Menu Section */}
        <MenuSection
          config={siteConfig}
          onAddToOrder={handleAddToOrder}
          reducedMotion={reducedMotion}
        />

        {/* 4. Signature 3D Scroll Story — The Making of a Moment */}
        <ScrollStorySection reducedMotion={reducedMotion} />

        {/* 5. Experience Section — Three Pillars */}
        <ExperienceSection config={siteConfig} reducedMotion={reducedMotion} />

        {/* 6. Gallery Section with Lightbox */}
        <GallerySection reducedMotion={reducedMotion} />

        {/* 7. Testimonial Section (Zero Fake Reviews Discipline) */}
        <TestimonialSection config={siteConfig} />

        {/* 8. Location Section — Malang, Indonesia */}
        <LocationSection
          config={siteConfig}
          onOpenConfigDrawer={() => setConfigDrawerOpen(true)}
          reducedMotion={reducedMotion}
        />

        {/* 9. Reservation & WhatsApp Ordering Section */}
        <ReservationForm
          config={siteConfig}
          orderItems={orderItems}
          onClearOrder={handleClearOrder}
        />
      </main>

      {/* 10. Editorial Footer */}
      <Footer
        config={siteConfig}
        onOpenConfigDrawer={() => setConfigDrawerOpen(true)}
      />

      {/* Slide-Over Drawers for Menu Order & Business Configuration Preview */}
      <OrderDrawer
        isOpen={orderDrawerOpen}
        onClose={() => setOrderDrawerOpen(false)}
        config={siteConfig}
        items={orderItems}
        onUpdateQty={handleUpdateOrderQty}
        onRemoveItem={handleRemoveOrderItem}
        onClearAll={handleClearOrder}
      />

      <ConfigPreviewDrawer
        isOpen={configDrawerOpen}
        onClose={() => setConfigDrawerOpen(false)}
        config={siteConfig}
        onUpdateConfig={setSiteConfig}
      />
    </div>
  );
}
