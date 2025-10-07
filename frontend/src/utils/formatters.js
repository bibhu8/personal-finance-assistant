export const formatCurrency = (amount) => {
    // Changed locale to 'en-IN' and currency to 'INR'
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  export const formatTransactionAmount = (amount, type) => {
    const sign = type === 'income' ? '+' : '-';
    // This function automatically uses the updated formatCurrency above
    return `${sign}${formatCurrency(Math.abs(amount))}`;
  };