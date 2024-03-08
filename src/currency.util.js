module.exports.formatNumberToCurrency = function formatNumberToCurrency(
  amount
) {
  const val = Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
  return val;
};
