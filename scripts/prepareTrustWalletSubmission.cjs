const fs = require('fs-extra');
const path = require('path');

// ======= CONFIGURAÇÕES =======
// Edite conforme seu token
const TOKEN_ADDRESS = '0x73bCB684d3a1F469Bd27226254a94639e501ec3e'; // Original: 0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4
const TOKEN_NAME = 'Tether USD Bridged ZED20';
const TOKEN_SYMBOL = 'USDT.z';
const TOKEN_DECIMALS = 18;
const WEBSITE = 'https://capitalize.store';
const DESCRIPTION =
  'Token proxy do USDT.z na BSC, com liquidez automática e integração Chainlink.';
const LOGO_SOURCE = path.resolve(
  __dirname,
  '../assets/blockchains/bsc/assets/' + TOKEN_ADDRESS + '/logo.png'
);

// ======= DESTINO =======
const DEST_DIR = path.resolve(
  __dirname,
  '../trustwallet-submission/blockchains/bsc/assets/' + TOKEN_ADDRESS
);

// ======= GERA info.json =======
function generateInfoJson() {
  return {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    type: 'ERC20',
    decimals: TOKEN_DECIMALS,
    description: DESCRIPTION,
    website: WEBSITE,
    explorer: 'https://bscscan.com/token/' + TOKEN_ADDRESS,
    status: 'active',
    id: TOKEN_ADDRESS
  };
}

// ======= GERA info.md =======
function generateInfoMd() {
  return `# ${TOKEN_NAME}\n\n- **Símbolo:** ${TOKEN_SYMBOL}\n- **Decimais:** ${TOKEN_DECIMALS}\n- **Endereço:** ${TOKEN_ADDRESS}\n- **Website:** ${WEBSITE}\n\n${DESCRIPTION}\n`;
}

// ======= EXECUÇÃO =======
function main() {
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  // Copia logo
  const logoDest = path.join(DEST_DIR, 'logo.png');
  if (fs.existsSync(LOGO_SOURCE)) {
    fs.copyFileSync(LOGO_SOURCE, logoDest);
    console.log('✅ Logo copiada para:', logoDest);
  } else {
    console.warn('⚠️ Logo não encontrada em:', LOGO_SOURCE);
  }

  // Cria info.json
  const infoJsonPath = path.join(DEST_DIR, 'info.json');
  fs.writeFileSync(infoJsonPath, JSON.stringify(generateInfoJson(), null, 2));
  console.log('✅ info.json criado em:', infoJsonPath);

  // Cria info.md
  const infoMdPath = path.join(DEST_DIR, 'info.md');
  fs.writeFileSync(infoMdPath, generateInfoMd());
  console.log('✅ info.md criado em:', infoMdPath);

  console.log(
    '\nPronto! Agora basta criar um Pull Request para o repositório do TrustWallet:'
  );
  console.log('https://github.com/trustwallet/assets');
  console.log('Inclua a pasta:', DEST_DIR);
}

main();
