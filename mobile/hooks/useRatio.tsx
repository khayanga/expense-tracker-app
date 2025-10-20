import { Ratio } from "@/types/ratio";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
const API_URL = "http://192.168.100.40:5000/api";

export const useRatio = (user_id: string) => {
  const [ratio, setRatio] = useState<Ratio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatio = useCallback(async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/ratio/${user_id}`);
      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to fetch ratio");
      setRatio(data.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch ratio");
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  const updateRatio = useCallback(
    async (updatedRatio: {
      needs_percent: number;
      wants_percent: number;
      savings_percent: number;
      transactionId?: number
    }) => {
      try {
        setLoading(true);
        const total =
          updatedRatio.needs_percent +
          updatedRatio.wants_percent +
          updatedRatio.savings_percent;

        if (total !== 100) {
          Alert.alert("Error", "Total percentage must equal 100");
          return;
        }

        const response = await fetch(`${API_URL}/ratio/${user_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            needsPercent: updatedRatio.needs_percent,
            wantsPercent: updatedRatio.wants_percent,
            savingsPercent: updatedRatio.savings_percent,
            transactionId: updatedRatio.transactionId,
          }),
        });

        const data = await response.json();
        console.log("Update Ratio Response:", data);
        if (!data.success)
          throw new Error(data.message || "Failed to update ratio");

        setRatio(data.data.updatedRatio);
        Alert.alert("Success", "Ratio updated successfully");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to update ratio");
      } finally {
        setLoading(false);
      }
    },
    [user_id]
  );

  useEffect(() => {
    fetchRatio();
  }, [fetchRatio]);

  return { ratio, fetchRatio, updateRatio, loading, error };
};
