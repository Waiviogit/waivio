export const getImpact = impact => {
  if (impact > 0.5 && impact <= 1) return 1;
  if (impact > 1 && impact <= 5) return 5;
  if (impact > 5 && impact <= 10) return 10;
  if (impact > 10 && impact <= 25) return 25;
  if ((impact > 25 && impact <= 49) || impact > 49) return 49;

  return 0.5;
};

export default null;
