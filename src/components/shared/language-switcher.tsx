"use client";

import { useEffect } from "react";
import Script from "next/script";

export function LanguageSwitcher() {
  // We use Google Translate to provide instant regional language support (Hindi, Marathi, etc.)
  // without needing to maintain massive translation JSON files during the hackathon.
  
  useEffect(() => {
    // Expose the init function to the window
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,ta,te,bn,gu,kn,ml,pa,ur', // Major Indian Languages
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };
  }, []);

  return (
    <div className="language-switcher-wrapper flex items-center gap-2">
      <div id="google_translate_element" className="min-w-[120px]"></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      <style jsx global>{`
        /* Hide the annoying Google Translate top banner */
        .skiptranslate > iframe.skiptranslate {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0px !important;
        }
        /* Style the dropdown slightly */
        .goog-te-gadget-simple {
          background-color: var(--color-surface) !important;
          border: 1px solid var(--color-outline) !important;
          border-radius: 9999px !important;
          padding: 4px 12px !important;
          font-family: inherit !important;
          display: flex !important;
          align-items: center !important;
          gap: 4px !important;
        }
        .goog-te-gadget-simple span {
          color: var(--color-on-surface) !important;
          font-weight: 500 !important;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
