"use client"

import { createContext } from "react";

export type CartItem = {
  id: string | number;
  title?: string;
  price?: number;
  qty?: number;
  image?: string;
};

export type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);
