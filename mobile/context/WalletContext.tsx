import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useWallet } from "@/hooks/useWallet";
import { Transaction } from "@/types/transaction";

type WalletSummary = {
  balance: number;
  needsBalance: number;
  wantsBalance: number;
  savingsBalance: number;
};

type WalletContextType = {
  transactions: Transaction[];
  summary: WalletSummary;
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  createExpense: (data: { amount: number; category: string; bucket?: "needs" | "wants" }) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const user_id = user?.id as string;

  const [loading, setLoading] = useState(false);

  const {
    transactions,
    summary,
    error,
    loadData,
    deleteTransaction,
    createExpense,
  } = useWallet(user_id);

  useEffect(() => {
    if (isLoaded && user_id) {
      setLoading(true);
      loadData().finally(() => setLoading(false));
    }
  }, [isLoaded, user_id, loadData]);

  return (
    <WalletContext.Provider
      value={{
        transactions,
        summary,
        loading,
        error,
        loadData,
        deleteTransaction,
        createExpense,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used within a WalletProvider");
  return ctx;
};
