import { create } from 'zustand'


const useProductStore = create((set) => ({
    products: [],
    featuredProducts: [],
    isLoading: false,
    setProducts: (products) => set({products}),
    createProduct: (productData) => {
        set((prevState) => ({
            products: [...prevState.products, productData],
        }))
    },
    toggleFeaturedProduct: (featured) => {
        set((prevState) => ({
            products: prevState.products.map((product) => product._id === featured._id ? {...product, isFeatured: featured.isFeatured} : product)
        }))
    },
    deleteProduct: (productId) => {
        set((prevState) => ({
            products: prevState.products.filter((product) => product._id !== productId)
        }))
    },

    setFeaturedProducts: (products) => {
        set({ featuredProducts: products })
    },
}))

export default useProductStore