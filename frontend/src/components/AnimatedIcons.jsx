import { Box } from '@mui/material'

// Dashboard Icon - Blue themed with grid animation
export const AnimatedDashboardIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="dashboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <style>
      {`
        .dashboard-rect { 
          animation: dashboardPulse 2.5s ease-in-out infinite;
        }
        .dashboard-center {
          animation: dashboardSpin 4s linear infinite;
          transform-origin: 12px 12px;
        }
        @keyframes dashboardPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes dashboardSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}
    </style>
    <rect className="dashboard-rect" x="2" y="2" width="8" height="8" rx="2" fill="url(#dashboardGrad)" />
    <rect className="dashboard-rect" x="14" y="2" width="8" height="8" rx="2" fill="url(#dashboardGrad)" style={{animationDelay: '0.3s'}} />
    <rect className="dashboard-rect" x="2" y="14" width="8" height="8" rx="2" fill="url(#dashboardGrad)" style={{animationDelay: '0.6s'}} />
    <rect className="dashboard-rect" x="14" y="14" width="8" height="8" rx="2" fill="url(#dashboardGrad)" style={{animationDelay: '0.9s'}} />
    <circle className="dashboard-center" cx="12" cy="12" r="2" fill="#60a5fa" />
  </Box>
)

// Sales/Trending Up Icon - Green themed with money symbols
export const AnimatedTrendingUpIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="salesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <style>
      {`
        .trend-line { 
          stroke-dasharray: 25;
          stroke-dashoffset: 25;
          animation: trendDraw 3s ease-in-out infinite;
        }
        .trend-arrow {
          animation: trendBounce 2s ease-in-out infinite;
        }
        .money-symbol {
          animation: moneyFloat 2.5s ease-in-out infinite;
        }
        @keyframes trendDraw {
          0% { stroke-dashoffset: 25; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -25; }
        }
        @keyframes trendBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.1); }
        }
        @keyframes moneyFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-5px) rotate(10deg); opacity: 1; }
        }
      `}
    </style>
    <path className="trend-line" d="M2 18l6-6 4 4 10-10" stroke="url(#salesGrad)" strokeWidth="3" fill="none" />
    <path className="trend-arrow" d="M18 6l4 0 0 4" stroke="#10b981" strokeWidth="3" fill="none" />
    <circle className="money-symbol" cx="8" cy="12" r="1.5" fill="#34d399" style={{animationDelay: '0.5s'}} />
    <text className="money-symbol" x="8" y="13" textAnchor="middle" fontSize="8" fill="#ffffff" style={{animationDelay: '0.5s'}}>$</text>
    <circle className="money-symbol" cx="16" cy="8" r="1.5" fill="#34d399" style={{animationDelay: '1s'}} />
    <text className="money-symbol" x="16" y="9" textAnchor="middle" fontSize="8" fill="#ffffff" style={{animationDelay: '1s'}}>$</text>
  </Box>
)

// Inventory Icon - Purple themed with 3D box effect
export const AnimatedInventoryIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="inventoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
      <linearGradient id="inventoryTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <style>
      {`
        .inventory-box {
          animation: inventoryFloat 3s ease-in-out infinite;
          transform-origin: center;
        }
        .inventory-lid {
          animation: inventoryLid 4s ease-in-out infinite;
          transform-origin: 12px 9px;
        }
        .inventory-items {
          animation: itemsBounce 2s ease-in-out infinite;
        }
        @keyframes inventoryFloat {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-3px) rotate(1deg); }
        }
        @keyframes inventoryLid {
          0%, 85%, 100% { transform: rotateX(0deg); }
          40% { transform: rotateX(-20deg); }
        }
        @keyframes itemsBounce {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}
    </style>
    {/* 3D Box Effect */}
    <path d="M4 9 L12 5 L20 9 L20 18 L12 22 L4 18 Z" fill="url(#inventoryGrad)" className="inventory-box" />
    <path d="M4 9 L12 5 L20 9 L12 13 Z" fill="url(#inventoryTop)" className="inventory-lid" />
    <path d="M4 9 L4 18 L12 22 L12 13 Z" fill="#6d28d9" className="inventory-box" />
    
    {/* Items inside */}
    <circle className="inventory-items" cx="10" cy="15" r="1" fill="#c4b5fd" style={{animationDelay: '0.2s'}} />
    <circle className="inventory-items" cx="14" cy="16" r="1" fill="#c4b5fd" style={{animationDelay: '0.5s'}} />
    <rect className="inventory-items" x="11" y="17" width="2" height="2" rx="0.5" fill="#c4b5fd" style={{animationDelay: '0.8s'}} />
  </Box>
)

