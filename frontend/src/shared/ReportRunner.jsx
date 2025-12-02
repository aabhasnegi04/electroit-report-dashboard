import { useMemo, useState, useEffect } from 'react'
import { Box, Button, Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Fab } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import ReportViewer from './ReportViewer'

export default function ReportRunner({ selectedReport }) {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)
  const [brand, setBrand] = useState('')
  const [customer, setCustomer] = useState('')
  const [brands, setBrands] = useState([])
  const [customers, setCustomers] = useState([])

  const reportTitle = useMemo(() => {
    const names = {
      sales_report: 'Sales Report',
      purchase_report: 'Purchase Report',
      stock_report: 'Current Stock Report',
      payment_report: 'Payment Received Report',
      pending_report: 'Pending Payment Report',
      order_report: 'Order Report',
      petty_expense_report: 'Petty Expense Report',
      creditors_report: 'Sundry Creditors Report',
      debitors_report: 'Sundry Debitors Report',
      hr_report: 'HR Attendance Report',
      daily_activity_report: 'Daily Activity Report',
    }
    return names[selectedReport] || 'Result'
  }, [selectedReport])

  const reportMap = useMemo(() => {
      return {
      sales_report: 'proc_CHutilizedatewise_reportf2',
      purchase_report: 'proc_summary_purchase1',
      stock_report: 'proc_CHgetstockfordisbushCurrent',
      payment_report: 'proc_paymentreceived_datewise_data',
      pending_report: 'proc_getpendingpaymentpartywise',
      order_report: 'proc_gettotalordertill',
      petty_expense_report: 'proc_pettyexpanse_report',
      creditors_report: 'proc_CREDITORS_report',
      debitors_report: 'proc_DEBITORS_report',
      hr_report: 'proc_attend_report_datepivot',
      daily_activity_report: 'proc_getdailysummary',
    }
  }, [])

  // Load dropdown data on component mount
  useEffect(() => {
    loadDropdownData()
  }, [])

  async function loadDropdownData() {
    try {
      let apiBase = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : ''
      if (!apiBase && typeof window !== 'undefined') {
        const host = window.location.hostname
        if (host === 'report.electroitzone.com' || host.endsWith('.report.electroitzone.com')) {
          apiBase = 'https://adm.electroitzone.com'
        }
      }
      const url = `${apiBase}/api/exec`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedure: 'proc_drp_sale_report',
          params: {},
        }),
      })
      const json = await response.json()
      if (response.ok && json.recordsets) {
        setBrands(json.recordsets[0] || [])
        setCustomers(json.recordsets[1] || [])
      }
    } catch (e) {
      console.error('Failed to load dropdown data:', e)
    }
  }

  function buildParams() {
    const fromStr = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : undefined
    const toStr = toDate ? dayjs(toDate).format('YYYY-MM-DD') : undefined

    if (selectedReport === 'stock_report' || selectedReport === 'pending_report' || selectedReport === 'order_report') {
      // Stock report, Pending payment report, and Order report (no parameters needed)
      return {}
    } else if (selectedReport === 'purchase_report') {
      // Purchase report parameters for proc_summary_purchase1
        return {
        fromdate: fromStr || new Date().toISOString().split('T')[0],
        todate: toStr || new Date().toISOString().split('T')[0]
        }
    } else if (selectedReport === 'payment_report') {
      // Payment report parameters for proc_paymentreceived_datewise_data
        return {
        fromdate: fromStr || new Date().toISOString().split('T')[0],
        todate: toStr || new Date().toISOString().split('T')[0]
        }
    } else if (selectedReport === 'petty_expense_report') {
      // Petty expense report parameters for proc_pettyexpanse_report
        return {
        from_date: fromStr || new Date().toISOString().split('T')[0],
        to_date: toStr || new Date().toISOString().split('T')[0]
        }
    } else if (selectedReport === 'creditors_report') {
      // Creditors report parameters for proc_CREDITORS_report
        return {
        from_date: fromStr || new Date().toISOString().split('T')[0],
        to_date: toStr || new Date().toISOString().split('T')[0]
        }
    } else if (selectedReport === 'debitors_report') {
      // Debitors report parameters for proc_DEBITORS_report
        return {
        from_date: fromStr || new Date().toISOString().split('T')[0],
        to_date: toStr || new Date().toISOString().split('T')[0]
        }
    } else if (selectedReport === 'hr_report') {
      // HR report parameters for proc_attend_report_datepivot
        return {
        month1: month,
        year1: year
        }
    } else if (selectedReport === 'daily_activity_report') {
      // Daily activity report parameters for proc_getdailysummary
        return {
        fdate: fromStr || new Date().toISOString().split('T')[0],
        tdate: toStr || new Date().toISOString().split('T')[0]
        }
    } else {
      // Sales report parameters for proc_CHutilizedatewise_reportf2
        return {
        from_date: fromStr || new Date().toISOString().split('T')[0],
        to_date: toStr || new Date().toISOString().split('T')[0],
        BRAND1: brand || 'fffff',
        ToParty1: customer || 'fffff'
        }
    }
  }

  async function runSelectedReport() {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const params = buildParams()
      let apiBase = (typeof __API_BASE__ !== 'undefined' && __API_BASE__) ? __API_BASE__ : ''
      if (!apiBase && typeof window !== 'undefined') {
        // Default to production backend when running on report.electroitzone.com
        const host = window.location.hostname
        if (host === 'report.electroitzone.com' || host.endsWith('.report.electroitzone.com')) {
          apiBase = 'https://adm.electroitzone.com'
        }
      }
      const url = `${apiBase}/api/exec`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedure: reportMap[selectedReport] || reportMap['sales_summary'],
          params,
        }),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        const msg = [json?.error, json?.details].filter(Boolean).join(' - ') || 'Request failed'
        throw new Error(msg)
      }
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        p: { xs: 2.5, md: 3.5 }, 
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)'
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            {/* Header */}
            <Box sx={{ 
              p: { xs: 2.5, md: 3 }, 
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              borderRadius: 3,
              mb: 0.5,
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: 18, md: 20 }, mb: 1, letterSpacing: 0.5 }}>
                Report Filters
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 14 }, lineHeight: 1.6 }}>
                {selectedReport === 'stock_report' 
                  ? 'Current stock report shows real-time inventory levels by brand'
                  : selectedReport === 'pending_report'
                  ? 'Pending payment report shows outstanding payments by party'
                  : selectedReport === 'order_report'
                  ? 'Order report shows all orders till date by month, client, and brand'
                  : selectedReport === 'payment_report'
                  ? 'Select date range to view payment received data'
                  : selectedReport === 'petty_expense_report'
                  ? 'Select date range to view petty expense data'
                  : selectedReport === 'creditors_report'
                  ? 'Select date range to view sundry creditors data'
                  : selectedReport === 'debitors_report'
                  ? 'Select date range to view sundry debitors data'
                  : selectedReport === 'hr_report'
                  ? 'Select month and year to view HR attendance data'
                  : selectedReport === 'daily_activity_report'
                  ? 'Select date range to view daily business activity summary'
                  : 'Select date range and filters to generate your report'
                }
              </Typography>
            </Box>

            {/* Filter Grid */}
            {selectedReport === 'hr_report' ? (
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 1.5, md: 2 }
              }}>
                <FormControl size="medium" fullWidth>
                  <InputLabel sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 600 }}>Month</InputLabel>
                  <Select
                    value={month}
                    label="Month"
                    onChange={(e) => setMonth(e.target.value)}
                    sx={{ 
                      borderRadius: 2,
                      background: 'white',
                      '& .MuiSelect-select': { fontSize: { xs: 14, md: 15 }, fontWeight: 600 },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                        borderColor: 'rgba(79, 70, 229, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(79, 70, 229, 0.4)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4f46e5'
                      }
                    }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                      <MenuItem key={m} value={m} sx={{ fontSize: { xs: 13, md: 14 } }}>
                        {new Date(2000, m - 1, 1).toLocaleString('default', { month: 'long' })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="medium" fullWidth>
                  <InputLabel sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 600 }}>Year</InputLabel>
                  <Select
                    value={year}
                    label="Year"
                    onChange={(e) => setYear(e.target.value)}
                    sx={{ 
                      borderRadius: 2,
                      background: 'white',
                      '& .MuiSelect-select': { fontSize: { xs: 14, md: 15 }, fontWeight: 600 },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                        borderColor: 'rgba(79, 70, 229, 0.2)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(79, 70, 229, 0.4)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#4f46e5'
                      }
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <MenuItem key={y} value={y} sx={{ fontSize: { xs: 13, md: 14 } }}>
                        {y}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            ) : selectedReport !== 'stock_report' && selectedReport !== 'pending_report' && selectedReport !== 'order_report' && (
              <>
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: { xs: 1.5, md: 2 }
              }}>
              <DatePicker 
                label="From Date" 
                value={fromDate} 
                onChange={(val) => setFromDate(val)} 
                format="DD/MM/YYYY"
                slotProps={{ 
                  textField: { 
                    size: 'medium',
                    fullWidth: true,
                    sx: { 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        background: 'white',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: 'rgba(79, 70, 229, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(79, 70, 229, 0.4)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4f46e5'
                        }
                      },
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: 14, md: 15 },
                        fontWeight: 600,
                        caretColor: 'text.primary',
                        color: 'text.primary'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: 14, md: 15 },
                        fontWeight: 600
                      }
                    }
                  } 
                }} 
              />
              <DatePicker 
                label="To Date" 
                value={toDate} 
                onChange={(val) => setToDate(val)} 
                format="DD/MM/YYYY"
                slotProps={{ 
                  textField: { 
                    size: 'medium',
                    fullWidth: true,
                    sx: { 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 2,
                        background: 'white',
                        '& fieldset': {
                          borderWidth: 2,
                          borderColor: 'rgba(79, 70, 229, 0.2)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(79, 70, 229, 0.4)'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4f46e5'
                        }
                      },
                      '& .MuiInputBase-input': { 
                        fontSize: { xs: 14, md: 15 },
                        fontWeight: 600,
                        caretColor: 'text.primary',
                        color: 'text.primary'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: 14, md: 15 },
                        fontWeight: 600
                      }
                    }
                  } 
                }} 
              />
            </Box>
              {selectedReport !== 'purchase_report' && selectedReport !== 'payment_report' && selectedReport !== 'petty_expense_report' && selectedReport !== 'creditors_report' && selectedReport !== 'debitors_report' && selectedReport !== 'daily_activity_report' && (
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr',
                  gap: { xs: 1.5, md: 2 }
                }}>
                  <FormControl size="medium" fullWidth>
                    <InputLabel sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 600 }}>Brand Filter</InputLabel>
                    <Select
                      value={brand}
                      label="Brand Filter"
                      onChange={(e) => setBrand(e.target.value)}
                      sx={{ 
                        borderRadius: 2,
                        background: 'white',
                        '& .MuiSelect-select': { fontSize: { xs: 14, md: 15 }, fontWeight: 600 },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                          borderColor: 'rgba(79, 70, 229, 0.2)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(79, 70, 229, 0.4)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4f46e5'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ fontSize: { xs: 13, md: 14 } }}>All Brands</MenuItem>
                      {brands.map((item, index) => (
                        <MenuItem key={index} value={item.BRAND} sx={{ fontSize: { xs: 13, md: 14 } }}>
                          {item.BRAND}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="medium" fullWidth>
                    <InputLabel sx={{ fontSize: { xs: 14, md: 15 }, fontWeight: 600 }}>Customer Filter</InputLabel>
                    <Select
                      value={customer}
                      label="Customer Filter"
                      onChange={(e) => setCustomer(e.target.value)}
                      sx={{ 
                        borderRadius: 2,
                        background: 'white',
                        '& .MuiSelect-select': { fontSize: { xs: 14, md: 15 }, fontWeight: 600 },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: 2,
                          borderColor: 'rgba(79, 70, 229, 0.2)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(79, 70, 229, 0.4)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#4f46e5'
                        }
                      }}
                    >
                      <MenuItem value="" sx={{ fontSize: { xs: 13, md: 14 } }}>All Customers</MenuItem>
                      {customers.map((item, index) => (
                        <MenuItem key={index} value={item.CLIENTUNIQUE} sx={{ fontSize: { xs: 13, md: 14 } }}>
                          {item.CLIENTUNIQUE}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </>
            )}

            {/* Action Button */}
            <Button 
              variant="contained" 
              onClick={runSelectedReport} 
              disabled={loading}
              fullWidth
              sx={{ 
                py: { xs: 1.5, md: 1.75 },
                borderRadius: 2.5,
                fontSize: { xs: 15, md: 16 },
                fontWeight: 800,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                boxShadow: '0 6px 20px rgba(79, 70, 229, 0.35)',
                letterSpacing: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4338ca 0%, #0891b2 100%)',
                  boxShadow: '0 8px 28px rgba(79, 70, 229, 0.45)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 100%)',
                  color: 'rgba(0,0,0,0.26)',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </Stack>
        </LocalizationProvider>
      </Box>
      {error && (
        <Box sx={{ 
          p: { xs: 2, md: 2.5 }, 
          m: { xs: 2, md: 2.5 },
          borderRadius: 2.5,
          border: '2px solid #ef4444',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#dc2626', fontSize: { xs: 13, md: 14 }, letterSpacing: 0.3 }}>
            ⚠️ {error}
          </Typography>
        </Box>
      )}
      {data && (
        <ReportViewer response={data} reportTitle={reportTitle} />
      )}
    </Box>
  )
}


