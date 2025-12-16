import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, FolderKanban, CheckSquare, Ticket, 
  Clock, Calendar, TrendingUp, DollarSign, FileText,
  Car, UserCheck, Receipt, CreditCard, ShoppingCart,
  Wrench, AlertCircle, Activity
} from 'lucide-react';
import MetricCard from './MetricCard';
import ChartRenderer from './ChartRenderer';
import { getDashboardMetrics } from '../services/api';




const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const data = await getDashboardMetrics();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-dark-400 mb-4">{error}</p>
          <button onClick={fetchMetrics} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data for properties by status (aggregate the data)
const propertiesStatusChart = metrics?.properties ? {
  type: 'bar',
  data: {
    labels: ['Available', 'Rented', 'Maintenance', 'Reserved'],
    datasets: [{
      label: 'Properties',
      data: [
        metrics.properties.filter(p => p.status === 'available').length,
        metrics.properties.filter(p => p.status === 'rented').length,
        metrics.properties.filter(p => p.status === 'maintenance').length,
        metrics.properties.filter(p => p.status === 'reserved').length
      ],
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      borderWidth: 2,
      borderRadius: 8,
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Properties by Status',
        color: '#374151',
        font: { size: 16, weight: 'bold' }
      },
      legend: { display: false }
    }
  }
} : null;

// Prepare chart data for tickets by category
const ticketsCategoryChart = metrics?.tickets_by_category ? {
  type: 'bar',
  data: {
    labels: metrics.tickets_by_category.map(item => item.category || 'Unknown'),
    datasets: [{
      label: 'Tickets',
      data: metrics.tickets_by_category.map(item => item.count),
      backgroundColor: '#10B981',
      borderColor: '#059669',
      borderWidth: 2,
      borderRadius: 8,
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: 'Tickets by Category',
        color: '#374151',
        font: { size: 16, weight: 'bold' }
      },
      legend: { display: false }
    }
  }
} : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Real Estate Dashboard
          </h1>
          <p className="text-dark-400">
            AI-powered analytics and insights
          </p>
        </div>
        <button 
          onClick={fetchMetrics}
          className="btn-secondary flex items-center gap-2"
          disabled={loading}
        >
          <Activity className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Properties */}
        <MetricCard
          title="Total Properties"
          value={metrics?.total_properties}
          icon={Building2}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Rented Properties"
          value={metrics?.rented_properties}
          icon={CheckSquare}
          color="success"
          loading={loading}
        />
        <MetricCard
          title="Available Properties"
          value={metrics?.available_properties}
          icon={Building2}
          color="info"
          loading={loading}
        />

        {/* Projects */}
        <MetricCard
          title="Total Projects"
          value={metrics?.total_projects}
          icon={FolderKanban}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="Ongoing Projects"
          value={metrics?.ongoing_projects}
          icon={Activity}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="Completed Projects"
          value={metrics?.completed_projects}
          icon={CheckSquare}
          color="success"
          loading={loading}
        />

        {/* Tasks */}
        <MetricCard
          title="Total Tasks"
          value={metrics?.total_tasks}
          icon={CheckSquare}
          color="info"
          loading={loading}
        />
        <MetricCard
          title="Ongoing Tasks"
          value={metrics?.ongoing_tasks}
          icon={Clock}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="Overdue Tasks"
          value={metrics?.overdue_tasks}
          icon={AlertCircle}
          color="error"
          loading={loading}
        />

        {/* Users */}
        <MetricCard
          title="Total Users"
          value={metrics?.total_users}
          icon={Users}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Active Employees"
          value={metrics?.active_employees}
          icon={UserCheck}
          color="success"
          loading={loading}
        />

        {/* Tickets */}
        <MetricCard
          title="Total Tickets"
          value={metrics?.total_tickets}
          icon={Ticket}
          color="info"
          loading={loading}
        />
        <MetricCard
          title="Pending Tickets"
          value={metrics?.pending_tickets}
          icon={AlertCircle}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="Resolved Tickets"
          value={metrics?.resolved_tickets}
          icon={CheckSquare}
          color="success"
          loading={loading}
        />
        <MetricCard
          title="Avg TAT (hours)"
          value={metrics?.average_tat_hours?.toFixed(1)}
          icon={Clock}
          color="info"
          loading={loading}
        />

        {/* Attendance */}
        <MetricCard
          title="Late Arrivals"
          value={metrics?.late_attendance_count}
          icon={Clock}
          color="warning"
          loading={loading}
        />

        {/* Meetings */}
        <MetricCard
          title="Total Meetings"
          value={metrics?.total_meetings}
          icon={Calendar}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="Upcoming Meetings"
          value={metrics?.upcoming_meetings}
          icon={Calendar}
          color="info"
          loading={loading}
        />

        {/* Financial */}
        <MetricCard
          title="Total Demands"
          value={metrics?.total_demands}
          icon={TrendingUp}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Pending Demands"
          value={metrics?.pending_demands}
          icon={AlertCircle}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="Total Outstanding"
          value={`₹${metrics?.total_outstanding_amount?.toLocaleString()}`}
          icon={DollarSign}
          color="error"
          loading={loading}
        />

        {/* Tenants */}
        <MetricCard
          title="Total Tenants"
          value={metrics?.total_tenants}
          icon={Users}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Company Tenants"
          value={metrics?.company_tenants_rental}
          icon={Building2}
          color="info"
          loading={loading}
        />

        {/* Visitors & Vehicles */}
        <MetricCard
          title="Total Visitors"
          value={metrics?.total_visitors}
          icon={UserCheck}
          color="purple"
          loading={loading}
        />
        <MetricCard
          title="Total Vehicles"
          value={metrics?.total_vehicles}
          icon={Car}
          color="info"
          loading={loading}
        />

        {/* Bills & Payments */}
        <MetricCard
          title="Total Bills"
          value={metrics?.total_bills}
          icon={FileText}
          color="primary"
          loading={loading}
        />
        <MetricCard
          title="Pending Payments"
          value={metrics?.pending_payments_count}
          icon={Receipt}
          color="warning"
          loading={loading}
        />
        <MetricCard
          title="Pending Amount"
          value={`₹${metrics?.pending_payments_amount?.toLocaleString()}`}
          icon={CreditCard}
          color="error"
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
 {propertiesStatusChart && (
  <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Properties by Status
    </h3>
    <ChartRenderer chartConfig={propertiesStatusChart} />
  </div>
)}

{ticketsCategoryChart && (
  <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Tickets Overview
    </h3>
    <ChartRenderer chartConfig={ticketsCategoryChart} />
  </div>
)}

      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-dark-100">
              Purchase Orders
            </h3>
          </div>
          <div className="space-y-2">
            {metrics?.purchase_orders_by_category?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-800">
                <span className="text-sm text-dark-300 capitalize">{item.category}</span>
                <span className="text-sm font-semibold text-dark-100">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-dark-100">
              Work Orders
            </h3>
          </div>
          <div className="space-y-2">
            {metrics?.work_orders_by_category?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-800">
                <span className="text-sm text-dark-300 capitalize">{item.category}</span>
                <span className="text-sm font-semibold text-dark-100">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-dark-100">
              Tenants by Ownership
            </h3>
          </div>
          <div className="space-y-2">
            {metrics?.tenants_by_ownership?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-dark-800">
                <span className="text-sm text-dark-300 capitalize">{item.ownership}</span>
                <span className="text-sm font-semibold text-dark-100">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;