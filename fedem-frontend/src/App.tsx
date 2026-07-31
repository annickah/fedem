import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Stats from './components/Stats';
import Blog from './components/Blog';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
      isDark ? 'bg-black text-white' : 'bg-white text-gray-900'
    }`}>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Blog />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
