import { useMemo, useState } from 'react'
import { Button, Fab, Paper } from '@mui/material'
import { Box, Stack, Typography } from '@mui/material'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import AutoCharts from './charts/AutoCharts'
import SalesReportCharts from './charts/SalesReportCharts'
import PurchaseReportCharts from './charts/PurchaseReportCharts'
import CurrentStockCharts from './charts/CurrentStockCharts'
import PaymentReceivedCharts from './charts/PaymentReceivedCharts'
import PendingPaymentCharts from './charts/PendingPaymentCharts'
import OrderReportCharts from './charts/OrderReportCharts'
import PettyExpenseCharts from './charts/PettyExpenseCharts'
import SundryCreditorsCharts from './charts/SundryCreditorsCharts'
import SundryDebitorsCharts from './charts/SundryDebitorsCharts'
import HRAttendanceCharts from './charts/HRAttendanceCharts'
import DailyActivityCharts from './charts/DailyActivityCharts'
import CollectionByPersonCharts from './charts/CollectionByPersonCharts'
import CollectionByBrandCharts from './charts/CollectionByBrandCharts'
import ExportOptions from './ExportOptions'
import { exportData } from './exportUtils'

// Function to format column names to be more readable
function formatColumnName(key) {
  // Special cases for common abbreviations
  const specialCases = {
    'SRNO': 'Sr. No.',
    'TO_PARTY': 'Customer',
    'CLIENTUNIQUE': 'Client',
    'CLIENT_NAME': 'Client Name',
    'PARTY_NAME': 'Party Name',
    'SELLER_NAME': 'Seller',
    'EMP_CODE': 'Emp Code',
    'EMP_NAME': 'Employee Name',
    'TEMP_ID_CARD_NO': 'ID Card No',
    'TEMPIDCARDNO': 'ID Card No',
    'CONTRACTOR': 'Contractor',
    'NATIONALITY': 'Nationality',
    'GENDER': 'Gender',
    'EMPSTATUS': 'Status',
    'EMP_STATUS': 'Status',
    'DAYS_PRESENT': 'Days Present',
    'WORK_HOUR': 'Work Hours',
    'GROSSVALUE': 'Gross Value',
    'PURCHASEVALUE': 'Purchase Value',
    'TOTALVALUE': 'Total Value',
    'TOTAL_VALUE': 'Total Value',
    'SALEAMOUNT': 'Sale Amount',
    'PAYMENTRECIEVED': 'Payment Received',
    'PENDING_PAYMENT': 'Pending Payment',
    'STOCK_QTY': 'Stock Quantity',
    'STOCK_VAL': 'Stock Value',
    'ORDERUNIT': 'Order Units',
    'ORDERMONTH': 'Order Month',
    'GROSS_AMOUNT': 'Gross Amount',
    'TOTALGST': 'Total GST',
    'GST_TOTAL': 'GST Total',
    'RETURN_TOTAL': 'Return Total',
    'CLOSING_BALANCE': 'Closing Balance',
    'EXPANSE_DATE': 'Expense Date',
    'EXPENSE_TYPE': 'Expense Type',
    'PAYMENT_DATE': 'Payment Date',
    'PURCHASE_TOTAL': 'Purchase Total',
    'BASIC_SALARY': 'Basic Salary',
    'SAL_BASIS': 'Salary Basis',
    'PERDAY': 'Per Day',
    'PERHOUR': 'Per Hour',
    'SALARY_VALUE': 'Salary Value',
    'SALARY_PAID': 'Salary Paid',
    'OLD_ADVANCE': 'Old Advance',
    'SALARY_DUE': 'Salary Due',
    'BALANCE_PAYABLE': 'Balance Payable'
  }
  
  if (specialCases[key]) return specialCases[key]
  
  // Convert SNAKE_CASE or camelCase to Title Case
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim()
}

