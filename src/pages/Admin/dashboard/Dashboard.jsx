import React, { useState, useEffect } from "react";
import {
  FaShoppingBag,
  FaChartLine,
  FaBox,
  FaMoneyBillWave,
  FaChartBar,
  FaChartPie,
} from "react-icons/fa";
import DashboardService from "../../../service/DashboardService";
import { toast } from "react-toastify";

export default function Dashboard() {
  // States for different statistics
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [totalStats, setTotalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          weeklyData,
          orderStatsData,
          topProductsData,
          revenueData,
          totalsData,
        ] = await Promise.all([
          DashboardService.getTotalAmountAndProductsOfWeek(),
          DashboardService.getStaticOrders(),
          DashboardService.getTopProductsSoldInMonth(),
          DashboardService.getStoreRevenueByMonth(),
          DashboardService.getTotalOrdersAndAmount(),
        ]);

        setWeeklyStats(weeklyData);
        setOrderStats(orderStatsData);
        setTopProducts(topProductsData.topProducts || []);
        setMonthlyRevenue(revenueData.monthList || []);
        setTotalStats(totalsData[0]); // Get first item from array
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Weekly Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doanh thu tuần</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weeklyStats?.totalAmount?.toLocaleString()} VND
                </p>
              </div>
              <FaMoneyBillWave className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sản phẩm đã bán (tuần)</p>
                <p className="text-2xl font-bold text-gray-800">
                  {weeklyStats?.totalProducts || 0}
                </p>
              </div>
              <FaBox className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalStats?.totalOrders || 0}
                </p>
              </div>
              <FaShoppingBag className="text-purple-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalStats?.totalOrdersAmount?.toLocaleString()} VND
                </p>
              </div>
              <FaChartLine className="text-red-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartPie className="mr-2 text-indigo-500" />
              Thống kê đơn hàng
            </h2>
            <div className="space-y-4">
              {orderStats && (
                <>
                  <StatItem 
                    label="Tổng đơn hàng" 
                    value={orderStats.orders} 
                    color="bg-blue-500"
                    total={orderStats.orders} 
                  />
                  <StatItem 
                    label="Đơn hoàn thành" 
                    value={orderStats.ordersComplete} 
                    color="bg-green-500"
                    total={orderStats.orders} 
                  />
                  <StatItem 
                    label="Đơn hủy" 
                    value={orderStats.ordersCancell} 
                    color="bg-red-500"
                    total={orderStats.orders} 
                  />
                  <StatItem 
                    label="Đơn hoàn trả" 
                    value={orderStats.ordersReturnOrCancell} 
                    color="bg-yellow-500"
                    total={orderStats.orders} 
                  />
                  <StatItem 
                    label="Đơn hoàn tiền" 
                    value={orderStats.ordersReturnRefund} 
                    color="bg-purple-500"
                    total={orderStats.orders} 
                  />
                  <StatItem 
                    label="Đơn báo cáo" 
                    value={orderStats.ordersReport} 
                    color="bg-orange-500"
                    total={orderStats.orders} 
                  />
                </>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartBar className="mr-2 text-orange-500" />
              Top sản phẩm bán chạy
            </h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.item1}</div>
                    <div className="text-xs text-gray-500">
                      Đã bán: {product.item2}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaChartLine className="mr-2 text-green-500" />
            Doanh thu theo tháng
          </h2>
          <div className="h-80">
            <div className="space-y-4">
              {monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">{month.item1}</div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(month.item2 / Math.max(...monthlyRevenue.map(m => m.item2))) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm font-medium">
                    {month.item2?.toLocaleString()} VND
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatItem component for order statistics
function StatItem({ label, value, color, total }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="flex items-center">
      <div className="w-32 text-sm text-gray-600">{label}</div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${color}`}
            style={{
              width: `${percentage}%`
            }}
          />
        </div>
      </div>
      <div className="w-16 text-right text-sm font-medium">{value}</div>
    </div>
  );
}