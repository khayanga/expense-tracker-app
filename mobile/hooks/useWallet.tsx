import { useLoading } from "@/context/LoadingContext";
import { Transaction } from "@/types/transaction";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://192.168.100.40:5000/api";

export const useWallet = (user_id: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    balance: 0,
    needsBalance: 0,
    wantsBalance: 0,
    savingsBalance: 0,
  });

  const { setLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  /** Fetch all transactions */
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/user/${user_id}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch transactions");
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    }
  }, [user_id]);

  /** Fetch wallet summary */
  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/wallet/summary/${user_id}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.message || "Failed to fetch summary");

      setSummary({
        balance: data.data.balance,
        needsBalance: data.data.needsBalance,
        wantsBalance: data.data.wantsBalance,
        savingsBalance: data.data.savingsBalance,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch summary");
    }
  }, [user_id]);

  /** Load all wallet data */
  const loadData = useCallback(async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user_id, fetchTransactions, fetchSummary, setLoading]);

  /** Delete a transaction */
  const deleteTransaction = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/wallet/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || "Failed to delete transaction");
        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (err) {
        console.error("Error deleting transaction:", err);
        Alert.alert("Error", "Failed to delete transaction");
      } finally {
        setLoading(false);
      }
    },
    [loadData, setLoading]
  );

  /** Create an expense */
  const createExpense = useCallback(
    async (transaction: { amount: number; category: string; bucket?: "needs" | "wants" }) => {
      if (!transaction.amount || !transaction.category) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/wallet/expense`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...transaction, user_id }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || "Failed to create expense");

        await loadData();
        Alert.alert("Success", "Expense created successfully");
      } catch (err) {
        console.error("Error creating expense:", err);
        Alert.alert("Error", "Failed to create expense");
      } finally {
        setLoading(false);
      }
    },
    [user_id, loadData, setLoading]
  );

  return {
    transactions,
    summary,
    error,
    loadData,
    deleteTransaction,
    createExpense,
  };
};
