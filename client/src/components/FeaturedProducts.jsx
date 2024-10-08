import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useProduct from '../hooks/useProduct';

const FeaturedProducts = ({featuredProducts}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

	const navigate = useNavigate();

	const authUser = useUserStore((state) => state.user);

	const { addToCartMutation, setProduct } = useProduct();

    useEffect(() => {
        const handleWindowResize = () => {
            if(window.innerWidth < 640) setItemsPerPage(1);
            else if(window.innerWidth < 1024) setItemsPerPage(2);
            else if(window.innerWidth < 1280) setItemsPerPage(3);
            else setItemsPerPage(4);
        }

        handleWindowResize();

        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
    }

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
    }

    const isStartDisabled = currentIndex === 0; 
    const isEndDisabled = currentIndex >= featuredProducts?.length - itemsPerPage; 


	const handleAddToCart = (product) => {

		if(!authUser && !authUser?._id) {
			toast.error("Please login");
			navigate("/signin", {state: {}})
			return;
		}

		setProduct(product)
		addToCartMutation.mutate(product)
	
	
	}

  return (
<div className='py-12'>
			<div className='container mx-auto px-4'>
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4 py-10'>Featured</h2>
				<div className='relative'>
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'>
									<div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
										<div className='overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full pointer-events-none h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
											/>
										</div>
										<div className='p-4 flex flex-col mt-auto'>
											<h3 className='text-lg font-semibold mb-2 text-white min-h-20 line-clamp-3 '>{product.name}</h3>
											<p className='text-emerald-300 font-medium mb-4'>
												${product.price.toFixed(2)}
											</p>
											<button
												onClick={() => handleAddToCart(product)}
												className='w-full self-end mt-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
  )
}

export default FeaturedProducts