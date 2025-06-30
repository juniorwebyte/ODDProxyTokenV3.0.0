require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

// Configurações de rede (BSC Mainnet e Testnet)  
const BSC_RPC_URL = // URL do RPC da rede principal
  process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org/'; // URL do RPC da rede principal
const BSC_TESTNET_RPC_URL = // URL do RPC da rede testnet
  process.env.BSC_TESTNET_RPC_URL || // URL do RPC da rede testnet
  'https://data-seed-prebsc-1-s1.binance.org:8545/'; // URL do RPC da rede testnet
const PRIVATE_KEY = process.env.PRIVATE_KEY; // Chave privada do deployer
const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY || PRIVATE_KEY; // Chave privada do deployer para testnet 
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || ''; // API Key do BSCScan

// Validação de chaves privadas
if (!PRIVATE_KEY) {
  console.warn('⚠️  PRIVATE_KEY não encontrada no .env'); // Aviso se a chave privada não for encontrada
}

module.exports = {
  solidity: {
    version: '0.8.20', // Versão do Solidity
    settings: {
      optimizer: {
        enabled: true, // Habilita otimização
        runs: 200, // Número de runs
      },
      // viaIR: true, // Desabilitado para evitar problemas de compatibilidade
    },
  },
  networks: {
    // Rede local para testes
    hardhat: {
      chainId: 31337, // ID da rede
      allowUnlimitedContractSize: true, // Permite contratos ilimitados
      gas: 12000000, // Limite de gas
      blockGasLimit: 12000000, // Limite de gas do bloco
    },
    // BSC Testnet
    bscTestnet: {
      url: BSC_TESTNET_RPC_URL, // URL do RPC da rede testnet
      chainId: 97, // ID da rede
      accounts: [TEST_PRIVATE_KEY].filter(Boolean), // Chave privada do deployer para testnet
      gasPrice: 10000000000, // 10 gwei
      gas: 10000000, // Aumentado para 10M
      timeout: 60000, // Timeout para deploy
    },
    // BSC Mainnet
    bscMainnet: {
      url: BSC_RPC_URL, // URL do RPC da rede principal
      chainId: 56, // ID da rede
      accounts: [PRIVATE_KEY].filter(Boolean), // Chave privada do deployer
      gasPrice: 5000000000, // 5 gwei
      gas: 10000000, // Aumentado para 10M
      timeout: 60000, // Timeout para deploy
    },
  },
  etherscan: {
    apiKey: {
      bsc: BSCSCAN_API_KEY, // API Key do BSCScan
      bscTestnet: BSCSCAN_API_KEY, // API Key do BSCScan
    },
  },
  paths: {
    sources: './contracts', // Caminho para os contratos
    tests: './test', // Caminho para os testes
    cache: './cache', // Caminho para o cache
    artifacts: './artifacts', // Caminho para os artifacts
  },
  mocha: {
    timeout: 40000, // Timeout para testes
  },
  // Configuração para cobertura de testes
  coverage: {
    reporter: ['text', 'lcov', 'html'], // Relatórios de cobertura
    exclude: [
      'test/', // Caminho para os testes
      'scripts/', // Caminho para os scripts
      'node_modules/', // Caminho para os módulos do node
      'coverage/', // Caminho para a cobertura
      'artifacts/', // Caminho para os artifacts
      'cache/', // Caminho para o cache
    ],
  },
};
