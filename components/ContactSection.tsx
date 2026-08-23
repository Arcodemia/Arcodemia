import { CONFIG } from '@/lib/config';
import { waURL } from '@/lib/whatsapp';
import { ContactForm } from './ContactForm';
import { MailIcon, PhoneIcon, WhatsAppIcon } from './icons';

const DIRECT_WA_MSG = 'שלום, אשמח לקבל הצעת מחיר לדף נחיתה לעסק שלי.';

export function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">יוצרים קשר</span>
          <h2>נדבר?</h2>
          <p>הכי מהיר בוואטסאפ. אם נוח לכם אחרת — התקשרו, שלחו מייל, או השאירו פרטים ונחזור אליכם.</p>
        </div>
      </div>

      <div className="wrap contact">
        <div className="direct rv">
          <a
            className="dline"
            href={waURL(DIRECT_WA_MSG)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="dline__ic dline__ic--wa">
              <WhatsAppIcon />
            </span>
            <span>
              <strong>וואטסאפ</strong>
              <span className="sub">המסלול המהיר — נענים תוך זמן קצר</span>
            </span>
          </a>

          <a className="dline" href={`tel:${CONFIG.phoneDial}`}>
            <span className="dline__ic dline__ic--ph">
              <PhoneIcon />
            </span>
            <span>
              <strong>טלפון</strong>
              {/* <bdi> מבודד את המספר מכיווניות ה-RTL */}
              <span className="val">
                <bdi>{CONFIG.phone}</bdi>
              </span>
            </span>
          </a>

          <a className="dline" href={`mailto:${CONFIG.email}`}>
            <span className="dline__ic dline__ic--ml">
              <MailIcon />
            </span>
            <span>
              <strong>אימייל</strong>
              <span className="val">
                <bdi>{CONFIG.email}</bdi>
              </span>
            </span>
          </a>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
