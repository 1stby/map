import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const usePlanStore = create((set) => ({
  plans: [],
  currentPlan: {
    id: uuidv4(),
    name: "",
    locations: [],
    date: "",
    cost: "",
    notes: "",
    category: "",
  },
  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  updateCurrentPlan: (updates) =>
    set((state) => {
      // console.log("updateCurrentPlan called with:", updates);
      // console.log("Previous state:", state.currentPlan);
      const newPlan = { ...state.currentPlan, ...updates };
      // console.log("New state:", newPlan);
      return { currentPlan: newPlan };
    }),
  addLocation: (location) =>
    set((state) => ({
      currentPlan: {
        ...state.currentPlan,
        locations: [
          ...state.currentPlan.locations,
          { id: uuidv4(), ...location },
        ],
      },
    })),
  rmLocation: (id) =>
    set((state) => ({
      currentPlan: {
        ...state.currentPlan,
        locations: state.currentPlan.locations.filter(
          (location) => location.id !== id
        ),
      },
    })),
  savePlan: () =>
    set((state) => {
      const updatedPlans = [...state.plans, state.currentPlan];
      console.log("All saved plans:", updatedPlans);
      return {
        plans: updatedPlans,
        currentPlan: {
          id: uuidv4(),
          name: "",
          locations: [],
          date: "",
          cost: "",
          notes: "",
          category: "",
        },
      };
    }),
}));

export default usePlanStore;
