export const inputCurrency = (value) => {
    if (value === null || value === undefined) return "N/A";
    return new Intl.NumberFormat({
        style: "currency",
        currency: "IDR",
    }).format(value);
};
