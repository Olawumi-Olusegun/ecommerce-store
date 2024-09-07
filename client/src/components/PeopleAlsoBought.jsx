import React from 'react'
import ProductCard from "./../components/ProductCard"
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from "./../components/LoadingSpinner";
import api from '../api';


const PeopleAlsoBought = () => {

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch-recommendations"],
    queryFn: api.fetchRecommendedProducts,
  });

  
  if(isLoading) {
    return <LoadingSpinner />
  }

const recommendations = data?.products;

  return (
		<div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{recommendations?.length && recommendations?.map((product) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
		</div>
  )
}

export default PeopleAlsoBought