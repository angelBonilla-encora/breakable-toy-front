import dayjs from "dayjs";

export const getDateColor = (date: null | Date) => {
  if (date) {
    const today = dayjs();
    const productExpirationDate = dayjs(date);
    const weeksDiff = productExpirationDate.diff(today, "weeks");

    if (weeksDiff >= 1 && weeksDiff <= 2) return "bg-yellow-100";
    if (weeksDiff > 2) return "bg-green-100";
    return "bg-red-100";
  }
  return "bg-transparent";
};
