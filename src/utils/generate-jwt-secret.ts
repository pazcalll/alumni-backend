import fs from 'fs';
import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(64).toString('hex');
fs.writeFileSync('.env', `JWT_SECRET=${jwtSecret}\n`, { flag: 'a' });

console.log('JWT_SECRET generated successfully');