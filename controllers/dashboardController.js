const Order = require('../models/Order');

// @desc    Get dashboard analytics
// @route   GET /dashboard
// @access  Public (or Private if auth is added later)
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Orders
        const totalOrders = await Order.countDocuments();

        // 2. Total Revenue (Sum of totalAmount)
        const totalRevenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        // 3. Pending Amount & Count (Status = 'Pending')
        const pendingStats = await Order.aggregate([
            { $match: { status: 'Pending' } },
            {
                $group: {
                    _id: null,
                    amount: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        const pendingAmount = pendingStats.length > 0 ? pendingStats[0].amount : 0;
        const ordersCountPending = pendingStats.length > 0 ? pendingStats[0].count : 0;

        // 4. Processed Amount & Count (Status = 'Completed', 'Paid', or 'Shipped')
        // Note: Schema currently has ['Pending', 'Completed', 'Cancelled']. 
        // Including 'Paid' and 'Shipped' to match requirements in case of schema changes or loose data.
        const processedStats = await Order.aggregate([
            { $match: { status: { $in: ['Completed', 'Paid', 'Shipped'] } } },
            {
                $group: {
                    _id: null,
                    amount: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        const processedAmount = processedStats.length > 0 ? processedStats[0].amount : 0;
        const ordersCountProcessed = processedStats.length > 0 ? processedStats[0].count : 0;

        // 5. Last 7 Days Sales Data
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 6. Last 30 Days Order Volume
        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const ordersData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: last30Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        console.log('--- Dashboard Debug ---');
        console.log('Last 30 Days Date:', last30Days);
        console.log('Orders Data Found:', ordersData);
        console.log('Total Orders Count:', totalOrders);
        console.log('-----------------------');

        res.json({
            totalOrders,
            totalRevenue,
            pendingAmount,
            processedAmount,
            ordersCountPending,
            ordersCountProcessed,
            salesData,
            ordersData
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
