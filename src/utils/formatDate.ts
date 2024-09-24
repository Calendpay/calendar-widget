export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions,
  locale?: string
) {
  const dateFormat = typeof date === "string" ? new Date(date) : date;

  // const language = navigator.language;
  return new Intl.DateTimeFormat(locale, {
    ...options,
  }).format(dateFormat);
}
