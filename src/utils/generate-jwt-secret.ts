import fs from 'fs';
import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(64).toString('hex');
const envVariables = fs.readFileSync('.env', 'utf8').split('\n');

const updatedVariables = envVariables.map(line => {
    if (line.startsWith('JWT_SECRET=')) {
        return `JWT_SECRET=${jwtSecret}`;
    }
    return line;
});

fs.writeFileSync('.env', updatedVariables.join('\n'));


console.log('JWT_SECRET generated successfully');