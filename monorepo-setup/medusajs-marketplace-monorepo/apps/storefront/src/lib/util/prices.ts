export function formatAmount({
  amount,
  region,
  includeTaxes = true,
  ...options
}: {
  amount: number
  region: any
  includeTaxes?: boolean
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}) {
  const locale = region?.currency_code === "EUR" ? "de-DE" : "en-US"

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: region?.currency_code || "USD",
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(amount / 100)
}

export function convertToDecimal(amount: number) {
  return Math.floor(amount) / 100
}