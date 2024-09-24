export function formatPrice(
  price: number | string,
  options: {
    currency?: "PLN" | "USD" | "EUR" | "GBP" | "BDT";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
  locale?: string
) {
  const { currency = "PLN", notation = "compact" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // const language = navigator.language;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}