// Shopping Cart Icon - Orange themed with items
export const AnimatedShoppingCartIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <style>
      {`
        .cart-wheel {
          animation: cartRoll 2s linear infinite;
          transform-origin: center;
        }
        .cart-body {
          animation: cartBounce 2.5s ease-in-out infinite;
        }
        .cart-items {
          animation: itemsJiggle 1.8s ease-in-out infinite;
        }
        @keyframes cartRoll {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes cartBounce {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-2px) translateX(1px); }
        }
        @keyframes itemsJiggle {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(1deg); }
          75% { transform: scale(0.95) rotate(-1deg); }
        }
      `}
    </style>
    <path className="cart-body" d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="url(#cartGrad)" strokeWidth="2.5" fill="none" />
    
    {/* Cart Items */}
    <rect className="cart-items" x="8" y="8" width="3" height="3" rx="0.5" fill="#fb923c" style={{animationDelay: '0.2s'}} />
    <circle className="cart-items" cx="14" cy="9" r="1.5" fill="#fdba74" style={{animationDelay: '0.5s'}} />
    <rect className="cart-items" x="16" y="10" width="2" height="2" rx="0.3" fill="#fb923c" style={{animationDelay: '0.8s'}} />
    
    {/* Wheels */}
    <circle className="cart-wheel" cx="9" cy="20" r="1.5" fill="#f97316" />
    <circle className="cart-wheel" cx="9" cy="20" r="0.8" fill="#ffffff" />
    <circle className="cart-wheel" cx="20" cy="20" r="1.5" fill="#f97316" />
    <circle className="cart-wheel" cx="20" cy="20" r="0.8" fill="#ffffff" />
  </Box>
)





// Analytics Icon - Multi-colored bars with sparkles
export const AnimatedAnalyticsIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="bar1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <linearGradient id="bar2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="bar3" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="bar4" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="bar5" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <style>
      {`
        .analytics-bar {
          animation: analyticsGrow 2.5s ease-in-out infinite;
          transform-origin: bottom;
        }
        .sparkle {
          animation: sparkleShine 2s ease-in-out infinite;
        }
        @keyframes analyticsGrow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.3); }
        }
        @keyframes sparkleShine {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}
    </style>
    <rect className="analytics-bar" x="2" y="14" width="3" height="7" rx="1.5" fill="url(#bar1)" style={{animationDelay: '0s'}} />
    <rect className="analytics-bar" x="6" y="10" width="3" height="11" rx="1.5" fill="url(#bar2)" style={{animationDelay: '0.2s'}} />
    <rect className="analytics-bar" x="10" y="6" width="3" height="15" rx="1.5" fill="url(#bar3)" style={{animationDelay: '0.4s'}} />
    <rect className="analytics-bar" x="14" y="12" width="3" height="9" rx="1.5" fill="url(#bar4)" style={{animationDelay: '0.6s'}} />
    <rect className="analytics-bar" x="18" y="8" width="3" height="13" rx="1.5" fill="url(#bar5)" style={{animationDelay: '0.8s'}} />
    
    {/* Sparkles */}
    <circle className="sparkle" cx="4" cy="10" r="0.5" fill="#fbbf24" style={{animationDelay: '1s'}} />
    <circle className="sparkle" cx="12" cy="4" r="0.5" fill="#34d399" style={{animationDelay: '1.3s'}} />
    <circle className="sparkle" cx="20" cy="6" r="0.5" fill="#a78bfa" style={{animationDelay: '1.6s'}} />
  </Box>
)

// Payment Icon - Teal themed with credit card and coins
export const AnimatedPaymentIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <style>
      {`
        .payment-card {
          animation: paymentSlide 3s ease-in-out infinite;
        }
        .payment-coin {
          animation: coinDrop 2.5s ease-in-out infinite;
        }
        .card-chip {
          animation: chipBlink 2s ease-in-out infinite;
        }
        @keyframes paymentSlide {
          0%, 100% { transform: translateX(0) rotateY(0deg); }
          50% { transform: translateX(2px) rotateY(5deg); }
        }
        @keyframes coinDrop {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          50% { transform: translateY(-4px) rotate(180deg); opacity: 1; }
        }
        @keyframes chipBlink {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}
    </style>
    <rect className="payment-card" x="2" y="7" width="18" height="11" rx="2" fill="url(#cardGrad)" />
    <rect x="2" y="11" width="18" height="2" fill="#0e7490" />
    <rect className="card-chip" x="5" y="9" width="3" height="2" rx="0.5" fill="#67e8f9" />
    
    {/* Coins */}
    <circle className="payment-coin" cx="19" cy="5" r="2" fill="#fbbf24" style={{animationDelay: '0.5s'}} />
    <text x="19" y="6" textAnchor="middle" fontSize="8" fill="#ffffff" className="payment-coin" style={{animationDelay: '0.5s'}}>$</text>
    <circle className="payment-coin" cx="21" cy="3" r="1.5" fill="#f59e0b" style={{animationDelay: '1s'}} />
    <text x="21" y="4" textAnchor="middle" fontSize="6" fill="#ffffff" className="payment-coin" style={{animationDelay: '1s'}}>¢</text>
  </Box>
)

