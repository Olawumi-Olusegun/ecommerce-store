import React from 'react'
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react"
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';



const Signup = () => {


  const { register, handleSubmit, reset, formState: { errors },  } = useForm();

  const { signupMutation } = useAuth();
  
	if(signupMutation.isSuccess) {
		reset()
	}


  const onSubmit = (data) => {
    if(signupMutation.isPending) return;
    signupMutation.mutate(data);
  }

  return (
    <div className='flex flex-col justify-center py-12 px-5 lg:px-8 max-w-xl mx-auto'>
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      >
        <h2 className='my-6 text-center text-3xl font-extrabold text-emerald-400'>Create New Account</h2>
      </motion.div>

      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                  Full name
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  </div>
                  <input
                    id='name'
                    type='text'
                    required
                    {...register("name", { required: "Fullname field is required" } )}
                    className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                    placeholder='John Doe'
                  />
                </div>
            </div>
						
            <div>
							<label htmlFor='email' className='block text-sm font-medium text-gray-300'>
								Email address
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='email'
									type='email'
									required
                  {...register("email", { required: "Email field is required" } )}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 
									 focus:border-emerald-500 sm:text-sm'
									placeholder='you@example.com'
								/>
							</div>
						</div>

						<div>
							<label htmlFor='password' className='block text-sm font-medium text-gray-300'>
								Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='password'
									type='password'
									required
                  {...register("password", { required: "Password field is required" } )}
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 
									rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>
    
            <div>
							<label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
								Confirm Password
							</label>
							<div className='mt-1 relative rounded-md shadow-sm'>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
								</div>
								<input
									id='confirmPassword'
									type='password'
									required
									className=' block w-full px-3 py-2 pl-10 bg-gray-700 border
									 border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
									placeholder='••••••••'
								/>
							</div>
						</div>


            <button
							type='submit'
							className='w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600
							 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={signupMutation.isPending}
						>
							{signupMutation.isPending ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign up
								</>
							)}
						</button>

          </form>

					<p className='flex items-center justify-center gap-2 mt-8 text-center text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to='/signin' className='group flex items-center font-medium text-emerald-400 hover:text-emerald-300'>
							Signin here <ArrowRight className='inline h-4 w-4 group-hover:translate-x-1 duration-300' />
						</Link>
					</p>

        </div>
      </motion.div>

    </div>
  )
}

export default Signup