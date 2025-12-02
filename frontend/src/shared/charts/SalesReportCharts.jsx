import { Box, Paper, Stack, Typography, Grid, Chip } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend, LabelList } from 'recharts'

const COLORS = ['#4f46e5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1']

// Custom Tooltip for Pie Charts
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box
        sx={{
          background: 'rgba(255,255,255,0.98)',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          padding: '12px 16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', mb: 0.5 }}>
          {data.name}
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b' }}>
          Units: {data.value?.toLocaleString() || 0}
        </Typography>
      </Box>
    );
  }
  return null;
};

// Utility function to determine if data needs logarithmic scaling
const shouldUseLogScale = (data, dataKey, threshold = 10) => {
  if (!data || data.length === 0) return false
  
  const values = data.map(item => item[dataKey] || 0).filter(val => val > 0)
  if (values.length === 0) return false
  
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  
  // Use log scale if the ratio between max and min is greater than threshold
  return maxValue / minValue > threshold
}

// Custom tick formatter for logarithmic scale
const formatLogTick = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

export default function SalesReportCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 4) {
    return null
  }

  const [detailedTransactions, invoiceSummary, customerSummary, brandSummary] = data.recordsets

  // Process data for charts with truncated names
  const customerUnitsData = customerSummary?.map(item => ({
    name: (item.TO_PARTY || 'Unknown').length > 12 ? 
      (item.TO_PARTY || 'Unknown').substring(0, 12) + '...' : 
      (item.TO_PARTY || 'Unknown'),
    fullName: item.TO_PARTY || 'Unknown',
    units: item.UNITS || 0,
    value: item.UNITS || 0
  })) || []

  // Sort by units (highest first)
  const sortedCustomerUnitsData = [...customerUnitsData]
    .sort((a, b) => b.units - a.units)

  const customerRevenueData = customerSummary?.map(item => ({
    name: (item.TO_PARTY || 'Unknown').length > 12 ? 
      (item.TO_PARTY || 'Unknown').substring(0, 12) + '...' : 
      (item.TO_PARTY || 'Unknown'),
    fullName: item.TO_PARTY || 'Unknown',
    revenue: item.GROSSVALUE || 0,
    value: item.GROSSVALUE || 0
  })) || []

  // Sort by revenue (highest first)
  const sortedCustomerRevenueData = [...customerRevenueData]
    .sort((a, b) => b.revenue - a.revenue)

  // Calculate dynamic width for scrollable charts (80px per customer)
  const customerChartWidth = Math.max(1200, customerUnitsData.length * 80)

  // Determine scaling for each chart
  const useLogScaleUnits = shouldUseLogScale(sortedCustomerUnitsData, 'units', 5)
  const useLogScaleRevenue = shouldUseLogScale(sortedCustomerRevenueData, 'revenue', 5)

  const brandUnitsData = brandSummary?.map(item => ({
    name: item.BRAND || 'Unknown',
    units: item.UNITS || 0,
    value: item.UNITS || 0
  })) || []

  // Top 8 brands for pie chart (to avoid label overlap)
  const topBrandsForPie = [...brandUnitsData]
    .sort((a, b) => b.units - a.units)
    .slice(0, 8)

  const brandRevenueData = brandSummary?.map(item => ({
    name: item.BRAND || 'Unknown',
    revenue: item.GROSSVALUE || 0,
    value: item.GROSSVALUE || 0
  })) || []

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #4f46e5, #22c55e)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Sales Analytics Dashboard
        </Typography>
      </Stack>
      
       {/* Vertical Stack Layout - Each Chart Full Width */}
       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
         {/* Chart 1: Customer Units - Full Width */}
         <Box sx={{ width: '100%' }}>
           <Paper 
             id="customer-units-chart"
             elevation={0}
             sx={{ 
               p: { xs: 2, md: 2.5 }, 
               borderRadius: 0, 
               background: (theme) => theme.palette.background.paper,
               border: 'none',
               borderTop: (theme) => `1px solid ${theme.palette.divider}`,
               borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
               boxShadow: 'none'
             }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#4f46e5',
              borderBottom: '2px solid #4338ca',
              mb: 2
            }}>
              Units by Customer (All Customers)
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              <Box sx={{ minWidth: customerChartWidth, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedCustomerUnitsData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                 <YAxis 
                   stroke="#64748b" 
                   tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                   width={80}
                   label={{ value: 'Units', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                   scale={useLogScaleUnits ? 'log' : 'linear'}
                   domain={useLogScaleUnits ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                   tickFormatter={useLogScaleUnits ? formatLogTick : undefined}
                 />
                 <RechartsTooltip 
                   formatter={(value, name) => [value.toLocaleString(), 'Units']}
                   labelFormatter={(label, payload) => {
                     const data = payload?.[0]?.payload;
                     return `Customer: ${data?.fullName || label}`;
                   }}
                   contentStyle={{ 
                     background: 'rgba(255,255,255,0.98)', 
                     border: '2px solid #e2e8f0',
                     borderRadius: 12,
                     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                     fontSize: '16px',
                     fontWeight: 'bold'
                   }}
                 />
                <Bar dataKey="units" fill="#4f46e5" radius={[8, 8, 0, 0]} stroke="#4f46e5" strokeWidth={2}>
                  <LabelList 
                    dataKey="units" 
                    position="top" 
                    formatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                    style={{ fill: '#4f46e5', fontWeight: 'bold', fontSize: 12 }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

         {/* Chart 2: Customer Revenue - Full Width */}
         <Box sx={{ width: '100%' }}>
           <Paper 
             id="customer-revenue-chart"
             elevation={0}
             sx={{ 
               p: { xs: 2, md: 2.5 }, 
               borderRadius: 0, 
               background: (theme) => theme.palette.background.paper,
               border: 'none',
               borderTop: (theme) => `1px solid ${theme.palette.divider}`,
               borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
               boxShadow: 'none'
             }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#22c55e',
              borderBottom: '2px solid #16a34a',
              mb: 2
            }}>
              Revenue by Customer (All Customers)
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
              <Box sx={{ minWidth: customerChartWidth, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sortedCustomerRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <defs>
                    <linearGradient id="customerRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                 <YAxis 
                   stroke="#64748b" 
                   tick={{ fontSize: 16, fill: '#64748b', fontWeight: 700 }}
                   width={80}
                   label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '18px', fontWeight: 'bold' } }}
                   scale={useLogScaleRevenue ? 'log' : 'linear'}
                   domain={useLogScaleRevenue ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                   tickFormatter={useLogScaleRevenue ? formatLogTick : undefined}
                 />
                 <RechartsTooltip 
                   formatter={(value, name) => [`₹${value.toLocaleString()}`, 'Revenue']}
                   labelFormatter={(label, payload) => {
                     const data = payload?.[0]?.payload;
                     return `Customer: ${data?.fullName || label}`;
                   }}
                   contentStyle={{ 
                     background: 'rgba(255,255,255,0.98)', 
                     border: '2px solid #e2e8f0',
                     borderRadius: 12,
                     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                     fontSize: '16px',
                     fontWeight: 'bold'
                   }}
                 />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#22c55e" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#customerRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Box>

         {/* Chart 3: Brand Units - Full Width */}
         <Box sx={{ width: '100%', overflow: 'visible' }}>
           <Paper 
             id="brand-units-chart"
             elevation={0}
             sx={{ 
               p: { xs: 2, md: 2.5 }, 
               borderRadius: 0, 
               background: (theme) => theme.palette.background.paper,
               border: 'none',
               borderTop: (theme) => `1px solid ${theme.palette.divider}`,
               borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
               boxShadow: 'none'
             }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#f59e0b',
              borderBottom: '2px solid #d97706',
              mb: 2
            }}>
              Units by Brand (Top 8 Brands)
            </Box>
            <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 450 : 750}>
              <PieChart>
                <Pie
                  data={topBrandsForPie}
                  cx="50%"
                  cy="50%"
                  labelLine={{ stroke: '#64748b', strokeWidth: 0.5, length: window.innerWidth < 768 ? 10 : 20 }}
                  label={(props) => {
                    const { name, percent, x, y, cx } = props
                    // Only show label if percentage is greater than 3%
                    if (percent > 0.03) {
                      const isMobile = window.innerWidth < 768
                      const maxLength = isMobile ? 6 : 10
                      const displayName = name.length > maxLength ? name.substring(0, maxLength) + '...' : name
                      const fontSize = isMobile ? 9 : 14
                      
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill="#1e293b" 
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          style={{ fontSize: `${fontSize}px`, fontWeight: 600 }}
                        >
                          {`${displayName} ${(percent * 100).toFixed(1)}%`}
                        </text>
                      )
                    }
                    return null
                  }}
                  outerRadius={window.innerWidth < 768 ? 70 : 240}
                  innerRadius={window.innerWidth < 768 ? 30 : 90}
                  fill="#8884d8"
                  dataKey="units"
                  paddingAngle={1}
                >
                  {topBrandsForPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const total = topBrandsForPie.reduce((sum, item) => sum + item.units, 0)
                      const percent = ((data.units / total) * 100).toFixed(1)
                      return (
                        <div style={{
                          background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
                          border: '3px solid #f59e0b',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          boxShadow: '0 12px 32px rgba(245, 158, 11, 0.3)',
                          minWidth: '200px'
                        }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: '#92400e',
                            marginBottom: '8px',
                            borderBottom: '2px solid #f59e0b',
                            paddingBottom: '8px'
                          }}>
                            {data.name}
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#b45309',
                            marginBottom: '4px'
                          }}>
                            Units Sold: {data.units.toLocaleString('en-IN')}
                          </div>
                          <div style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#d97706'
                          }}>
                            Percentage: {percent}%
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={80}
                  wrapperStyle={{ 
                    fontSize: '15px', 
                    fontWeight: 'bold', 
                    paddingTop: '30px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  iconSize={16}
                  formatter={(value, entry) => {
                    const item = topBrandsForPie.find(d => d.name === value);
                    const total = topBrandsForPie.reduce((sum, d) => sum + d.units, 0);
                    const percent = item ? ((item.units / total) * 100).toFixed(1) : 0;
                    return `${value} (${percent}%)`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
           </Paper>
         </Box>

         {/* Chart 4: Brand Revenue - Full Width */}
         <Box sx={{ width: '100%' }}>
           <Paper 
             id="brand-revenue-chart"
             elevation={0}
             sx={{ 
               p: { xs: 2, md: 2.5 }, 
               borderRadius: 0, 
               background: (theme) => theme.palette.background.paper,
               border: 'none',
               borderTop: (theme) => `1px solid ${theme.palette.divider}`,
               borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
               boxShadow: 'none'
             }}>
             <Box sx={{ 
               p: { xs: 1.5, md: 2 }, 
               fontWeight: 700, 
               fontSize: { xs: 16, md: 18 },
               color: 'white',
               textAlign: 'center',
               background: '#ef4444',
               borderBottom: '2px solid #dc2626',
               mb: 2
             }}>
               Revenue by Brand
             </Box>
             <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch' }}>
               <Box sx={{ minWidth: { xs: Math.max(600, brandRevenueData.length * 80), md: '100%' }, height: 400 }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={brandRevenueData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                 <XAxis 
                   dataKey="name" 
                   stroke="#64748b" 
                   tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }} 
                   angle={-45}
                   textAnchor="end"
                   height={60}
                   interval={0}
                 />
                 <YAxis 
                   stroke="#64748b" 
                   tick={{ fontSize: 14, fill: '#64748b', fontWeight: 600 }}
                   width={80}
                   label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '16px', fontWeight: 'bold' } }}
                 />
                 <RechartsTooltip 
                   formatter={(value, name) => [`₹${value.toLocaleString()}`, 'Revenue']}
                   contentStyle={{ 
                     background: 'rgba(255,255,255,0.98)', 
                     border: '2px solid #e2e8f0',
                     borderRadius: 12,
                     boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                     fontSize: '16px',
                     fontWeight: 'bold'
                   }}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="revenue" 
                   stroke="#ef4444" 
                   strokeWidth={5}
                   dot={{ fill: '#ef4444', strokeWidth: 3, r: 8 }}
                   activeDot={{ r: 10, stroke: '#ef4444', strokeWidth: 3 }}
                 />
               </LineChart>
             </ResponsiveContainer>
               </Box>
             </Box>
           </Paper>
         </Box>
       </Box>
    </Box>
  )
}
