export function isSortedAscending(values: string[] | number[]): boolean {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] > values[i + 1]) return false;
  }
  return true;
}

export function isSortedDescending(values: string[] | number[]): boolean {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] < values[i + 1]) return false;
  }
  return true;
}

export function validateSearchResults(values: string[], keyword: string): boolean {
  return values.every(v => v?.toLowerCase().includes(keyword.toLowerCase()));
}