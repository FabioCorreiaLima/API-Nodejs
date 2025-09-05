const crypto = require('crypto');
const fs = require('fs');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const accessTokenSecret = generateSecret();
const refreshTokenSecret = generateSecret();

console.log('ACCESS_TOKEN_SECRET=' + accessTokenSecret);
console.log('REFRESH_TOKEN_SECRET=' + refreshTokenSecret);

// Criar ou atualizar arquivo .env
let envContent = '';
if (fs.existsSync('.env')) {
  envContent = fs.readFileSync('.env', 'utf8');
}

// Atualizar as chaves no conteúdo
if (envContent.includes('ACCESS_TOKEN_SECRET=')) {
  envContent = envContent.replace(/ACCESS_TOKEN_SECRET=.*/, `ACCESS_TOKEN_SECRET=${accessTokenSecret}`);
} else {
  envContent += `ACCESS_TOKEN_SECRET=${accessTokenSecret}\n`;
}

if (envContent.includes('REFRESH_TOKEN_SECRET=')) {
  envContent = envContent.replace(/REFRESH_TOKEN_SECRET=.*/, `REFRESH_TOKEN_SECRET=${refreshTokenSecret}`);
} else {
  envContent += `REFRESH_TOKEN_SECRET=${refreshTokenSecret}\n`;
}

// Manter outras variáveis se existirem
if (!envContent.includes('PORT=')) envContent = 'PORT=3000\n' + envContent;
if (!envContent.includes('MONGODB_URI=')) envContent += 'MONGODB_URI=mongodb://localhost:27017/auth-crud-api\n';
if (!envContent.includes('ACCESS_TOKEN_EXPIRY=')) envContent += 'ACCESS_TOKEN_EXPIRY=15m\n';
if (!envContent.includes('REFRESH_TOKEN_EXPIRY=')) envContent += 'REFRESH_TOKEN_EXPIRY=7d\n';

fs.writeFileSync('.env', envContent);
console.log('✅ Arquivo .env criado/atualizado com sucesso!');