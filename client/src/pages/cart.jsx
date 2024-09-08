import React from 'react'
import EmptyCartUI from '../components/EmptyCartUI';
import { motion } from "framer-motion"
import CartItem from '../components/CartItem';
import PeopleAlsoBought from '../components/PeopleAlsoBought';
import OrderSummary from '../components/OrderSummary';
import GiftCouponCard from '../components/GiftCouponCard';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {

  const { isCartLoading, cart } = useCart();

  if(isCartLoading) {
	return <LoadingSpinner />
  }

  return (
    <div className='py-8 md:py-16'>
      <div className="max-w-screen-xl mx-auto px-4 2xl:px-0 ">
        <div className="mt-6 sm:t-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
       
			<motion.div
			className='mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl'
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			{cart.length === 0 ? (
				<EmptyCartUI />
			) : (
				<div className='space-y-6'>
					{cart.map((item) => <CartItem key={item._id} item={item} />)}
				</div>
			)}
			
			</motion.div>

          {cart.length > 0 && (
				<motion.div
					className='mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full'
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					<OrderSummary />
					<GiftCouponCard />
				</motion.div>
			)}

        </div>
       
      </div>

      <div className="max-w-screen-xl mx-auto px-4 2xl:px-0 py-10 ">
          {cart.length > 0 && <PeopleAlsoBought />}
      </div>
    </div>
  )
}

export default Cart