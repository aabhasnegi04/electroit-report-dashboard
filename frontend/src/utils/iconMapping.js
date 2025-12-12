import {
  AnimatedDashboardIcon,
  AnimatedTrendingUpIcon,
  AnimatedInventoryIcon,
  AnimatedShoppingCartIcon,
  AnimatedPaymentIcon,
  AnimatedReceiptIcon,
  AnimatedStoreIcon,
  AnimatedAnalyticsIcon,
  AnimatedUserIcon,
  AnimatedSettingsIcon,
  AnimatedReportsIcon,
  AnimatedNotificationIcon,
  AnimatedSearchIcon
} from '../components/AnimatedIcons'

// Icon mapping with color themes for consistent usage across the app
export const iconMap = {
  // Navigation & Core
  dashboard: {
    component: AnimatedDashboardIcon,
    color: '#3b82f6', // Blue
    category: 'navigation'
  },
  
  // Sales & Revenue (Green theme)
  sales: {
    component: AnimatedTrendingUpIcon,
    color: '#10b981', // Emerald
    category: 'sales'
  },
  trending: {
    component: AnimatedTrendingUpIcon,
    color: '#10b981',
    category: 'sales'
  },
  payment: {
    component: AnimatedPaymentIcon,
    color: '#06b6d4', // Cyan
    category: 'sales'
  },
  
  // Inventory (Purple theme)
  inventory: {
    component: AnimatedInventoryIcon,
    color: '#8b5cf6', // Violet
    category: 'inventory'
  },
  stock: {
    component: AnimatedInventoryIcon,
    color: '#8b5cf6',
    category: 'inventory'
  },
  store: {
    component: AnimatedStoreIcon,
    color: '#6366f1', // Indigo
    category: 'inventory'
  },
  
  // Orders & Shopping (Orange theme)
  orders: {
    component: AnimatedShoppingCartIcon,
    color: '#f97316', // Orange
    category: 'orders'
  },
  cart: {
    component: AnimatedShoppingCartIcon,
    color: '#f97316',
    category: 'orders'
  },
  
  // Reports & Analytics (Multi-color/Red theme)
  reports: {
    component: AnimatedReportsIcon,
    color: '#ef4444', // Red
    category: 'reports'
  },
  analytics: {
    component: AnimatedAnalyticsIcon,
    color: '#f59e0b', // Amber
    category: 'reports'
  },
  receipt: {
    component: AnimatedReceiptIcon,
    color: '#ec4899', // Pink
    category: 'reports'
  },
  
  // Users & HR (Cyan theme)
  user: {
    component: AnimatedUserIcon,
    color: '#06b6d4', // Cyan
    category: 'users'
  },
  hr: {
    component: AnimatedUserIcon,
    color: '#06b6d4',
    category: 'users'
  },
  
  // System & Utilities
  settings: {
    component: AnimatedSettingsIcon,
    color: '#6b7280', // Gray
    category: 'system'
  },
  notifications: {
    component: AnimatedNotificationIcon,
    color: '#eab308', // Yellow
    category: 'system'
  },
  search: {
    component: AnimatedSearchIcon,
    color: '#10b981', // Emerald
    category: 'system'
  }
}

// Color themes for different categories
export const colorThemes = {
  navigation: '#3b82f6',    // Blue
  sales: '#10b981',         // Emerald
  inventory: '#8b5cf6',     // Violet
  orders: '#f97316',        // Orange
  reports: '#ef4444',       // Red
  users: '#06b6d4',         // Cyan
  system: '#6b7280'         // Gray
}

// Helper function to get icon component
export const getIcon = (iconName, size = 24) => {
  const iconConfig = iconMap[iconName]
  if (!iconConfig) {
    console.warn(`Icon "${iconName}" not found in iconMap`)
    return null
  }
  
  const IconComponent = iconConfig.component
  return <IconComponent size={size} />
}

// Helper function to get icon color
export const getIconColor = (iconName) => {
  const iconConfig = iconMap[iconName]
  return iconConfig ? iconConfig.color : '#6b7280'
}

// Helper function to get category color
export const getCategoryColor = (category) => {
  return colorThemes[category] || '#6b7280'
}

// Export all available icon names for reference
export const availableIcons = Object.keys(iconMap)

// Usage examples:
// import { getIcon, getIconColor } from '../utils/iconMapping'
// 
// const MyComponent = () => (
//   <div style={{ color: getIconColor('dashboard') }}>
//     {getIcon('dashboard', 32)}
//   </div>
// )