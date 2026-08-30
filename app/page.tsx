'use client';

import { useReveal } from '@/hooks/useReveal';
import { useTapSpotlight } from '@/hooks/useTapSpotlight';
import { LegalProvider } from '@/components/LegalDialogs';
import { Nav } from '@/components/Nav';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { ServicesCarousel } from '@/components/ServicesCarousel';
import { Automation, NfcCards, Marketing } from '@/components/Highlights';
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';
import { ShareFab } from '@/components/ShareFab';
import { A11yWidget } from '@/components/A11yWidget';

/* ============================================================
   עמוד הבית של הסוכנות
   ------------------------------------------------------------
   ⚠️ הפוזיציה השתנתה: זה כבר לא דף מכירה לדף נחיתה אחד, אלא
   עמוד בית של סוכנות דיגיטל עם חמישה שירותים.

   כל הקופי של דפי הנחיתה (כרטיסי הכאב, ארבעת השלבים, הסרת
   הסיכון והשאלות הנפוצות) עבר כמות שהוא אל
   app/services/landing-pages. הוא לא נמחק ולא נכתב מחדש.

   סדר החתכים אינו שרירותי:
     hero      ההבטחה, במשפט שלא נגענו בו
     work      ההוכחה. עבודה שרצה באוויר, גבוה ככל האפשר
     services  חמש הקטגוריות, שער לעמודי המשנה
     automation / nfc / marketing  השירותים שדורשים הסבר
     about     מי עומד מאחורי זה
     reviews   מה אומרים אחרים
     contact   הפעולה
   ============================================================ */
export default function Page() {
  useReveal();
  useTapSpotlight();

  return (
    <LegalProvider>
      <a className="skip" href="#main">
        דילוג לתוכן הראשי
      </a>

      {/* גרעין: הורג את המראה של גרדיאנט CSS שטוח */}
      <div className="grain" aria-hidden="true" />
      {/* מסגרת קווים דקה: נותנת לדף מבנה של מוצר, לא של תבנית */}
      <div className="frame" aria-hidden="true" />

      <Nav />

      <main id="main">
        <a id="top" />
        <Hero />
        <Portfolio />
        <ServicesCarousel />
        <Automation />
        <NfcCards />
        <Marketing />
        <About />
        <Testimonials />
        <ContactSection />
      </main>

      <Footer />
      <WhatsAppFab />
      <ShareFab />
      <A11yWidget />
    </LegalProvider>
  );
}
