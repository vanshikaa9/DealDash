import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Tag, Utensils, Shirt, Cpu, Plane, ShoppingBasket, Wallet, Sun, Moon, Bookmark } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
// PiggyLogo available at @/components/PiggyLogo if needed
import { useFavourites } from '@/context/FavouritesContext';

const CATEGORIES = [
{ label: 'Food', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
{ label: 'Fashion', icon: Shirt, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/30' },
{ label: 'Electronics', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
{ label: 'Travel', icon: Plane, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/30' },
{ label: 'Grocery', icon: ShoppingBasket, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
{ label: 'Utility', icon: Wallet, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/30' }];


// ── Logo is imported from @/components/PiggyLogo ─────────────────────────────

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { count: favCount } = useFavourites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setIsCategoriesOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/?category=${encodeURIComponent(cat)}`);
  };

  const isActive = (href: string) =>
  href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 group">
            <img
              src="/airo-assets/images/pages/unknown/dealdash"
              alt="DealDash"
              className="h-14 w-auto object-contain dark:brightness-0 dark:invert" />

          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            <Link
              to="/"
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
              isActive('/') ?
              'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold' :
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }>

              Home
            </Link>

            {/* Categories dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoriesOpen((v) => !v)}
                className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
                isCategoriesOpen ?
                'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' :
                'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }>

                <Tag size={14} />
                Categories
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />

              </button>

              {isCategoriesOpen &&
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/80 dark:shadow-black/40 p-3 z-50">
                  <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-2">
                    Browse by category
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {CATEGORIES.map(({ label, icon: Icon, color, bg }) =>
                  <button
                    key={label}
                    onClick={() => handleCategoryClick(label)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group/cat">

                        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={14} className={color} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover/cat:text-slate-900 dark:group-hover/cat:text-slate-100">
                          {label}
                        </span>
                      </button>
                  )}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                    <button
                    onClick={() => handleCategoryClick('All')}
                    className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">

                      View all categories →
                    </button>
                  </div>
                </div>
              }
            </div>

            <Link
              to="/expiring"
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
              isActive('/expiring') ?
              'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold' :
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }>

              Expiring Soon
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
              isActive('/about') ?
              'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold' :
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }>

              About
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
              isActive('/contact') ?
              'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold' :
              'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }>

              Contact
            </Link>
          </nav>

          {/* Right side: theme toggle + favourites + CTA */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-200">

              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Favourites */}
            <Link
              to="/favourites"
              aria-label="Saved deals"
              className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">

              <Bookmark size={17} />
              {favCount > 0 &&
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favCount > 9 ? '9+' : favCount}
                </span>
              }
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-sm shadow-indigo-200 dark:shadow-indigo-900 hover:shadow-indigo-300 transition-all duration-150">

              <span className="text-base leading-none">+</span>
              Add Coupon
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">

              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              aria-label="Toggle menu">

              {isMobileMenuOpen ?
              <X size={20} className="text-slate-700 dark:text-slate-300" /> :
              <Menu size={20} className="text-slate-700 dark:text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen &&
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 py-3 space-y-1">
            <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
            isActive('/') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
            }>

              Home
            </Link>

            <div className="px-3 pt-1 pb-0.5">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Categories</div>
              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map(({ label, icon: Icon, color, bg }) =>
              <button
                key={label}
                onClick={() => handleCategoryClick(label)}
                className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">

                    <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
                      <Icon size={15} className={color} />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{label}</span>
                  </button>
              )}
              </div>
            </div>

            <Link
            to="/expiring"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
            isActive('/expiring') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
            }>

              Expiring Soon
            </Link>

            <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
            isActive('/about') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
            }>

              About
            </Link>

            <Link
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 text-sm font-medium py-2.5 px-3 rounded-xl transition-colors ${
            isActive('/contact') ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`
            }>

              Contact
            </Link>

            <Link
            to="/admin"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-1.5 bg-indigo-600 text-white text-sm font-semibold py-2.5 px-3 rounded-xl mt-2">

              + Add Coupon
            </Link>
          </div>
        }
      </div>
    </header>);

}