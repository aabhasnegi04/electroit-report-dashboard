import { Box, Paper, Typography } from '@mui/material'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, Legend } from 'recharts'

// Utility function to determine if data needs logarithmic scaling
const shouldUseLogScale = (data, dataKey, threshold = 10) => {
  if (!data || data.length === 0) return false
  
  const values = data.map(item => item[dataKey] || 0).filter(val => val > 0)
  if (values.length === 0) return false
  
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  
  return maxValue / minValue > threshold
}

// Custom tick formatter for logarithmic scale
const formatLogTick = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

export default function PurchaseReportCharts({ data }) {
  if (!data || !data.recordsets || data.recordsets.length < 2) {
    return null
  }

  const [sellerData, brandData] = data.recordsets

  // Process seller data for charts
  const sellerChartData = sellerData?.map((item, index) => {
    const sellerName = item.SELLER_NAME || 'Unknown'
    let displayName = sellerName
    if (displayName.length > 12) {
      displayName = displayName.substring(0, 12) + '...'
    }
    
    return {
      name: `${displayName}${index > 0 ? ` (${index + 1})` : ''}`,
      fullName: sellerName,
      purchaseValue: item.PURCHASEVALUE || 0,
      totalValue: item.TOTALVALUE || 0
    }
  }) || []

  // Process brand data for charts
  const brandChartData = brandData?.map(item => ({
    name: item.BRAND || 'Unknown',
    purchaseValue: item.PURCHASEVALUE || 0,
    totalValue: item.TOTALVALUE || 0
  })) || []

  // Determine scaling
  const useLogScaleSeller = shouldUseLogScale(sellerChartData, 'purchaseValue', 5)
  const useLogScaleBrand = shouldUseLogScale(brandChartData, 'purchaseValue', 5)

  return (
    <Box sx={{ m: 0, p: 0, width: '100%', maxWidth: '100vw' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%' }}>
        {/* Chart 1: Seller Purchase Analysis */}
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Paper 
            id="seller-purchase-chart"
            sx={{ 
              p: 0, 
              borderRadius: 0, 
              background: 'linear-gradient(135deg, #fff5ed 0%, #ffffff 100%)',
              border: 'none',
              borderTop: '3px solid #f59e0b',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
              m: 0,
              width: '100%',
              maxWidth: '100%'
            }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#f59e0b',
              borderBottom: '2px solid #d97706',
              mb: 2,
              mx: { xs: -2, md: -3 }
            }}>
              Purchase Analysis by Seller
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', mx: { xs: -2, md: -3 }, px: { xs: 2, md: 3 } }}>
              <Box sx={{ minWidth: Math.max(600, sellerChartData.length * 80), height: { xs: 300, md: 450 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sellerChartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#f59e0b" 
                    tick={{ fontSize: 14, fill: '#92400e', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={'preserveStartEnd'}
                  />
                  <YAxis 
                    stroke="#f59e0b" 
                    tick={{ fontSize: 14, fill: '#92400e', fontWeight: 600 }}
                    width={80}
                    scale={useLogScaleSeller ? 'log' : 'linear'}
                    domain={useLogScaleSeller ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                    tickFormatter={useLogScaleSeller ? formatLogTick : undefined}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'purchaseValue' ? 'Purchase Value' : 'Total Value']}
                    labelFormatter={(label, payload) => {
                      const data = payload?.[0]?.payload;
                      return data?.fullName || label;
                    }}
                    contentStyle={{ 
                      background: '#fffbeb', 
                      border: '2px solid #f59e0b',
                      borderRadius: 8,
                      fontSize: 16,
                      padding: '12px 16px',
                      fontWeight: 600
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="center"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: 16, fontWeight: 600 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="purchaseValue" 
                    stroke="#f59e0b" 
                    strokeWidth={4}
                    dot={{ fill: '#f59e0b', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 3 }}
                    name="Purchase Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#ef4444" 
                    strokeWidth={4}
                    dot={{ fill: '#ef4444', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 3 }}
                    name="Total Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
          </Paper>
        </Box>

        {/* Chart 2: Brand Purchase Analysis */}
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Paper 
            id="brand-purchase-chart"
            sx={{ 
              p: 0, 
              borderRadius: 0, 
              background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
              border: 'none',
              borderTop: '3px solid #8b5cf6',
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: 'none',
              m: 0,
              width: '100%',
              maxWidth: '100%'
            }}>
            <Box sx={{ 
              p: { xs: 1.5, md: 2 }, 
              fontWeight: 700, 
              fontSize: { xs: 16, md: 18 },
              color: 'white',
              textAlign: 'center',
              background: '#8b5cf6',
              borderBottom: '2px solid #7c3aed',
              mb: 2,
              mx: { xs: -2, md: -3 }
            }}>
              Purchase Analysis by Brand
            </Box>
            <Box sx={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', WebkitOverflowScrolling: 'touch', mx: { xs: -2, md: -3 }, px: { xs: 2, md: 3 } }}>
              <Box sx={{ minWidth: Math.max(600, brandChartData.length * 80), height: { xs: 300, md: 450 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={brandChartData} margin={{ top: 10, right: 10, left: 10, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 600 }} 
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={'preserveStartEnd'}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 600 }}
                    width={80}
                    scale={useLogScaleBrand ? 'log' : 'linear'}
                    domain={useLogScaleBrand ? ['dataMin', 'dataMax'] : [0, 'dataMax']}
                    tickFormatter={useLogScaleBrand ? formatLogTick : undefined}
                  />
                  <RechartsTooltip 
                    formatter={(value, name) => [`₹${value.toLocaleString()}`, name === 'purchaseValue' ? 'Purchase' : 'Total']}
                    labelFormatter={(label) => label}
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: 4,
                      fontSize: 16,
                      padding: '12px 16px',
                      fontWeight: 600
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="center"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: 16, fontWeight: 600 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="purchaseValue" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Purchase Value"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalValue" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Total Value"
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

