export function parsePrice(value: string): number {
  const match = /Price:\s*(?:Rs\.\s*)?(\d+)/i.exec(value);

  if (!match) {
    throw new Error(`Could not parse product price from: "${value}".`);
  }

  return Number(match[1]);
}

export function calculateTotal(prices: readonly number[]): number {
  return prices.reduce((total, price) => total + price, 0);
}
