/**
 * @fileoverview Exemplo de configuração para deploy
 *
 * Este arquivo mostra como configurar o projeto para deploy
 * tanto na testnet quanto na mainnet.
 *
 * @author TeamToken Project
 * @version 1.0.0
 */

// =============================================================================
// CONFIGURAÇÃO PARA DEPLOY - ODDProxy Token V3
// =============================================================================

/**
 * CONFIGURAÇÃO MÍNIMA NECESSÁRIA
 *
 * Para fazer deploy, você precisa configurar apenas:
 * 1. PRIVATE_KEY no arquivo .env
 * 2. Opcional: BSCSCAN_API_KEY para verificação
 */

// =============================================================================
// 1. CONFIGURAÇÃO DO ARQUIVO .env
// =============================================================================

/*
Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

# =============================================================================
# CONFIGURAÇÕES OBRIGATÓRIAS
# =============================================================================

# Chave privada para mainnet (OBRIGATÓRIO)
PRIVATE_KEY=sua_chave_privada_mainnet_aqui

# =============================================================================
# CONFIGURAÇÕES OPCIONAIS
# =============================================================================

# Chave privada para testnet (usa PRIVATE_KEY se não definida)
TEST_PRIVATE_KEY=sua_chave_privada_testnet_aqui

# API Key do BscScan para verificação de contratos
BSCSCAN_API_KEY=sua_chave_api_bscscan_aqui

# URLs RPC (valores padrão configurados)
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# Carteiras para receber taxas (opcionais)
MOTHER_WALLET=0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4
LIQUIDITY_WALLET=0x2379e7437fF61d72C58c8d56f91D2323DEa58052
*/

// =============================================================================
// 2. CONFIGURAÇÕES DE REDE (config/networks.js)
// =============================================================================

/*
As configurações de rede já estão definidas em config/networks.js:

BSC TESTNET:
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- Explorer: https://testnet.bscscan.com
- Token Original: MockToken (0x7a420357A01514F705f9a20fa640277BB564147f)
- Router: PancakeSwap Testnet (0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3)
- Price Feed: BNB/USD Testnet (0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7)

BSC MAINNET:
- Chain ID: 56
- RPC: https://bsc-dataseed.binance.org/
- Explorer: https://bscscan.com
- Token Original: Token real (0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4)
- Router: PancakeSwap Mainnet (0x10ED43C718714eb63d5aA57B78B54704E256024E)
- Price Feed: BNB/USD Mainnet (0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE)
*/

// =============================================================================
// 3. CONFIGURAÇÕES DO HARDHAT (hardhat.config.js)
// =============================================================================

/*
As configurações do Hardhat já estão definidas:

TESTNET:
- Gas Price: 10 gwei
- Gas Limit: 10M
- Timeout: 60s

MAINNET:
- Gas Price: 5 gwei
- Gas Limit: 10M
- Timeout: 60s
*/

// =============================================================================
// 4. COMANDOS DE DEPLOY
// =============================================================================

/*
COMANDOS PRINCIPAIS:

1. Configuração inicial:
   npm run setup

2. Testes:
   npm run test

3. Compilação:
   npm run compile

4. Deploy na testnet:
   npm run deploy

5. Deploy na mainnet:
   npm run deploy:mainnet

6. Verificação de contratos:
   npm run verify (testnet)
   npm run verify:mainnet (mainnet)

7. Verificação de segurança:
   npm run security:check
*/

// =============================================================================
// 5. EXEMPLOS DE CONFIGURAÇÃO
// =============================================================================

// Exemplo 1: Configuração mínima para testnet
const configTestnetMinimal = {
  // .env
  PRIVATE_KEY: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',

  // Comandos
  commands: [
    'npm run setup',
    'npm run test',
    'npm run compile',
    'npm run deploy'
  ]
};

// Exemplo 2: Configuração completa para mainnet
const configMainnetComplete = {
  // .env
  PRIVATE_KEY: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  BSCSCAN_API_KEY: 'ABC123DEF456GHI789',
  MOTHER_WALLET: '0x0Fcf41A546b2de64aBDc320703dDD657dF802Eb4',
  LIQUIDITY_WALLET: '0x2379e7437fF61d72C58c8d56f91D2323DEa58052',

  // Comandos
  commands: [
    'npm run setup',
    'npm run test',
    'npm run compile',
    'npm run security:check',
    'npm run deploy:mainnet',
    'npm run verify:mainnet'
  ]
};

// =============================================================================
// 6. CHECKLIST DE DEPLOY
// =============================================================================

const deployChecklist = {
  preDeploy: [
    '✅ Dependências instaladas (npm install)',
    '✅ Arquivo .env configurado',
    '✅ PRIVATE_KEY configurada',
    '✅ Saldo suficiente na carteira',
    '✅ Testes passando (npm run test)',
    '✅ Verificação de segurança (npm run security:check)'
  ],

  testnet: [
    '✅ Compilar contratos (npm run compile)',
    '✅ Deploy na testnet (npm run deploy)',
    '✅ Verificar contrato (npm run verify)',
    '✅ Testar funcionalidades (npm run test:testnet)',
    '✅ Configurar liquidez (npm run create:liquidity)'
  ],

  mainnet: [
    '✅ Testes completos na testnet',
    '✅ Deploy na mainnet (npm run deploy:mainnet)',
    '✅ Verificar contrato (npm run verify:mainnet)',
    '✅ Configurar liquidez na mainnet',
    '✅ Mapear saldos dos holders'
  ]
};

// =============================================================================
// 7. TROUBLESHOOTING
// =============================================================================

const troubleshooting = {
  'PRIVATE_KEY não encontrada': 'Configure PRIVATE_KEY no arquivo .env',
  'Saldo insuficiente': 'Adicione BNB/tBNB à carteira',
  'Gas limit exceeded': 'Aumente o gas limit no hardhat.config.js',
  'Network not found': 'Verifique se a rede está configurada',
  'Contract verification failed': 'Configure BSCSCAN_API_KEY no .env'
};

// =============================================================================
// 8. ENDEREÇOS IMPORTANTES
// =============================================================================

const importantAddresses = {
  testnet: {
    mockToken: '0x7a420357A01514F705f9a20fa640277BB564147f',
    pancakeRouter: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
    wbnb: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    priceFeed: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7'
  },

  mainnet: {
    originalToken: '0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4',
    pancakeRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    wbnb: '0xbb4CdB9CBd36B01bD1cBaEF2AF88C6B9364c9a4f',
    priceFeed: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE'
  }
};

// =============================================================================
// 9. PRÓXIMOS PASSOS APÓS DEPLOY
// =============================================================================

const nextSteps = [
  '1. Salvar informações do deploy em deployments/',
  '2. Configurar frontend/dashboard',
  '3. Testar todas as funcionalidades',
  '4. Configurar liquidez no PancakeSwap',
  '5. Mapear saldos dos holders originais',
  '6. Configurar carteiras de taxas',
  '7. Testar sistema de taxas',
  '8. Documentar endereços e configurações',
  '9. Backup das configurações',
  '10. Monitorar contrato após deploy'
];

// Exportar configurações para uso em scripts
module.exports = {
  configTestnetMinimal,
  configMainnetComplete,
  deployChecklist,
  troubleshooting,
  importantAddresses,
  nextSteps
};
