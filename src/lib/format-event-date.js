export const formatEventDate = (
  isoString,
  format = "full",
  isJakartaTime = false,
) => {
  let date = new Date(isoString);

  if (isJakartaTime && isoString && !isoString.endsWith("Z")) {
    date = new Date(isoString + "Z");
  }

  const formats = {
    full: {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Almaty",
    },
    short: {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Almaty",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Almaty",
    },
  };

  // Перевод месяцев на казахский
  const monthsKazakh = {
    January: "Қаңтар",
    February: "Ақпан",
    March: "Наурыз",
    April: "Сәуір",
    May: "Мамыр",
    June: "Маусым",
    July: "Шілде",
    August: "Тамыз",
    September: "Қыркүйек",
    October: "Қазан",
    November: "Қараша",
    December: "Желтоқсан",
  };

  // Перевод дней недели на казахский
  const daysKazakh = {
    Sunday: "Жексенбі",
    Monday: "Дүйсенбі",
    Tuesday: "Сейсенбі",
    Wednesday: "Сәрсенбі",
    Thursday: "Бейсенбі",
    Friday: "Жұма",
    Saturday: "Сенбі",
  };

  // Оставляем en-US как базу, потом подменяем нашими словами
  let formatted = date.toLocaleDateString("en-US", formats[format]);

  if (format === "time") {
    return date.toLocaleTimeString("en-US", formats[format]);
  }

  // Замена английских названий на казахские
  Object.keys(monthsKazakh).forEach((english) => {
    formatted = formatted.replace(english, monthsKazakh[english]);
  });

  Object.keys(daysKazakh).forEach((english) => {
    formatted = formatted.replace(english, daysKazakh[english]);
  });

  if (format === "full") {
    const parts = formatted.split(", ");
    if (parts.length === 2) {
      // Формат: "Сейсенбі, 24 Желтоқсан 2024"
      formatted = `${parts[0]}, ${parts[1]}`;
    }
  }

  return formatted;
};