// Receipt Icon - Pink themed with animated writing
export const AnimatedReceiptIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="receiptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <style>
      {`
        .receipt-line {
          stroke-dasharray: 8;
          animation: receiptWrite 3s ease-in-out infinite;
        }
        .receipt-paper {
          animation: receiptWave 4s ease-in-out infinite;
        }
        .receipt-total {
          animation: totalGlow 2s ease-in-out infinite;
        }
        @keyframes receiptWrite {
          0% { stroke-dashoffset: 8; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -8; opacity: 0.7; }
        }
        @keyframes receiptWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        @keyframes totalGlow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}
    </style>
    <path className="receipt-paper" d="M5 2v20l1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1 1.5-1 1.5 1V2l-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1z" fill="#fdf2f8" stroke="url(#receiptGrad)" strokeWidth="1.5" />
    
    <path className="receipt-line" d="M8 6h8" stroke="#ec4899" strokeWidth="1.5" style={{animationDelay: '0s'}} />
    <path className="receipt-line" d="M8 9h6" stroke="#ec4899" strokeWidth="1.5" style={{animationDelay: '0.5s'}} />
    <path className="receipt-line" d="M8 12h7" stroke="#ec4899" strokeWidth="1.5" style={{animationDelay: '1s'}} />
    <path className="receipt-line" d="M8 15h5" stroke="#ec4899" strokeWidth="1.5" style={{animationDelay: '1.5s'}} />
    
    <rect className="receipt-total" x="7" y="17" width="10" height="2" rx="1" fill="url(#receiptGrad)" />
    <text x="12" y="18.5" textAnchor="middle" fontSize="8" fill="#ffffff" className="receipt-total">TOTAL</text>
  </Box>
)

// Store Icon - Indigo themed with animated storefront
export const AnimatedStoreIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="storeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <style>
      {`
        .store-door {
          animation: storeDoor 4s ease-in-out infinite;
          transform-origin: 15px 12px;
        }
        .store-sign {
          animation: storeSign 3s ease-in-out infinite;
        }
        .store-window {
          animation: windowGlow 2.5s ease-in-out infinite;
        }
        @keyframes storeDoor {
          0%, 90%, 100% { transform: scaleX(1); }
          45% { transform: scaleX(0.7); }
        }
        @keyframes storeSign {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(3deg) scale(1.05); }
        }
        @keyframes windowGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}
    </style>
    <path d="M3 21h18" stroke="url(#storeGrad)" strokeWidth="2" />
    <path d="M4 21V8l8-4v17" fill="url(#storeGrad)" />
    <path d="M20 21V8l-8-4" stroke="url(#storeGrad)" strokeWidth="2" fill="none" />
    
    {/* Windows */}
    <rect className="store-window" x="6" y="10" width="3" height="3" rx="0.5" fill="#a5b4fc" />
    <rect className="store-window" x="6" y="15" width="3" height="3" rx="0.5" fill="#a5b4fc" style={{animationDelay: '0.3s'}} />
    
    {/* Door */}
    <rect className="store-door" x="15" y="13" width="4" height="8" rx="0.5" fill="#312e81" />
    <circle cx="17.5" cy="17" r="0.3" fill="#fbbf24" />
    
    {/* Sign */}
    <rect className="store-sign" x="6" y="6" width="4" height="2" rx="0.5" fill="#fbbf24" />
    <text x="8" y="7.3" textAnchor="middle" fontSize="6" fill="#1e1b4b" className="store-sign">SHOP</text>
  </Box>
)

