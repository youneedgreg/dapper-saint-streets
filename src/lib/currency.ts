// Currency configuration for Kenya Shillings
export const CURRENCY = {
  code: 'KES',
  symbol: 'KSh',
  locale: 'en-KE',
};

export const formatPrice = (amount: number): string => {
  return `${CURRENCY.symbol} ${amount.toLocaleString('en-KE')}`;
};
