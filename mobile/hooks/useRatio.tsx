import { useLoading } from "@/context/LoadingContext";
import { Ratio } from "@/types/ratio";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

const API_URL = "http://192.168.100.40:5000/api";


export const useRatio = (user_id: string) => {
  const [ratio, setRatio] = useState<Ratio | null>(null);
  const {setLoading} = useLoading()
  const [error, setError] = useState<string | null>(null);

  const fetchRatio = useCallback(async () => {
    if (!user_id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/ratio/${user_id}`);
      const data = await res.json();

      if (!data.success || !data.data) {
        setRatio(null);
        return;
      }

      setRatio(data.data);
    } catch (error) {
      console.error("Fetch ratio error:", error);
      setError("Failed to fetch ratio");
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  const createRatio = useCallback(
    async (newRatio: Omit<Ratio, "id">) => {
      try {
        if (
          !newRatio.needs_percent ||
          !newRatio.wants_percent ||
          !newRatio.savings_percent
        ) {
          Alert.alert("Error", "Please fill in all fields");
          return;
        }

        const total =
          newRatio.needs_percent +
          newRatio.wants_percent +
          newRatio.savings_percent;

        if (total !== 100) {
          Alert.alert("Error", "Total percentage must equal 100");
          return;
        }

        if (!user_id) {
          Alert.alert("Error", "User not logged in");
          return;
        }

        const res = await fetch(`${API_URL}/ratio`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id,
            needsPercent: newRatio.needs_percent,
            wantsPercent: newRatio.wants_percent,
            savingsPercent: newRatio.savings_percent,
          }),
        });

        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to create ratio");

        setRatio(data.data);
        Alert.alert("Success", "Ratio created successfully");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to create ratio");
      }
    },
    [user_id]
  );

  const updateRatio = useCallback(
    async (updatedRatio: {
      needs_percent: number;
      wants_percent: number;
      savings_percent: number;
      
    }) => {
      try {
        const total =
          updatedRatio.needs_percent +
          updatedRatio.wants_percent +
          updatedRatio.savings_percent;

        if (total !== 100) {
          Alert.alert("Error", "Total percentage must equal 100");
          return;
        }

        setLoading(true);

        const res = await fetch(`${API_URL}/ratio/${user_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            needsPercent: updatedRatio.needs_percent,
            wantsPercent: updatedRatio.wants_percent,
            savingsPercent: updatedRatio.savings_percent,
            
          }),
        });

        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Failed to update ratio");

        setRatio(data.data.updatedRatio || data.data);
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

  return { ratio, fetchRatio, createRatio, updateRatio, error };
};
