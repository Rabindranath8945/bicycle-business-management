export const safeNum = (val: any, digits = 2) => {
  const n = Number(val);
  if (isNaN(n)) return (0).toFixed(digits);
  return n.toFixed(digits);
};
