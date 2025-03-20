export const getStockColor = (stock: number) => {
  if (stock > 10) return "default";
  if (stock >= 5 && stock <= 10) return "warning";
  return "danger";
};
