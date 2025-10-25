export function formatCurrency (num) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return formatter.format(num);
}

export function formatNumberWithCommas(value) {
  if (!value) return '';
  const num = parseFloat(value.replace(/,/g, ''));
  if (isNaN(num)) return '';
  
  return num.toLocaleString('en-US');
}