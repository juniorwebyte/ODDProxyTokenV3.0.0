const fs = require('fs');
const path = require('path');

async function generateTrustWalletFiles() {
  // Configurações do token (ajuste conforme necessário)
  const tokenInfo = {
    name: 'Tether USD Bridged ZED20',
    symbol: 'USDT.z',
    decimals: 18,
    description:
      'USDT.z Proxy Token with advanced features including fees, pausing, and liquidity management.',
    website: 'https://capitalize.store',
    explorer: 'https://bscscan.com/token/',
    status: 'active',
    social: {
      twitter: 'https://twitter.com/usdtzcapitalize',
      telegram: 'https://t.me/usdtzcapitalize',
      discord: 'https://discord.gg/usdtzcapitalize',
      instagram: 'https://www.instagram.com/usdt.zcapitalize/',
      youtube: 'https://www.youtube.com/@usdtzcapitalize',
      reddit: 'https://www.reddit.com/r/usdtzcapitalize',
      medium: 'https://medium.com/@usdtzcapitalize',
      github: 'https://github.com/oddproxy/oddproxy-token-v3'
    }
  };

  // Criar diretório
  const dirPath = path.join(
    __dirname,
    '..',
    'trustwallet-assets',
    'blockchains',
    'bsc',
    'assets',
    tokenInfo.address
  );
  fs.mkdirSync(dirPath, { recursive: true });

  // Gerar info.json
  const infoJson = {
    name: tokenInfo.name,
    symbol: tokenInfo.symbol,
    type: 'BEP20',
    address: tokenInfo.address,
    ens_address: '',
    decimals: tokenInfo.decimals,
    website: tokenInfo.website,
    logo: {
      src: 'logo.png',
      width: '256',
      height: '256',
      ipfs_hash: ''
    },
    support: {
      email: 'juniorwci70@gmail.com',
      url: tokenInfo.website
    },
    social: {
      blog: '',
      chat: '',
      facebook: 'https://www.facebook.com/profile.php?id=61577170581305',
      forum: '',
      github: tokenInfo.social.github,
      gitter: '',
      instagram: tokenInfo.social.instagram,
      linkedin: '',
      reddit: tokenInfo.social.reddit,
      slack: '',
      telegram: tokenInfo.social.telegram,
      twitter: tokenInfo.social.twitter,
      youtube: tokenInfo.social.youtube
    }
  };

  // Gerar info.md
  const infoMd = `# ${tokenInfo.name}

## ${tokenInfo.symbol}

${tokenInfo.description}

### Links
- Website: ${tokenInfo.website}
- Twitter: ${tokenInfo.social.twitter}
- Telegram: ${tokenInfo.social.telegram}

### Contract
- Address: \`${tokenInfo.address}\`
- Decimals: ${tokenInfo.decimals}
- Type: BEP20

### Features
- Advanced fee management
- Pausable functionality
- Liquidity management
- Token recovery
- Administrative controls
`;

  // Salvar arquivos
  fs.writeFileSync(
    path.join(dirPath, 'info.json'),
    JSON.stringify(infoJson, null, 2)
  );
  fs.writeFileSync(path.join(dirPath, 'info.md'), infoMd);

  console.log('✅ Arquivos gerados com sucesso!');
  console.log(`📁 Diretório: ${dirPath}`);
  console.log('\n📋 Próximos passos:');
  console.log(
    '1. Adicione sua logo como "logo.png" (256x256px, fundo transparente) no diretório criado'
  );
  console.log('2. Ajuste as informações em info.json e info.md se necessário');
  console.log(
    '3. Faça fork do repositório Trust Wallet: https://github.com/trustwallet/assets'
  );
  console.log('4. Adicione os arquivos na pasta blockchains/bsc/assets/');
  console.log('5. Faça um Pull Request para o TrustWallet Assets');
  console.log('\n🔗 Links úteis:');
  console.log('- Trust Wallet Assets: https://github.com/trustwallet/assets');
  console.log(
    '- Tutorial oficial: https://github.com/trustwallet/assets#how-to-submit-a-token'
  );
}

generateTrustWalletFiles()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro:', error);
    process.exit(1);
  });
