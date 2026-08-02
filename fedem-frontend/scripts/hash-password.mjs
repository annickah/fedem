import { hash } from 'bcryptjs';

const password = process.argv[2];
const pinMode = process.argv.includes('--pin');
const valid = pinMode ? /^\d{4,8}$/.test(password ?? '') : Boolean(password && password.length >= 12);
if (!valid) {
  console.error(pinMode
    ? 'Usage: node scripts/hash-password.mjs "123456" --pin'
    : 'Usage: node scripts/hash-password.mjs "MOT_DE_PASSE_DE_12_CARACTERES_MINIMUM"');
  process.exit(1);
}

console.log(await hash(password, 12));