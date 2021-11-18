import create from "zustand";
import { sampleText } from "./utils";

// slice to hold global params
const themeSlice = (set) => ({
  primaryColor: "#D40749",
  secondaryColor: "#2FE8C3",
  primaryBright: "#FF005A",
  secondaryBright: "#2FE8C3",
  marginX: 0.1,
  marginY: 0.05
});
// slice to hold global params
const paramSlice = (set) => ({
  maxZ: 16,
  mobileWidth: 1200,
  baseSeed: 311
});
// slice to hold scroll information
const scrollSlice = (set, get) => ({
  sections: [],
  breakpoints: [],
  numSections: 8,
  scrollPosition: 0,
  maxScroll: 0,
  applyScrollDelta: (delta) => {
    set({
      scrollPosition: Math.min(
        Math.max(get().scrollPosition + delta, 0),
        get().maxScroll
      )
    });
  }
});

const useStore = create((set, get) => ({
  ...themeSlice(set),
  ...paramSlice(set),
  ...scrollSlice(set, get)
}));

export { useStore };
