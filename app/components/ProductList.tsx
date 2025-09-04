import React from "react";


import ProductItem from "./ProductItem";




type Product = { id: number | string; [key: string]: unknown };





function ProductList({ productList }: { productList: Product[] }) {


  return (


    <div>


      {productList.map((product) => (


        <ProductItem product={product} key={product.id} />


      ))}


    </div>


  );

}




export default ProductList;