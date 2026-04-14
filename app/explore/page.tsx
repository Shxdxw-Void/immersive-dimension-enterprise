import type { Metadata } from "next";
import HomeExperience from "../home-experience";

export const metadata: Metadata = {
  title: "Explore | Immersive Dimensions",
  description:
    "Enter the full Immersive Dimensions experience with the original interactive homepage.",
};

export default function ExplorePage() {
  return <HomeExperience />;
}
