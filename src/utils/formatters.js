export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatMonthYear = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const getMonthName = (monthKey) => {
  const [year, month] = monthKey.split('-');
  return new Date(year, month - 1).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });
};
