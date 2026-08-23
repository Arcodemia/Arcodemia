/* ============================================================
   טיפוסי מסד הנתונים
   ------------------------------------------------------------
   נכתבים ביד ותואמים ל-supabase/migrations/. אפשר לייצר אותם
   אוטומטית אחרי שהפרויקט מקושר:
     npx supabase gen types typescript --linked > lib/database.types.ts
   ============================================================ */

export type ContactMethod = 'email' | 'whatsapp';
export type LeadStatus = 'new' | 'contacted' | 'closed';

/** שורה בטבלת leads כפי שהיא חוזרת מ-select */
export interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  business: string | null;
  message: string | null;
  contact_method: ContactMethod;
  status: LeadStatus;
  source: string;
}

/** מה שמותר לשלוח ב-insert. שאר השדות מקבלים default במסד. */
export interface LeadInsert {
  name: string;
  phone: string;
  business?: string | null;
  message?: string | null;
  contact_method: ContactMethod;
  status?: LeadStatus;
  source?: string;
}

export interface PortfolioItemRow {
  id: string;
  created_at: string;
  title: string;
  image_url: string | null;
  project_url: string | null;
  sort_order: number;
  published: boolean;
}

export interface PortfolioItemInsert {
  title: string;
  image_url?: string | null;
  project_url?: string | null;
  sort_order?: number;
  published?: boolean;
}

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
      };
      portfolio_items: {
        Row: PortfolioItemRow;
        Insert: PortfolioItemInsert;
        Update: Partial<PortfolioItemInsert>;
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
  };
}
