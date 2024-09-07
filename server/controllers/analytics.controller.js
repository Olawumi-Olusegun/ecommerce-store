import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}

const getAnalyticsData = async () => {
    const totalUsers = await UserModel.countDocuments();
    const totalProducts = await ProductModel.countDocuments();

    const salesData = await OrderModel.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" },
            }
        }
    ]);

    const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 }
    return {
        users: totalUsers,
        products: totalProducts,
        totalSales,
        totalRevenue
    }

}

const getDailySalesData = async (startDate, endDate) => {
	try {
		const dailySalesData = await OrderModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		// example of dailySalesData
		// [
		// 	{
		// 		_id: "2024-08-18",
		// 		sales: 12,
		// 		revenue: 1450.75
		// 	},
		// ]

		const dateArray = getDatesInRange(startDate, endDate);
		// console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
	} catch (error) {
        console.log(`[GET_DAILY_sALES_ANALYTICS]: ${error}`)
		throw error;
	}
}

export const getAnalytics = async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const dailySalesData = await getDailySalesData(startDate, endDate);

        return res.status(200).json({
            dailySalesData,
            analyticsData,
            message: "Daily sales analytics",
            success: true,
        })
    } catch (error) {
        console.log(`[GET_ANALYTICS]: ${error}`)
        return res.status(500).json({ success: false, message: "Unknown error occured" });
    }
}