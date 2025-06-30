/**
 * Configurações específicas para cada rede
 * Este arquivo centraliza todas as configurações de rede para evitar inconsistências
 */

const networks = {
  // BSC Testnet
  bscTestnet: {
    name: 'BSC Testnet', // Nome da rede
    chainId: 97, // ID da rede
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/', // URL do RPC da rede
    explorer: 'https://testnet.bscscan.com', // URL do explorer da rede
    nativeCurrency: {
      name: 'tBNB', // Nome da moeda nativa
      symbol: 'tBNB', // Símbolo da moeda nativa
      decimals: 18 // Casas decimais da moeda nativa
    },
    // Endereços específicos da testnet
    addresses: {
      // Token original (MockToken para testnet)
      originalToken: '0x7a420357A01514F705f9a20fa640277BB564147f', // MockToken na testnet
      // Router do PancakeSwap Testnet
      uniswapRouter: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3', // PancakeSwap Router Testnet
      // WBNB Testnet
      wbnb: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', // WBNB Testnet
      // Factory do PancakeSwap Testnet
      uniswapFactory: '0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc', // PancakeSwap Factory Testnet
      // Chainlink Price Feed BNB/USD Testnet (ver docs Chainlink para atualizações)
      priceFeed: '0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7' // BNB/USD Testnet
    },
    // Configurações de gas
    gas: {
      price: '10000000000', // 10 gwei
      limit: 10000000 // Aumentado para 10M
    },
    // Configurações de deploy
    deploy: {
      confirmations: 3, // Confirmations para deploy
      timeout: 60000 // Timeout para deploy
    }
  },

  // BSC Mainnet
  bscMainnet: {
    name: 'BSC Mainnet', // Nome da rede
    chainId: 56, // ID da rede
    rpcUrl: 'https://bsc-dataseed.binance.org/', // URL do RPC da rede
    explorer: 'https://bscscan.com', // URL do explorer da rede
    nativeCurrency: {
      name: 'BNB', // Nome da moeda nativa
      symbol: 'BNB', // Símbolo da moeda nativa
      decimals: 18 // Casas decimais da moeda nativa
    },
    // Endereços específicos da mainnet
    addresses: {
      // Token original (Token real na mainnet)
      originalToken: '0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4', // Coloque aqui o endereço do token original, se houver
      // Router do PancakeSwap Mainnet
      uniswapRouter: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router Mainnet
      // WBNB Mainnet
      wbnb: '0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB Mainnet
      // Factory do PancakeSwap Mainnet
      uniswapFactory: '0xCA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap Factory Mainnet
      // Chainlink Price Feed BNB/USD Mainnet
      priceFeed: '0x0567F2323251f0Aab15c8DfB1967E4e8A7D42aeE' // BNB/USD Mainnet
    },
    // Configurações de gas
    gas: {
      price: '5000000000', // 5 gwei
      limit: 6000000
    },
    // Configurações de deploy
    deploy: {
      confirmations: 5, // Confirmations para deploy
      timeout: 60000 // Timeout para deploy
    }
  },

  // Hardhat (para testes locais)
  hardhat: {
    name: 'Hardhat Local', // Nome da rede
    chainId: 31337, // ID da rede
    rpcUrl: 'http://127.0.0.1:8545', // URL do RPC da rede
    explorer: '', // URL do explorer da rede
    nativeCurrency: {
      name: 'ETH', // Nome da moeda nativa
      symbol: 'ETH', // Símbolo da moeda nativa
      decimals: 18 // Casas decimais da moeda nativa
    },
    // Endereços mock para testes locais
    addresses: {
      originalToken: '0x0000000000000000000000000000000000000000', // Será substituído por mock
      uniswapRouter: '0x0000000000000000000000000000000000000000', // Será substituído por mock
      wbnb: '0x0000000000000000000000000000000000000000', // Será substituído por mock
      uniswapFactory: '0x0000000000000000000000000000000000000000', // Será substituído por mock
      // Chainlink Price Feed para testes locais (mock ou deixe em branco)
      priceFeed: '0x0000000000000000000000000000000000000000' // Será substituído por mock
    },
    gas: {
      price: '20000000000', // 20 gwei
      limit: 12000000 // Limite de gas
    },
    deploy: {
      confirmations: 1, // Confirmations para deploy
      timeout: 40000 // Timeout para deploy
    }
  }
};

/**
 * Obtém a configuração da rede especificada
 * @param {string} networkName - Nome da rede (bscTestnet, bscMainnet, hardhat)
 * @returns {object} Configuração da rede
 *
 * Use esta função para obter todos os parâmetros necessários para scripts e deploys.
 */
function getNetworkConfig(networkName) {
  const config = networks[networkName];
  if (!config) {
    throw new Error(
      `Rede '${networkName}' não encontrada. Redes disponíveis: ${Object.keys(
        networks
      ).join(', ')}`
    );
  }
  return config;
}

/**
 * Valida se a rede especificada é suportada
 * @param {string} networkName - Nome da rede
 * @returns {boolean} True se a rede é suportada
 *
 * Use para checagem rápida antes de executar operações em uma rede.
 */
function isSupportedNetwork(networkName) {
  return networks.hasOwnProperty(networkName);
}

/**
 * Lista todas as redes suportadas
 * @returns {string[]} Array com os nomes das redes
 *
 * Útil para exibir opções de redes disponíveis ao usuário.
 */
function getSupportedNetworks() {
  return Object.keys(networks);
}

module.exports = {
  networks,
  getNetworkConfig,
  isSupportedNetwork,
  getSupportedNetworks
};
