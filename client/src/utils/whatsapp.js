export function getWhatsAppLink(number, message) {
  const cleanNumber = (number || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
}
