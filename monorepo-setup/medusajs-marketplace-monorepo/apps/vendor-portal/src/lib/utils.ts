export function formatCurrency(amount: number, currencyCode: string = 'usd'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  })
  
  // MedusaJS stores prices in cents
  return formatter.format(amount / 100)
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}