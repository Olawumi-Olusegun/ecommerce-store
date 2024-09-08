import { useMutation, useQuery } from "@tanstack/react-query";
import useProductStore from "../stores/useProductStore";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import api from "../api";
import useCartStore from "../stores/useCartStore";


const useProduct = (category = "") => {

  const [product, setProduct] = useState(null);

    const setProducts = useProductStore((state) => state.setProducts);
    const setFeaturedProducts = useProductStore((state) => state.setFeaturedProducts);
    const products = useProductStore((state) => state.products);

    const user = useUserStore((state) => state.user);

    const isAdmin = user && user?.role === "admin" ? true : false;
    const userId = user?._id;

    const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
        queryKey: ["fetch-analytics-data"],
        queryFn: api.fetchAnalyticsData,
        enabled: !!userId,
        retry: false
      });
   
   const { data, isLoading,  } =  useQuery({
        queryKey: ["fetch-products-category", category],
        queryFn: () => api.fetchProductsByCategory(category),
        enabled: !!category,
    });

  

    const addToCart = useCartStore((state) => state.addToCart);
  
    const addToCartMutation =  useMutation({
      mutationKey: ["add-to-cart"],
      mutationFn: api.addToCart,
  
      onSuccess: () => {
        if(product) {
          addToCart(product)
        }
      }, 
      onError: (error) => {
        const message = error?.response?.data?.message ?? error?.message;
        toast.error(message, { id: "add-to-cart" });
      }
    })
  

    const { data: allProducts, isLoading: isProductsLoading, error: allProductsError } = useQuery({
        queryKey: ["fetch-all-products"],
        queryFn: api.fetchAllProducts,
        enabled: !!userId,
        retry: false
      });

      useEffect(() => {
        if(data && allProducts?.products) {
            setProducts(data?.products)
        }
      }, [allProducts?.products])

    
  const { data: featuredData, isLoading: isFeaturedProductLoading, error } = useQuery({
    queryKey: ["fetch-featured-products"],
    queryFn: api.fetchFeaturedProducts,
  });

  useEffect(() => {
    if(featuredData && featuredData?.featuredProucts) {
      setFeaturedProducts(featuredData?.featuredProucts)
    }
  }, [featuredData?.featuredProucts, setProducts])

    useEffect(() => {
      if(data && data?.products) {
        setProducts(data?.products)
      }
    }, [category, data?.products]);

    return  {
        products,
        isLoading,
        featuredProducts: featuredData?.featuredProucts,
        isFeaturedProductLoading,
        allProducts: allProducts?.products,
        isProductsLoading,
        allProductsError,
        analyticsData,
        isLoadingAnalytics,
        setProduct,
        addToCartMutation
    }
}

export default useProduct;