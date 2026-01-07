import React, { createContext, useContext, useState, ReactNode } from "react";
import { OnboardingData } from "../models/user";

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  resetData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

const initialData: OnboardingData = {
  name: "",
  dateOfBirth: null,
  gender: "",
  photos: [],
  location: {
    city: "",
    coordinates: null,
  },
  preferences: {
    lookingFor: "",
    ageRange: { min: 18, max: 50 },
    distanceRadius: 50,
  },
  bio: "",
  interests: [],
  height: undefined,
  education: "",
  occupation: "",
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => {
    setData(initialData);
    setCurrentStep(1);
  };

  return (
    <OnboardingContext.Provider
      value={{ data, updateData, resetData, currentStep, setCurrentStep }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
