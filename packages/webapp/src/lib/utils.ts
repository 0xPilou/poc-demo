import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an Ethereum address for display
 * @param address The Ethereum address to format
 * @returns The formatted address (e.g., 0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a token amount for display
 * @param amount The token amount as a string
 * @param decimals The number of decimals for the token
 * @param displayDecimals The number of decimals to display
 * @returns The formatted token amount
 */
export function formatTokenAmount(
  amount: string,
  decimals: number = 18,
  displayDecimals: number = 4
): string {
  if (!amount) return "0";

  const value = parseFloat(amount) / 10 ** decimals;
  return value.toFixed(displayDecimals);
}

/**
 * Formats a flow rate for display
 * @param flowRate The flow rate in tokens per second
 * @param decimals The number of decimals for the token
 * @returns The formatted flow rate
 */
export function formatFlowRate(
  flowRate: string,
  decimals: number = 18
): string {
  if (!flowRate) return "0";

  const value = parseFloat(flowRate) / 10 ** decimals;

  // Format based on magnitude
  if (value < 0.000001) {
    return `${(value * 3600 * 24 * 30).toFixed(6)} / month`;
  } else if (value < 0.0001) {
    return `${(value * 3600 * 24).toFixed(6)} / day`;
  } else if (value < 0.01) {
    return `${(value * 3600).toFixed(6)} / hour`;
  } else {
    return `${value.toFixed(6)} / second`;
  }
}

/**
 * Truncates a string to a specified length
 * @param str The string to truncate
 * @param maxLength The maximum length of the string
 * @returns The truncated string
 */
export function truncateString(str: string, maxLength: number = 30): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}
