"use client"

import Image from "next/image";
import ProductSection from "./components/productSection";
import Header from "./components/Header";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <ProductSection />
    </div>
  );
}
