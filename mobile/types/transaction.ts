// types/transaction.ts
export type TransactionCategory =
  | "Food & Drinks"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills"
  | "Salary"
  | "Other";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type:string;
  category: TransactionCategory;
  user_id: string;
  created_at?: string;
};


