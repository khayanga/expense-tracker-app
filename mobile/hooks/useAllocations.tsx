import { useEffect, useState, useCallback } from "react";

const API_URL = "http://192.168.100.40:5000/api";

export const useAllocations = (transactionId?: number) => {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocations = useCallback(async () => {
    if (!transactionId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/transactions/allocations/${transactionId}`);
      const data = await response.json();

      if (!data.success) throw new Error(data.message || "Failed to fetch allocations");
      setAllocations(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch allocations");
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  return { allocations, loading, error, fetchAllocations };
};

