import type { DayData } from "../types";
import { myDay } from "../mock/data";

export async function fetchMyDay() {
  return Promise.resolve(myDay as DayData);
}
