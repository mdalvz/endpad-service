
export function generateIdentifier(size: number): string {
  const ALPHABET = '0123456789';
  let result = '';
  for (let i = 0; i < size; ++i) {
    result += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return result;
}

export function generateShortIdentifier(): string {
  return generateIdentifier(6);
}

export function generateLongIdentifier(): string {
  return generateIdentifier(32);
}