// User/HR Icon - Cyan themed with animated profile
export const AnimatedUserIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <style>
      {`
        .user-head {
          animation: userNod 3s ease-in-out infinite;
          transform-origin: 12px 8px;
        }
        .user-body {
          animation: userBreathe 2.5s ease-in-out infinite;
        }
        .user-badge {
          animation: badgePulse 2s ease-in-out infinite;
        }
        @keyframes userNod {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes userBreathe {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.05); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}
    </style>
    <circle className="user-head" cx="12" cy="8" r="4" fill="url(#userGrad)" />
    <path className="user-body" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="url(#userGrad)" />
    <circle className="user-badge" cx="18" cy="6" r="2" fill="#fbbf24" />
    <text x="18" y="7" textAnchor="middle" fontSize="8" fill="#ffffff" className="user-badge">ID</text>
  </Box>
)

// Settings/Config Icon - Gray themed with rotating gears
export const AnimatedSettingsIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>
    <style>
      {`
        .gear-main {
          animation: gearRotate 4s linear infinite;
          transform-origin: 12px 12px;
        }
        .gear-small {
          animation: gearRotateReverse 3s linear infinite;
          transform-origin: 18px 6px;
        }
        @keyframes gearRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gearRotateReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}
    </style>
    <path className="gear-main" d="M12 1L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 1Z" fill="url(#gearGrad)" />
    <circle cx="12" cy="12" r="3" fill="#9ca3af" className="gear-main" />
    <circle cx="18" cy="6" r="2" fill="url(#gearGrad)" className="gear-small" />
    <circle cx="18" cy="6" r="1" fill="#d1d5db" className="gear-small" />
  </Box>
)

// Reports Icon - Red themed with animated document stack
export const AnimatedReportsIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <style>
      {`
        .report-stack {
          animation: reportStack 3s ease-in-out infinite;
        }
        .report-chart {
          animation: chartDraw 2.5s ease-in-out infinite;
        }
        @keyframes reportStack {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes chartDraw {
          0% { stroke-dashoffset: 15; opacity: 0.5; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -15; opacity: 0.5; }
        }
      `}
    </style>
    <rect className="report-stack" x="4" y="4" width="14" height="16" rx="2" fill="url(#reportGrad)" />
    <rect className="report-stack" x="6" y="2" width="14" height="16" rx="2" fill="#fca5a5" style={{animationDelay: '0.2s'}} />
    <rect className="report-stack" x="8" y="6" width="14" height="16" rx="2" fill="#f87171" style={{animationDelay: '0.4s'}} />
    
    {/* Chart lines */}
    <path className="report-chart" d="M10 12l2-2 2 3 3-4" stroke="#ffffff" strokeWidth="2" fill="none" strokeDasharray="15" />
    <circle cx="10" cy="12" r="1" fill="#ffffff" className="report-chart" />
    <circle cx="12" cy="10" r="1" fill="#ffffff" className="report-chart" style={{animationDelay: '0.3s'}} />
    <circle cx="14" cy="13" r="1" fill="#ffffff" className="report-chart" style={{animationDelay: '0.6s'}} />
  </Box>
)

