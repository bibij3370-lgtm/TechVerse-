import { CURRENCY_CONFIG } from '../config/site';
import type { CurrencyCode } from '../types';

export function convertUsd(amountUsd: number, currency: CurrencyCode): number {
  const { rate } = CURRENCY_CONFIG[currency];
  return Math.round(amountUsd * rate * 100) / 100;
}

export function formatPrice(amountUsd: number, currency: CurrencyCode = 'USD'): string {
  const converted = convertUsd(amountUsd, currency);
  const { symbol } = CURRENCY_CONFIG[currency];
  return `${symbol}${converted.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactCount(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return String(value);
}
