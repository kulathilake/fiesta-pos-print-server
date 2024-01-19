module.exports.formatNumberToCurrency = function formatNumberToCurrency(amount) {
    return Intl.NumberFormat().format(amount)
}