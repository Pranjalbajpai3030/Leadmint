import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Activity, Users, Mail, Percent } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ... (data remains the same)

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-xeno-primary to-xeno-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground font-medium">
          Overview of your CRM performance and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {kpi.title === 'Total Customers' && <Users className="h-5 w-5 text-xeno-primary" />}
                  {kpi.title === 'Active Users' && <Activity className="h-5 w-5 text-xeno-primary" />}
                  {kpi.title === 'Campaigns Sent' && <Mail className="h-5 w-5 text-xeno-primary" />}
                  {kpi.title === 'Avg Open Rate' && <Percent className="h-5 w-5 text-xeno-primary" />}
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {kpi.title.includes('Rate') ? formatPercent(kpi.value) : formatNumber(kpi.value)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Customer Growth</CardTitle>
              <CardDescription>Monthly new customer acquisition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={customerGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#6366F1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366F1', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#4338CA' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Campaign Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Campaign Performance</CardTitle>
              <CardDescription>Delivery and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280' }}
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sent" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="delivered" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="opened" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicked" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Segmentation Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Customer Segmentation</CardTitle>
              <CardDescription>Breakdown of customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegmentationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {customerSegmentationData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          className="outline-none hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      align="right" 
                      verticalAlign="middle"
                      formatter={(value) => (
                        <span className="text-muted-foreground">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>Latest customer interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * item }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">Customer #{item}</p>
                      <p className="text-sm text-muted-foreground">
                        {item % 2 === 0 ? 'Made a purchase' : 'Viewed campaign'}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item} {item === 1 ? 'hour' : 'hours'} ago
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;