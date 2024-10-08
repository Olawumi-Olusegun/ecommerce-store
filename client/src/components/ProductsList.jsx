import React, { useState } from 'react'
import useProductStore from '../stores/useProductStore';
import { Star, Trash } from 'lucide-react';
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import api from '../api';
import toast from 'react-hot-toast';
import useProduct from '../hooks/useProduct';


const ProductsList = () => {
const [itemId, setItemId] = useState('')
//   const products = useProductStore((state) => state.products);
const { allProducts } = useProduct();
  const toggleFeaturedProduct = useProductStore((state) => state.toggleFeaturedProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);

  const mutation = useMutation({
    mutationKey: ["toggle-featured"],
    mutationFn: api.toggleFeaturedProduct,
	onSuccess: (data) => {
		if(data && data?.product) {
			toggleFeaturedProduct(data?.product)
		}
	},
	onError: (error) => {
		const message = error?.response?.data?.message ?? error?.message;
		toast.error(message, {id: "toggle-featured"});
	},
  })

  const deleteMutation = useMutation({
	mutationKey: ["delete-product"],
	mutationFn: api.deleteProduct,
	onSuccess: () => {
		deleteProduct(itemId)
	},
	onError: (error) => {
		const message = error?.response?.data?.message ?? error?.message;
		toast.error(message, {id: "delete-product"});
	},
  })


  const handleToggleFeatured = (productId) => {
	mutation.mutate(productId);
  }

  const handleDeleteProduct = (productId) => {
	setItemId(productId)
	deleteMutation.mutate(productId)
  }

  return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg w-full md:max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Price
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{allProducts?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-md object-cover pointer-events-none'
											src={product.image}
											alt={product.name}
											title={product.name}
										/>
									</div>
									{/* <div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div> */}
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.category}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => handleToggleFeatured(product?._id)}
									className={`p-1 rounded-full ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => handleDeleteProduct(product._id)}
									className='text-red-400 hover:text-red-300 bg-white/20 hover:bg-white/30 p-1.5 rounded-md transition-all duration-300'
								>
									<Trash size={18} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
  )
}

export default ProductsList