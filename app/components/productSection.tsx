"use client";

import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import productApi from "../_utils/productApis";

function ProductSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getLatestProducts();
  }, []);

  const getLatestProducts = async () => {
    try {
      const res = await productApi.getLatestProducts();
      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  return (
    <div>
      <ProductList productList={products} />
    </div>
  );
}

export default ProductSection;
