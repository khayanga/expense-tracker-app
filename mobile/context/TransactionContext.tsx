import React, { createContext, useContext, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types/transaction";

type TransactionContextType = {
  transactions: Transaction[];
  summary: {
    income: number;
    balance: number;
    expenses: number;
  };
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  createTransaction: (data: Omit<Transaction, "id">) => Promise<void>;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const user_id = user?.id as string;

  
  const {
    transactions,
    summary,
    loading,
    error,
    loadData,
    deleteTransaction,
    createTransaction,
  } = useTransactions(user_id);

   useEffect(() => {
    if (isLoaded && user_id) {
    //   console.log("🔄 Fetching transactions for user:", user_id);
      loadData();
    }
  }, [isLoaded, user_id, loadData]); 

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        error,
        loadData,
        deleteTransaction,
        createTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactionContext must be used within a TransactionProvider");
  return ctx;
};
