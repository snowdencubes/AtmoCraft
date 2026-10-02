"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { Globe, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "bn", name: "বাংলা" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ml", name: "മലയാളം" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
  { code: "as", name: "অসমীয়া" },
  { code: "ur", name: "اردو" }
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentLang, setCurrentLang] = useState("en");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read current lang from cookie if it exists
    const match = document.cookie.match(/(?:^|;)\s*googtrans=([^;]*)/);
    if (match) {
      const parts = decodeURIComponent(match[1]).split("/");
      if (parts.length === 3 && parts[2]) {
        setCurrentLang(parts[2]);
      }
    } else {
      const saved = localStorage.getItem("atmocraft_lang");
      if (saved && saved !== "en") {
        setLanguage(saved, false);
      }
    }

    // Expose init function
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Outside click handler
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const setLanguage = (code: string, reload = true) => {
    setCurrentLang(code);
    setIsOpen(false);
    localStorage.setItem("atmocraft_lang", code);
    
    if (code === "en") {
      // Clear cookie to reset to English
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`;
      document.cookie = `googtrans=/en/${code}; domain=${window.location.hostname}; path=/;`;
    }
    
    if (reload) {
      window.location.reload();
    }
  };

  const filteredLangs = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={menuRef}>
      <div id="google_translate_element" className="hidden"></div>
      
      {isOpen && (
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 sm:h-11 sm:w-auto items-center justify-center sm:px-4 sm:py-2 gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md transition-all hover:bg-white/20 dark:hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="h-5 w-5 sm:h-4 sm:w-4 text-[var(--on-surface)]" />
        <span className="hidden text-sm font-semibold uppercase sm:block text-[var(--on-surface)]">
          {currentLang}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-32px)] max-w-xs sm:w-64 origin-top-right overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] shadow-[0_8px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] z-[100] flex flex-col max-h-[70vh] sm:max-h-[400px] animate-fade-in notranslate" translate="no">
          <div className="p-3 border-b border-[var(--outline)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--on-surface-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full rounded-lg bg-[var(--surface-raised)] py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--on-surface)] placeholder:text-[var(--on-surface-muted)]"
                autoFocus
              />
            </div>
          </div>
          
          <div className="overflow-y-auto p-2 flex-1 scrollbar-thin">
            {filteredLangs.length === 0 ? (
              <p className="p-4 text-center text-sm text-[var(--on-surface-muted)]">No language found</p>
            ) : (
              <div className="flex flex-col gap-1">
                {filteredLangs.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--surface-raised)] focus-visible:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      currentLang === lang.code && "bg-[var(--primary)]/10 font-semibold text-[var(--primary)] dark:bg-[var(--primary)]/20 dark:text-[var(--primary-light)]"
                    )}
                  >
                    <span>{lang.name}</span>
                    {currentLang === lang.code && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Hide all default Google Translate UI elements completely */
        .skiptranslate, 
        .goog-te-banner-frame, 
        #goog-gt-tt, 
        .goog-te-balloon-frame,
        div#goog-gt- {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          pointer-events: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        body {
          top: 0px !important;
          position: static !important;
        }
        html {
          height: auto !important;
        }
      `}</style>
    </div>
  );
}
