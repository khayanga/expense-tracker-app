import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState, useCallback } from "react";

const API_URL = "http://192.168.100.40:5000/api";

interface Income {
  id: number;
  title: string;
  amount: string;
  category: string;
}

interface Allocation {
  id: number;
  category: string;
  amount: string;
  title: string;
  parent_id: number;
}

export const useAllocations = (userId?: string) => {
 const [income, setIncome] = useState<Income | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const{setLoading} = useLoading()
  const [error, setError] = useState<string | null>(null);

  const fetchAllocations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/transactions/allocations/latest/${userId}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch allocations");

      setIncome(data.data.income || null);
      setAllocations(data.data.allocations || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return { income, allocations, error, fetchAllocations };
};


