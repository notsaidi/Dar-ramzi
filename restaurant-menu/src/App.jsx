import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StorySection from './components/StorySection';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import ConfiguratorModal from './components/ConfiguratorModal';
import { useState } from 'react';

export default function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection />
        <StorySection />
        <MenuSection onSelectMenuItem={setSelectedItem} />
      </main>
      <Footer />
      {selectedItem && (
        <ConfiguratorModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
