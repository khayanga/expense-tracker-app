// types/transaction.ts
export type TransactionCategory =
  | "Food & Drinks"
  | "Shopping"
  | "Transportation"
  | "Entertainment"
  | "Bills"
  | "Salary"
  | "Other";


export type WalletBucket = "Needs" | "Wants" | "Savings";

export type Transaction = {
  id: number;
  title?: string;
  amount: number;
  type:string;
  category: TransactionCategory;
  user_id: string;
  bucket?: WalletBucket; 
  created_at?: string;
};


