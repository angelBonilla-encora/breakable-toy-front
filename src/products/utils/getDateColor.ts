import dayjs from "dayjs";

export const getDateColor = (date: null | Date) => {
  if (date) {
    const today = dayjs();
    const productExpirationDate = dayjs(date);
    const daysDiff = productExpirationDate.diff(today, "days");

    if (daysDiff > 14) return "bg-green-100"; 
    if (daysDiff >= 7) return "bg-yellow-100"; 
    return "bg-red-100"; 
  }
  return "bg-transparent";
};