// Notification Icon - Yellow themed with animated bell
export const AnimatedNotificationIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    <style>
      {`
        .bell-body {
          animation: bellRing 2s ease-in-out infinite;
          transform-origin: 12px 4px;
        }
        .bell-waves {
          animation: waveSpread 2s ease-in-out infinite;
        }
        @keyframes bellRing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes waveSpread {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}
    </style>
    <path className="bell-body" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="url(#bellGrad)" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#eab308" strokeWidth="2" fill="none" />
    
    {/* Sound waves */}
    <circle className="bell-waves" cx="12" cy="10" r="8" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.3" />
    <circle className="bell-waves" cx="12" cy="10" r="10" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.2" style={{animationDelay: '0.3s'}} />
    
    {/* Notification dot */}
    <circle cx="18" cy="6" r="3" fill="#dc2626" />
    <text x="18" y="7" textAnchor="middle" fontSize="8" fill="#ffffff">!</text>
  </Box>
)

// Search Icon - Emerald themed with animated magnifier
export const AnimatedSearchIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <style>
      {`
        .search-glass {
          animation: searchMove 3s ease-in-out infinite;
        }
        .search-handle {
          animation: handleRotate 3s ease-in-out infinite;
          transform-origin: 18px 18px;
        }
        .search-sparkle {
          animation: sparkleSearch 2s ease-in-out infinite;
        }
        @keyframes searchMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2px, -2px) scale(1.05); }
        }
        @keyframes handleRotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes sparkleSearch {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}
    </style>
    <circle className="search-glass" cx="11" cy="11" r="8" stroke="url(#searchGrad)" strokeWidth="3" fill="none" />
    <path className="search-handle" d="m21 21-4.35-4.35" stroke="url(#searchGrad)" strokeWidth="3" />
    
    {/* Sparkles inside */}
    <circle className="search-sparkle" cx="9" cy="9" r="0.5" fill="#34d399" style={{animationDelay: '0.2s'}} />
    <circle className="search-sparkle" cx="13" cy="11" r="0.5" fill="#6ee7b7" style={{animationDelay: '0.5s'}} />
    <circle className="search-sparkle" cx="11" cy="13" r="0.5" fill="#34d399" style={{animationDelay: '0.8s'}} />
  </Box>
)

// TODO Icon - Slate themed with animated checklist
export const AnimatedTodoIcon = ({ size = 24 }) => (
  <Box component="svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="todoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#64748b" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
    <style>
      {`
        .todo-clipboard {
          animation: todoFloat 3s ease-in-out infinite;
        }
        .todo-check {
          animation: todoCheck 2.5s ease-in-out infinite;
        }
        .todo-line {
          stroke-dasharray: 8;
          animation: todoWrite 3s ease-in-out infinite;
        }
        .todo-reminder {
          animation: reminderPulse 2s ease-in-out infinite;
        }
        @keyframes todoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes todoCheck {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes todoWrite {
          0% { stroke-dashoffset: 8; opacity: 0.5; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -8; opacity: 0.7; }
        }
        @keyframes reminderPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}
    </style>
    {/* Clipboard */}
    <rect className="todo-clipboard" x="4" y="2" width="16" height="20" rx="2" fill="#f8fafc" stroke="url(#todoGrad)" strokeWidth="2" />
    <rect x="8" y="1" width="8" height="3" rx="1" fill="url(#todoGrad)" />
    
    {/* Checklist items */}
    <circle className="todo-check" cx="7" cy="8" r="1.5" fill="#22c55e" />
    <path d="M6 8l1 1 2-2" stroke="#ffffff" strokeWidth="1.5" fill="none" className="todo-check" />
    <path className="todo-line" d="M11 8h7" stroke="#64748b" strokeWidth="1.5" style={{animationDelay: '0s'}} />
    
    <circle cx="7" cy="12" r="1.5" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
    <path className="todo-line" d="M11 12h7" stroke="#64748b" strokeWidth="1.5" style={{animationDelay: '0.5s'}} />
    
    <circle cx="7" cy="16" r="1.5" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
    <path className="todo-line" d="M11 16h5" stroke="#64748b" strokeWidth="1.5" style={{animationDelay: '1s'}} />
    
    {/* Reminder bell */}
    <circle className="todo-reminder" cx="18" cy="5" r="2" fill="#fbbf24" />
    <path d="M17 4.5c0-.3.2-.5.5-.5h1c.3 0 .5.2.5.5v1c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-1z" fill="#ffffff" className="todo-reminder" />
    <circle cx="18" cy="7.5" r="0.3" fill="#ffffff" className="todo-reminder" />
  </Box>
)