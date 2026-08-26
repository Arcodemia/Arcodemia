'use client';

import { useReveal } from '@/hooks/useReveal';
import { useTapSpotlight } from '@/hooks/useTapSpotlight';
import { LegalProvider } from '@/components/LegalDialogs';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Spiders } from '@/components/Spiders';
import { Bugs } from '@/components/Bugs';
import { PainPoints } from '@/components/PainPoints';
import { Process } from '@/components/Process';
import { RiskReversal } from '@/components/RiskReversal';
import { FAQ } from '@/components/FAQ';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { A11yWidget } from '@/components/A11yWidget';

export default function Page() {
  useReveal();
  useTapSpotlight();

  return (
    <LegalProvider>
      <a className="skip" href="#main">
        דילוג לתוכן הראשי
      </a>

      {/* גרעין — הורג את המראה של "גרדיאנט CSS שטוח" */}
      <div className="grain" aria-hidden="true" />
      {/* מסגרת קווים דקה — נותנת לדף מבנה של מוצר, לא של תבנית */}
      <div className="frame" aria-hidden="true" />

      <Nav />

      <main id="main">
        <a id="top" />
        <Hero />

        {/* ============================================================
            הרצועה שבין ה-hero ל"בלי סיכון": רשת היי-טק, דעיכת הזוהר
            הסגול לשחור, והעכבישים. כולם ברקע, מתחת לכל טקסט.
            ============================================================ */}
        <div className="techbg">
          <Spiders />
          <PainPoints />
          <Process />
        </div>

        <RiskReversal />

        {/* ============================================================
            חלקו האחרון של הדף — החיפושיות זוחלות מאחורי טופס
            הפנייה והשאלות הנפוצות, מתחת לכל טקסט.
            ============================================================ */}
        <div className="endbg">
          <Bugs />
          <ContactSection />
          {/* השאלות הנפוצות יורדות לתחתית — מיד מעל ה-footer */}
          <FAQ />
        </div>
      </main>

      <Footer />
      <WhatsAppFab />
      <A11yWidget />
    </LegalProvider>
  );
}
