const formatCurrency = (value: string | number) => {
  if (!value) return "";
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(".");
};

export default formatCurrency;