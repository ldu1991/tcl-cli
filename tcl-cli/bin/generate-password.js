export function generatePassword(length = 16, options = {}) {
  const {
          uppercase = true,
          lowercase = true,
          numbers = true,
          symbols = true
        } = options;

  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^_-+=';

  let allChars = '';
  if (uppercase) allChars += upperChars;
  if (lowercase) allChars += lowerChars;
  if (numbers) allChars += numberChars;
  if (symbols) allChars += symbolChars;

  if (!allChars) {
    throw new Error('Please select at least one character type.');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randIndex];
  }

  return password;
}
