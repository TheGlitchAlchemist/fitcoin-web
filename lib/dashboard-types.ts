export type RedemptionStatus = "pending" | "used" | "expired" | "cancelled";

export type Offer = {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  fitcoin_price: number;
  stock_total: number;
  stock_available: number;
  active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Redemption = {
  id: string;
  user_id: string;
  business_id: string;
  offer_id: string;
  transaction_id: string | null;
  redemption_code: string;
  qr_token_hash: string | null;
  status: RedemptionStatus;
  fitcoin_price_at_purchase: number;
  expires_at: string | null;
  used_at: string | null;
  used_by: string | null;
  created_at: string;
};