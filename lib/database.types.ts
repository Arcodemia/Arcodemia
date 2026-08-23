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
export type LeadRow = {
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
export type LeadInsert = {
  name: string;
  phone: string;
  business?: string | null;
  message?: string | null;
  contact_method: ContactMethod;
  status?: LeadStatus;
  source?: string;
}

export type PortfolioItemRow = {
  id: string;
  created_at: string;
  title: string;
  image_url: string | null;
  project_url: string | null;
  sort_order: number;
  published: boolean;
}

export type PortfolioItemInsert = {
  title: string;
  image_url?: string | null;
  project_url?: string | null;
  sort_order?: number;
  published?: boolean;
}

export type RateLimitRow = {
  ip: string;
  window_start: string;
  count: number;
  last_request_at: string;
}

export type RateLimitInsert = {
  ip: string;
  window_start?: string;
  count?: number;
  last_request_at?: string;
}

/* ⚠️ כל הטיפוסים כאן הם type ולא interface, בכוונה.
   postgrest-js דורש שה-schema יתאים ל-Record<string, ...>, ו-interface
   בלי index signature לא מקיים את זה. התוצאה היא נפילה שקטה ל-never
   ושגיאה מטעה: "LeadInsert is not assignable to never[]".
   זה נכון גם לטיפוסי השורות עצמם — GenericTable דורש
   Row/Insert/Update מסוג Record<string, unknown>. */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: LeadInsert;
        Update: Partial<LeadInsert>;
        /* נדרש על ידי postgrest-js. אין מפתחות זרים בסכמה. */
        Relationships: [];
      };
      portfolio_items: {
        Row: PortfolioItemRow;
        Insert: PortfolioItemInsert;
        Update: Partial<PortfolioItemInsert>;
        Relationships: [];
      };
      rate_limits: {
        Row: RateLimitRow;
        Insert: RateLimitInsert;
        Update: Partial<RateLimitInsert>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      consume_rate_limit: {
        Args: { p_ip: string };
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
