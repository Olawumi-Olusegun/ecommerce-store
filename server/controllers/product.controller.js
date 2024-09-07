import ProductModel from "../models/product.model.js"
import cloudinary from "../utils/cloudinary.js";
import { redis } from "../utils/redis.js";

const updatedFeaturedCatch = async () => {

    try {
        const featuredProducts = await ProductModel.find({ isFeatured: true });
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log(`[UPDATED_FEATURED_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}


export const createNewProduct = async (req, res) => {

    const { name, description, price, image, category } = req.body;

    try {

        let cloudinaryResponse = null;

        if(image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {
                folder: "products",
                transformation:{
                    width: 500,
                    height: 500,
                    crop: "auto",
                    gravity: "auto",
                }
            })
        }

        const newProduct = new ProductModel({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "", 
            category
        });

        const product = await newProduct.save();

        if(!product) {
            return res.status(400).json({ success: false, message: "Product not created"})
        }

        return res.status(201).json({ product, success: true, message: "Product created successfully"})
    } catch (error) {
        console.log(`[GET_ALL_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        return res.status(200).json({ products, success: true, message: "All products"})
    } catch (error) {
        console.log(`[GET_ALL_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const featuredProducts = async (req, res) => {
    try {

        let featuredProducts = await redis.get("featured_products");

        if(featuredProducts) {
            return res.status(200).json({
                featuredProucts: JSON.parse(featuredProducts),
                success: true,
                message: "Featured products"
            });
        }

        featuredProducts = await ProductModel.find({isFeatured: true}).lean();

        if(!featuredProducts) {
            return res.status(404).json({ success: false, message: "No featured products found" })  
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        return res.status(200).json({ products, success: true, message: "All products"})
    } catch (error) {
        console.log(`[FEATURED_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const recommendedProducts = async (req, res) => {
    try {
        const products = await ProductModel.aggregate([
            {
                $sample: { size: 6 },
            }, 
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                    isFeatured: 1
                }
            }
        ]);

        if(!products) {
            return res.status(404).json({ success: false, message: "Products not found"})
        }

        return res.status(200).json({ products, success: true, message: "All recommended products"})

    } catch (error) {
        console.log(`[RECOMMENDED_PRODUCTS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await ProductModel.find({category});

        if(!products) {
            return res.status(404).json({ success: false, message: "Product not found"})
        }

        return res.status(200).json({products, success: true, message: "Products by category"});

    } catch (error) {
        console.log(`[PRODUCT_BY_CATEGORY]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    const { productId } = req.params;
    try {

        const product = await ProductModel.findById(productId);

        if(!product) {
            return res.status(404).json({ success: false, message: "Product not found"})
        }

        product.isFeatured = !product.isFeatured;
        
        const updatedProduct = await product.save();

        await updatedFeaturedCatch();

        return res.status(200).json({product: updatedProduct, success: true, message: "Products by category"});

    } catch (error) {
        console.log(`[PRODUCT_BY_CATEGORY]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await ProductModel.findById(productId);

        if(!product) {
            return res.status(404).json({ success: false, message: "Product not found"})
        }

        if(product?.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
            } catch (error) {
                console.log(`[DELETE_PRODUCT_IMAGE]: ${error}`)
            }
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if(!deletedProduct) {
            return res.status(400).json({ success: false, message: "Unable to delete product"})
        }

        return res.status(200).json({ success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.log(`[DELETE_PRODUCT]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" })
    }
}