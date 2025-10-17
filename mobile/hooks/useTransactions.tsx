import { Transaction } from "@/types/transaction";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
const API_URL = "http://192.168.100.40:5000/api";

export const useTransactions = (user_id: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    income: 0,
    balance: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/user/${user_id}`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch transactions");
      setTransactions(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    }
  }, [user_id]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/transactions/summary/${user_id}`
      );
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch summary");
      setSummary(data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch summary");
    }
  }, [user_id]);

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
  }, [user_id, fetchTransactions, fetchSummary]);

  const deleteTransaction = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(`${API_URL}/transactions/id/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!data.success)
          throw new Error(data.message || "Failed to delete transaction");
        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (err) {
        console.error("Error deleting transaction:", err);
        Alert.alert("Error", "Failed to delete transaction");
      }
    },
    [loadData]
  );

  const createTransaction = useCallback(
    async (transaction: Omit<Transaction, "id">) => {
      if (!transaction.title || !transaction.amount || !transaction.category ||!transaction.type) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...transaction, user_id }),
        });
        const data = await response.json();
        if (!data.success)
          throw new Error(data.message || "Failed to create transaction");
        await loadData();
        Alert.alert("Success", "Transaction created successfully");
      } catch (err) {
        console.error("Error creating transaction:", err);
        Alert.alert("Error", "Failed to create transaction");
      }
    },
    [loadData, user_id]
  );

  return {
    transactions,
    summary,
    loading,
    error,
    loadData,
    deleteTransaction,
    createTransaction,
  };
};
