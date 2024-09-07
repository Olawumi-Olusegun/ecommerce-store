import React, { useEffect } from 'react'
import CategoryItem from '../components/CategoryItem';
import { useQuery } from '@tanstack/react-query';
import api from '../api';
import useProductStore from '../stores/useProductStore';
import FeaturedProducts from '../components/FeaturedProducts';
import { Loader2 } from 'lucide-react';


const categories = [
	{ id: "0", href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ id: "1",  href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ id: "2",  href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ id: "3",  href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ id: "4",  href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ id: "5",  href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ id: "6",  href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
];

const Home = () => {

  const fetchFeaturedProducts = useProductStore((state) => state.fetchFeaturedProducts)

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch-featured-products"],
    queryFn: api.fetchFeaturedProducts,
  });

  useEffect(() => {
    if(data && data?.products) {
      fetchFeaturedProducts(data?.featuredProucts)
    }
  }, [data?.featuredProucts])


  return (
    <div className='reative min-h-dvh text-white overflow-hidden'>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className=' text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
          Explore Our Categories
        </h2>

        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {
            categories.map((category) => <CategoryItem key={category.id} category={category} />)
          }
        </div>

          {isLoading && <Loader2 className='animate-spin text-white text-center ' size={30} /> }
          { data && data?.featuredProucts?.length > 0 && <FeaturedProducts featuredProducts={data?.featuredProucts} /> }

      </div>
    </div>
  )
}

export default Home