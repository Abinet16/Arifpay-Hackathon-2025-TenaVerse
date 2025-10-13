export function totalFromItems(items: { price: number; quantity?: number }[]): number {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Items are required");
  }
  return items.reduce((sum, item) => {
    const qty = item.quantity ?? 1;
    const price = Number(item.price);
    if (Number.isNaN(price)) throw new Error("Invalid price");
    return sum + qty * price;
  }, 0);
}
