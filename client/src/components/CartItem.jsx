import React from 'react'
import { Minus, Plus, Trash } from 'lucide-react'
import useCart from '../hooks/useCart';

const CartItem = ({item}) => {

const { deleteMutation, updateMutation, setCartQuantity, setItem } = useCart();

    const handleRemoveFromCart = () => {
        if(deleteMutation.isPending) return;
		setItem(item)
        deleteMutation.mutate(item)
    }

    const handleUpdateCart = (quantity) => {
        if(updateMutation.isPending) return;
        setCartQuantity(quantity)
		setItem(item)
        updateMutation.mutate({item, quantity});
    }

  return (
        <div className='relative rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>

                <div className='shrink-0 md:order-1'>
					<img className='h-20 md:h-32 rounded object-cover pointer-events-none' src={item.image} />
				</div>
				<label className='sr-only'>Choose quantity:</label>

				<div className='flex md:flex-col  items-center self-stretch justify-between md:order-3 md:justify-end'>

                    <div className='text-start md:w-32'>
						<p className='text-base text-start font-bold text-emerald-400'>${item.price}</p>
					</div>

                    <div className='flex self-start items-center gap-2 h-full'>
						<button
							className='inline-flex h-8 w-8 p-1 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 duration-300 focus:outline-none focus:ring-2
							  focus:ring-emerald-500'
							onClick={() => handleUpdateCart(item.quantity - 1)}
						>
							<Minus className='text-gray-300' />
						</button>
						<p className='p-1.5'>{item.quantity}</p>
						<button
							className='inline-flex h-8 w-8 p-1 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 duration-300 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500'
							onClick={() => handleUpdateCart(item.quantity + 1)}
						>
							<Plus className='text-gray-300' />
						</button>
					</div>

				</div>

				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					<p className='text-base font-medium line-clamp-2 text-white hover:text-emerald-400 hover:underline'>
						{item.name}
					</p>
					<p className='text-sm text-gray-400 line-clamp-4'>{item.description}</p>

					<div className='flex items-center gap-4 absolute top-0 right-3 '>
						<button
							className='inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline transition-all duration-300 hover:bg-white/10 p-2 rounded-md'
							onClick={handleRemoveFromCart}
						>
							<Trash size={22} />
						</button>
					</div>
				</div>

			</div>
		</div>
  )
}

export default CartItem