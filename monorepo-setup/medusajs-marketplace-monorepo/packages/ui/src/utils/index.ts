// Utility functions for marketplace UI

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency with proper locale
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  // Handle cents to dollars conversion if amount is in cents
  const dollarAmount = amount > 10000 ? amount / 100 : amount;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollarAmount)
}

// Format percentage for commission displays
export function formatPercentage(value: number): string {
  return `${value}%`
}

// Calculate commission amount
export function calculateCommission(amount: number, rate: number): number {
  return amount * (rate / 100)
}

// Format vendor type for display
export function formatVendorType(type: 'shop' | 'brand' | 'distributor'): string {
  const typeMap = {
    shop: 'Shop Partner',
    brand: 'Brand Partner',
    distributor: 'Distributor'
  }
  return typeMap[type] || type
}

// Get commission tier label
export function getCommissionTierLabel(tier: 1 | 2 | 3 | 4): string {
  const tierMap = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold', 
    4: 'Gold+'
  }
  return tierMap[tier] || 'Unknown'
}

// Get commission rate by tier
export function getCommissionRate(tier: 1 | 2 | 3 | 4): number {
  const rateMap = {
    1: 15,
    2: 18,
    3: 22,
    4: 25
  }
  return rateMap[tier] || 15
}
