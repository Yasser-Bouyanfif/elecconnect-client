import React from 'react'
import ProductItem from './ProductItem'

function ProductList({productList}: {productList: any}) {
    return (
        <div>
            {productList.map((product: any) => (
                <ProductItem product={product} key={product.id}/>
            ))}
        </div>
    )
}

export default ProductList