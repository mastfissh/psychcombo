import combos from "shared/combos.json";
import risks from "shared/risks.json";
import psychoactives from "shared/psychoactives.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const cachedPsychs = async () => psychoactives;
export const cachedRisks = async () => risks;
export const cachedCombos = async () => combos;

export async function gridState(): Promise<string[]> {
  const raw = await AsyncStorage.getItem("chosenPsychs");
  if (raw) {
    return JSON.parse(raw) as string[];
  }
  return ["alcohol", "cannabis-species", "cocaine", "ketamine"];
}

export async function saveGridState(state: string[]): Promise<void> {
  await AsyncStorage.setItem("chosenPsychs", JSON.stringify(state));
}
