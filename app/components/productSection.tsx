"use client"

import React, { useEffect } from 'react'
import ProductList from './ProductList'
import productApi from '../_utils/productApis'
import { useState } from 'react'

function ProductSection() {
    const [products, setProducts] = useState([])
    useEffect(() => {
        getLatestProducts()
    }, [])

    const getLatestProducts = () => {
        productApi.getLatestProducts().then((res) => {
            setProducts(res.data.data)
        })
    }

    return (
        <div>
            <ProductList productList={products}/>    
        </div>
    )
}

export default ProductSection