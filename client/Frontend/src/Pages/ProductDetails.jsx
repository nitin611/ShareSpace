import React, { useState, useEffect } from 'react';
import Structure from '../Components/structure/Structure';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});

    // Fetch product on initial render
    useEffect(() => {
        if (params?.id) getProduct();
    }, [params?.id]);

    // Function to fetch product data
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/api/product/get-product/${params.id}`);
            setProduct(data?.product);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Structure>
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-semibold mb-6">Product Details</h1>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                    {JSON.stringify(product, null, 4)}
                </pre>
            </div>
        </Structure>
    );
};

export default ProductDetails;
