import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the structure for conversion history
type Conversion = {
  from: string;
  to: string;
  amount: number;
  result: number;
  date: string;
};

type CurrencyConverterState = {
  history: Conversion[]; // Array of conversions
  addConversion: (conversion: Conversion) => void; // Function to add a conversion
  clearHistory: () => void; // Function to clear the conversion history
};
export const useCurrencyConverterStore = create<CurrencyConverterState>()(
  persist(
    (set, _) => ({
      history: [],
      addConversion: (conversion) => {
        console.log("Adding conversion:", conversion); // Debug log
        set((state) => ({
          history: [...state.history, conversion],
        }));
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "currency-conversion-history", // Key in localStorage
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
      onRehydrateStorage: (state) => {
        console.log("Store rehydrated with state:", state); // Debug log
      },
    }
  )
);
