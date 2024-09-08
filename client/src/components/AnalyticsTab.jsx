import React from 'react'
import LoadingSpinner from "./../components/LoadingSpinner"
import AnalyticsCard from './AnalyticsCard';
import { DollarSign, Package, ShoppingCart, User } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion"
import useProduct from '../hooks/useProduct';

const AnalyticsTab = () => {

const { analyticsData: data, isLoadingAnalytics: isLoading } = useProduct();

  if(isLoading) {
    return <LoadingSpinner />
  }


  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard 
        title={"Total User"}
        value={data?.analyticsData?.users?.toLocaleString()}
        icon={User}
        color={"from-emerald-500 to-teal-700"}
        />
        <AnalyticsCard 
        title={"Total Package"}
        value={data?.analyticsData?.products?.toLocaleString()}
        icon={Package}
        color={"from-emerald-500 to-green-700"}
        />
        <AnalyticsCard 
        title={"Total Sales"}
        value={data?.analyticsData?.totalSales?.toLocaleString()}
        icon={ShoppingCart}
        color={"from-emerald-500 to-cyan-700"}
        />
        <AnalyticsCard 
        title={"Total Revenue"}
        value={`$${data?.analyticsData?.totalRevenue?.toLocaleString()}`}
        icon={DollarSign}
        color={"from-emerald-500 to-cyan-700"}
        />
      </div>

      <motion.div
				className='bg-gray-800/60 rounded-lg p-6 shadow-lg'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.25 }}
			>
        	<ResponsiveContainer width='100%' height={400}>
					<LineChart data={data?.dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' stroke='#D1D5DB' />
						<YAxis yAxisId='left' stroke='#D1D5DB' />
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default AnalyticsTab