// types/transaction.ts
export type TransactionCategory =
  | "Food & Drinks"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills"
  | "Income"
  | "Other";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  category: TransactionCategory;
  user_id: string;
  created_at?: string;
};
