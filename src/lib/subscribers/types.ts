export type LaunchSubscriber = {
  id: string;
  email: string;
  discount_code: string;
  discount_percent: number;
  locale: string;
  created_at: string;
};

export type SubscribeResult =
  | { ok: true; discountCode: string; discountPercent: number; existing?: boolean }
  | { ok: false; error: string };
