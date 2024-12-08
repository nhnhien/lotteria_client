// format currency
export const formatCurrencyVND = (amount) => {
  if (isNaN(amount)) return '';
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

//format date time
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear(); //
  return `${day}/${month}/${year}`;
};