function ResultTable({ rows, title }) {
  const keys = rows.length ? Object.keys(rows[0] || {}) : []
  const [sort, setSort] = useState({ key: '', dir: 'asc' })

  function toggleSort(columnKey) {
    setSort((prev) => {
      if (prev.key !== columnKey) return { key: columnKey, dir: 'asc' }
      if (prev.dir === 'asc') return { key: columnKey, dir: 'desc' }
      return { key: '', dir: 'asc' }
    })
  }

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows
    const key = sort.key
    const isNumericColumn = rows.some((r) => typeof r[key] === 'number' || /^\d+(\.\d+)?$/.test(String(r[key] ?? '')))
    const rowsCopy = [...rows]
    rowsCopy.sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av == null && bv == null) return 0
      if (av == null) return -1
      if (bv == null) return 1
      if (isNumericColumn) {
        const an = typeof av === 'number' ? av : Number(av)
        const bn = typeof bv === 'number' ? bv : Number(bv)
        return an === bn ? 0 : an < bn ? -1 : 1
      }
      return String(av).localeCompare(String(b))
    })
    if (sort.dir === 'desc') rowsCopy.reverse()
    return rowsCopy
  }, [rows, sort])

  return (
    <Box
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        background: (theme) => theme.palette.background.paper,
        mb: 0
      }}
    >
      {!rows.length ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="text.secondary" sx={{ fontSize: { xs: 12, md: 14 } }}>No data</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            p: { xs: 1.5, md: 2 }, 
            fontWeight: 700, 
            fontSize: { xs: 16, md: 18 },
            color: 'white',
            textAlign: 'center',
            background: '#4f46e5',
            borderBottom: '2px solid #4338ca'
          }}>
            {title}
          </Box>
          <Box sx={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                '& thead th': {
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  background: '#06b6d4',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: 13, md: 15 },
                  borderBottom: '2px solid #0891b2',
                  padding: { xs: '10px 6px', md: '12px 10px' },
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                },
                '& tbody tr:nth-of-type(odd)': {
                  backgroundColor: '#f0f9ff'
                },
                '& tbody tr:nth-of-type(even)': {
                  backgroundColor: '#fff'
                },
                '& tbody tr': {
                  borderBottom: '1px solid #e0e7ff'
                },
                '& th, & td': {
                  borderRight: '1px solid #e0e7ff',
                  padding: { xs: '8px 6px', md: '10px 8px' },
                  fontSize: { xs: 12, md: 14 },
                  fontWeight: 600,
                  lineHeight: 1.4,
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                },
                '& th:last-of-type, & td:last-of-type': { 
                  borderRight: 'none' 
                },
                '& td': {
                  color: '#1e293b'
                },
                '& td[data-numeric="true"]': {
                  color: '#0891b2',
                  fontWeight: 700
                },
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  {keys.map((k) => {
                    const isActive = sort.key === k
                    const arrow = isActive ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''
                    return (
                      <Box
                        key={k}
                        component="th"
                        onClick={() => toggleSort(k)}
                        sx={{
                          cursor: 'pointer',
                          userSelect: 'none',
                          textAlign: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0891b2 0%, #2563eb 100%)',
                          }
                        }}
                      >
                        {`${formatColumnName(k)}${arrow}`}
                      </Box>
                    )
                  })}
                </Box>
              </Box>
              <Box component="tbody">
                {sortedRows.map((row, idx) => (
                  <Box key={idx} component="tr">
                    {keys.map((k) => (
                      <Box
                        key={k}
                        component="td"
                        data-numeric={typeof row[k] === 'number' || /^(hp|qty|sum|total|count|num|cbm|sqm|sqft|value|price|amount)/i.test(k)}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          textAlign: 'center'
                        }}
                      >
                        {(() => {
                          // Format dates
                          if (k.toLowerCase().includes('date') && row[k]) {
                            try {
                              const date = new Date(row[k])
                              if (!isNaN(date.getTime())) {
                                return date.toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })
                              }
                            } catch (e) {
                              // Fallback to original value if date parsing fails
                            }
                          }
                          
                          // Format currency for numbers > 1000 (but exclude ID/code fields)
                          if (typeof row[k] === 'number' && row[k] > 1000 && 
                              !k.toLowerCase().includes('code') && 
                              !k.toLowerCase().includes('id') &&
                              !k.toLowerCase().includes('srno')) {
                            return `₹${row[k].toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          }
                          
                          return String(row[k])
                        })()}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export default function ReportViewer({ response, reportTitle = 'Result' }) {
  const recordsets = response?.recordsets || []
  const first = recordsets[0] || []
  const sectionRefs = useMemo(() => recordsets.map(() => ({ current: null })), [recordsets.length])
  
  // Debug logging
  console.log('ReportViewer Debug:', {
    reportTitle,
    recordsetsLength: recordsets.length,
    hasResponse: !!response,
    firstRecordsetLength: first.length
  })

  // Check if this is a sales report with 4 result sets
  const isSalesReport = recordsets.length === 4 && reportTitle === 'Sales Report'
  // Check if this is a purchase report with 2 result sets
  const isPurchaseReport = recordsets.length === 2 && reportTitle === 'Purchase Report'
  // Check if this is a stock report with 3 result sets
  const isStockReport = recordsets.length === 3 && reportTitle === 'Current Stock Report'
  // Check if this is a payment report with 2 result sets
  const isPaymentReport = recordsets.length === 2 && (reportTitle === 'Payment Received Report' || reportTitle.toLowerCase().includes('payment received'))
  // Check if this is a pending payment report with 1 result set
  const isPendingReport = recordsets.length === 1 && reportTitle === 'Pending Payment Report'
  // Check if this is an order report with 3 result sets
  const isOrderReport = recordsets.length === 3 && reportTitle === 'Order Report'
  // Check if this is a petty expense report with 2 result sets
  const isPettyExpenseReport = recordsets.length === 2 && reportTitle === 'Petty Expense Report'
  // Check if this is a sundry creditors report with 1 result set
  const isCreditorsReport = recordsets.length === 1 && reportTitle === 'Sundry Creditors Report'
  // Check if this is a sundry debitors report with 1 result set
  const isDebitorsReport = recordsets.length === 1 && reportTitle === 'Sundry Debitors Report'
  // Check if this is an HR report with 1 result set
  const isHRReport = recordsets.length === 1 && reportTitle === 'HR Attendance Report'
  // Check if this is a daily activity report with 3 result sets
  const isDailyActivityReport = recordsets.length === 3 && reportTitle === 'Daily Activity Report'

  // Check if this is a collection by person report with 3 result sets
  const isCollectionReport = recordsets.length === 3 && reportTitle === 'Collection by Person Report'

  // Check if this is a collection by brand report with 3 result sets
  const isCollectionBrandReport = recordsets.length === 3 && reportTitle === 'Collection by Brand Wise Report'
  
  // Export state
  const [isExporting, setIsExporting] = useState(false)
  
  // Prepare chart data for export
  const chartData = useMemo(() => {
    if (!response?.recordsets) return []
    
    if (isSalesReport && response.recordsets.length >= 4) {
      const customerData = response.recordsets[2] || []
      const brandData = response.recordsets[3] || []
      
      return [
        {
          name: 'customerUnitsData',
          data: customerData.map(item => ({
            customer: item.TO_PARTY || '',
            units: item.UNITS || 0
          })),
          headers: ['Customer', 'Units']
        },
        {
          name: 'customerRevenueData', 
          data: customerData.map(item => ({
            customer: item.TO_PARTY || '',
            revenue: item.GROSSVALUE || 0
          })),
          headers: ['Customer', 'Revenue']
        },
        {
          name: 'brandUnitsData',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            units: item.UNITS || 0
          })),
          headers: ['Brand', 'Units']
        },
        {
          name: 'brandRevenueData',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            revenue: item.GROSSVALUE || 0
          })),
          headers: ['Brand', 'Revenue']
        }
      ]
    } else if (isPurchaseReport && response.recordsets.length >= 2) {
      const sellerData = response.recordsets[0] || []
      const brandData = response.recordsets[1] || []
      
      return [
        {
          name: 'sellerPurchaseData',
          data: sellerData.map(item => ({
            seller: item.SELLER_NAME || '',
            purchaseValue: item.PURCHASEVALUE || 0,
            totalValue: item.TOTALVALUE || 0
          })),
          headers: ['Seller', 'Purchase Value', 'Total Value']
        },
        {
          name: 'brandPurchaseData',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            purchaseValue: item.PURCHASEVALUE || 0,
            totalValue: item.TOTALVALUE || 0
          })),
          headers: ['Brand', 'Purchase Value', 'Total Value']
        }
      ]
    } else if (isStockReport && response.recordsets.length >= 3) {
      const brandData = response.recordsets[2] || []
      
      return [
        {
          name: 'brandStockQtyData',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            stockQty: item.STOCK_QTY || 0
          })),
          headers: ['Brand', 'Stock Quantity']
        },
        {
          name: 'brandStockValueData',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            stockValue: item.STOCK_VAL || 0
          })),
          headers: ['Brand', 'Stock Value']
        }
      ]
    } else if (isPaymentReport && response.recordsets.length >= 2) {
      const partyData = response.recordsets[1] || []
      
      return [
        {
          name: 'partyPaymentData',
          data: partyData.filter(item => item.PARTY_NAME !== 'GRAND TOTAL ').map(item => ({
            party: item.PARTY_NAME || '',
            amount: item.AMOUNT || 0
          })),
          headers: ['Party', 'Payment Amount']
        },
        {
          name: 'paymentTrendData',
          data: response.recordsets[0]?.map(item => ({
            date: item.PAYMENT_DATE || '',
            amount: item.AMOUNT || 0
          })) || [],
          headers: ['Date', 'Payment Amount']
        }
      ]
    } else if (isPendingReport && response.recordsets.length >= 1) {
      const pendingData = response.recordsets[0] || []
      
      return [
        {
          name: 'pendingPaymentData',
          data: pendingData.map(item => ({
            party: item.PARTY_NAME || '',
            saleAmount: item.SALEAMOUNT || 0,
            paymentReceived: item.PAYMENTRECIEVED || 0,
            pendingPayment: item.PENDING_PAYMENT || 0
          })),
          headers: ['Party', 'Sale Amount', 'Payment Received', 'Pending Payment']
        }
      ]
    } else if (isOrderReport && response.recordsets.length >= 3) {
      const monthData = response.recordsets[0] || []
      const clientData = response.recordsets[1] || []
      const brandData = response.recordsets[2] || []
      
      return [
        {
          name: 'ordersByMonth',
          data: monthData.map(item => ({
            month: item.ORDERMONTH || '',
            units: item.ORDERUNIT || 0,
            totalValue: item.TOTAL_VALUE || 0
          })),
          headers: ['Month', 'Units', 'Total Value']
        },
        {
          name: 'ordersByClient',
          data: clientData.map(item => ({
            client: item.CLIENT_NAME || '',
            units: item.ORDERUNIT || 0,
            totalValue: item.TOTAL_VALUE || 0
          })),
          headers: ['Client', 'Units', 'Total Value']
        },
        {
          name: 'ordersByBrand',
          data: brandData.map(item => ({
            brand: item.BRAND || '',
            units: item.ORDERUNIT || 0,
            totalValue: item.TOTAL_VALUE || 0
          })),
          headers: ['Brand', 'Units', 'Total Value']
        }
      ]
    } else if (isPettyExpenseReport && response.recordsets.length >= 2) {
      const expenseData = response.recordsets[0] || []
      const summaryData = response.recordsets[1] || []
      
      return [
        {
          name: 'expenseItemsData',
          data: expenseData.map(item => ({
            item: item.EXPENSE_TYPE || item.CATEGORY || item.DESCRIPTION || 'Expense',
            date: item.EXPANSE_DATE || '',
            totalValue: item.TOTAL_VALUE || 0
          })),
          headers: ['Item', 'Date', 'Total Value']
        },
        {
          name: 'expenseSummaryData',
          data: summaryData.map(item => ({
            totalValue: item.TOTAL_VALUE || 0
          })),
          headers: ['Total Value']
        }
      ]
    } else if (isCollectionReport && response.recordsets.length >= 3) {
      // Collection by Person Report with 3 recordsets
      const detailedData = response.recordsets[0] || []
      const summaryData = response.recordsets[1] || []
      const detailedByModeData = response.recordsets[2] || []
      
      return [
        {
          name: 'collectionDetailedData',
          data: detailedData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            invoiceNo: item.INVOICE_NO || '',
            amount: item.AMOUNT || 0,
            paymentDate: item.PAYMENT_DATE || '',
            paymentMode: item.PAYMENT_MODE || ''
          })),
          headers: ['Collection By', 'Invoice No', 'Amount', 'Payment Date', 'Payment Mode']
        },
        {
          name: 'collectionSummaryData',
          data: summaryData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            invoiceCount: item.INVOICECOUNT || 0,
            amount: item.AMOUNT || 0
          })),
          headers: ['Collection By', 'Invoice Count', 'Amount']
        },
        {
          name: 'collectionByModeData',
          data: detailedByModeData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            paymentMode: item.PAYMENT_MODE || '',
            paymentDate: item.PAYMENT_DATE || '',
            invoiceCount: item.INVOICECOUNT || 0,
            amount: item.AMOUNT || 0
          })),
          headers: ['Collection By', 'Payment Mode', 'Payment Date', 'Invoice Count', 'Amount']
        }
      ]
    } else if (isCollectionBrandReport && response.recordsets.length >= 3) {
      // Collection by Brand Report with 3 recordsets
      const detailedData = response.recordsets[0] || []
      const summaryData = response.recordsets[1] || []
      const detailedByModeData = response.recordsets[2] || []
      
      return [
        {
          name: 'brandCollectionDetailedData',
          data: detailedData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            invoiceNo: item.INVOICE_NO || '',
            amount: item.AMOUNT || 0,
            paymentDate: item.PAYMENT_DATE || '',
            paymentMode: item.PAYMENT_MODE || ''
          })),
          headers: ['Collection By', 'Invoice No', 'Amount', 'Payment Date', 'Payment Mode']
        },
        {
          name: 'brandCollectionSummaryData',
          data: summaryData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            invoiceCount: item.INVOICECOUNT || 0,
            amount: item.AMOUNT || 0
          })),
          headers: ['Collection By', 'Invoice Count', 'Amount']
        },
        {
          name: 'brandCollectionByModeData',
          data: detailedByModeData.map(item => ({
            collectionBy: item.COLLECTIONBY || '',
            paymentMode: item.PAYMENT_MODE || '',
            paymentDate: item.PAYMENT_DATE || '',
            invoiceCount: item.INVOICECOUNT || 0,
            amount: item.AMOUNT || 0
          })),
          headers: ['Collection By', 'Payment Mode', 'Payment Date', 'Invoice Count', 'Amount']
        }
      ]
    }
    
    return []
  }, [isSalesReport, isPurchaseReport, isStockReport, isPaymentReport, isPendingReport, isOrderReport, isPettyExpenseReport, isCollectionReport, isCollectionBrandReport, response])
  
  const handleExport = async (exportType, exportFormat, includeCharts = false) => {
    setIsExporting(true)
    try {
      const success = await exportData(exportType, exportFormat, response, chartData, reportTitle, includeCharts)
      if (success) {
        console.log('Export completed successfully')
        if (includeCharts) {
          alert('Export completed! Excel file and chart images have been downloaded.')
        }
      } else {
        throw new Error('Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed: ' + error.message)
    } finally {
      setIsExporting(false)
    }
  }

  function scrollToSection(index) {
    const ref = sectionRefs[index]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function scrollToTop() {
    const scrollContainer = document.getElementById('report-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <Stack spacing={0} sx={{ width: '100%', m: 0 }}>
      {/* Custom Charts for Sales Report */}
      {isSalesReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <SalesReportCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Purchase Report */}
      {isPurchaseReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <PurchaseReportCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Stock Report */}
      {isStockReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <CurrentStockCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Payment Report */}
      {isPaymentReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <PaymentReceivedCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Pending Payment Report */}
      {isPendingReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <PendingPaymentCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Order Report */}
      {isOrderReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <OrderReportCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Petty Expense Report */}
      {isPettyExpenseReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <PettyExpenseCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Sundry Creditors Report */}
      {isCreditorsReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <SundryCreditorsCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Sundry Debitors Report */}
      {isDebitorsReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <SundryDebitorsCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for HR Attendance Report */}
      {isHRReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <HRAttendanceCharts data={response} />
        </Box>
      )}
      
      {/* Custom Charts for Daily Activity Report */}
      {isDailyActivityReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <DailyActivityCharts data={response} />
        </Box>
      )}

      {/* Custom Charts for Collection by Person Report */}
      {isCollectionReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <CollectionByPersonCharts data={response} />
        </Box>
      )}

      {/* Custom Charts for Collection by Brand Report */}
      {isCollectionBrandReport && (
        <Box sx={{ position: 'relative', width: '100%', m: 0 }}>
          {/* Export Button - positioned absolutely */}
          <Box sx={{ position: 'absolute', top: { xs: 8, md: 12 }, right: { xs: 8, md: 12 }, zIndex: 10 }}>
            <ExportOptions
              reportData={response}
              chartData={chartData}
              reportTitle={reportTitle}
              isExporting={isExporting}
              onExport={handleExport}
            />
          </Box>
          <CollectionByBrandCharts data={response} />
        </Box>
      )}
      
      {/* Table Navigation */}
      {recordsets.length > 1 && (
        <Box sx={{ 
          p: { xs: 2, md: 2.5 }, 
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)'
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 800, 
            mb: 2, 
            textAlign: 'center',
            color: '#1e293b',
            fontSize: { xs: 14, md: 16 },
            letterSpacing: 0.5
          }}>
            Report Tables
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 2 }, justifyContent: 'center' }}>
            {recordsets.map((_, idx) => {
              const salesTableNames = ['Detailed', 'Invoice', 'Customer', 'Brand']
              const purchaseTableNames = ['Seller', 'Brand']
              const stockTableNames = ['Detailed', 'Summary', 'Brand']
              const paymentTableNames = ['Detailed', 'Party']
              const pendingTableNames = ['Pending']
              const orderTableNames = ['Month', 'Client', 'Brand']
              const pettyExpenseTableNames = ['Detailed', 'Summary']
              const creditorsTableNames = ['Creditors']
              const debitorsTableNames = ['Debitors']
              const collectionTableNames = ['Detailed', 'Summary', 'By Mode']
              const collectionBrandTableNames = ['Detailed', 'Summary', 'By Mode']
              const tableNames = isPurchaseReport ? purchaseTableNames 
                : isStockReport ? stockTableNames 
                : isPaymentReport ? paymentTableNames 
                : isPendingReport ? pendingTableNames 
                : isOrderReport ? orderTableNames
                : isPettyExpenseReport ? pettyExpenseTableNames
                : isCreditorsReport ? creditorsTableNames
                : isDebitorsReport ? debitorsTableNames
                : isCollectionReport ? collectionTableNames
                : isCollectionBrandReport ? collectionBrandTableNames
                : salesTableNames
              return (
              <Button
                key={idx}
                  size="medium"
                  variant="contained"
                onClick={() => scrollToSection(idx)}
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    borderRadius: 2,
                    px: { xs: 2.5, md: 3.5 },
                    py: { xs: 1, md: 1.25 },
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    minWidth: { xs: 90, md: 110 },
                    fontSize: { xs: 13, md: 14 },
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    border: 'none',
                    color: 'white',
                    letterSpacing: 0.3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                      boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {tableNames[idx]}
              </Button>
              )
            })}
          </Box>
        </Box>
      )}

      {/* Tables */}
      {!first.length ? (
        <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="text.secondary" variant="h6">No data available</Typography>
        </Paper>
      ) : (
        recordsets.map((rows, idx) => {
          const salesTableNames = ['Detailed Transactions', 'Invoice Summary', 'Customer Summary', 'Brand Summary']
          const purchaseTableNames = ['Seller Summary', 'Brand Summary']
          const stockTableNames = ['Detailed Stock', 'Summary Stock', 'Brand Summary']
          const paymentTableNames = ['Detailed Payments', 'Party Summary']
          const pendingTableNames = ['Pending Payments Summary']
          const orderTableNames = ['Orders by Month', 'Orders by Client', 'Orders by Brand']
          const collectionTableNames = ['Collection Details', 'Collection Summary', 'Collection by Mode & Date']
          const collectionBrandTableNames = ['Brand Collection Details', 'Brand Collection Summary', 'Brand Collection by Mode & Date']
          const tableNames = isPurchaseReport ? purchaseTableNames : isStockReport ? stockTableNames : isPaymentReport ? paymentTableNames : isPendingReport ? pendingTableNames : isOrderReport ? orderTableNames : isCollectionReport ? collectionTableNames : isCollectionBrandReport ? collectionBrandTableNames : salesTableNames
          const tableTitle = (isSalesReport || isPurchaseReport || isStockReport || isPaymentReport || isPendingReport || isOrderReport || isCollectionReport || isCollectionBrandReport) ? tableNames[idx] : `${reportTitle} ${recordsets.length > 1 ? `(${idx + 1})` : ''}`
          
          return (
          <Box key={idx} ref={(el) => (sectionRefs[idx].current = el)}>
              <ResultTable rows={rows} title={tableTitle} />
          </Box>
          )
        })
      )}
      
      {/* Auto Charts for other reports */}
      {!isSalesReport && !isPurchaseReport && !isStockReport && !isPaymentReport && !isPendingReport && !isOrderReport && !isPettyExpenseReport && !isCreditorsReport && !isDebitorsReport && !isHRReport && !isDailyActivityReport && !isCollectionReport && !isCollectionBrandReport && <AutoCharts rows={first} />}
      
      {/* Scroll to Top Button */}
      <Fab
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          color: 'white',
          boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #7c3aed, #0891b2)',
            boxShadow: '0 12px 32px rgba(139, 92, 246, 0.6)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
        size="medium"
        aria-label="scroll to top"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Stack>
  )
}


