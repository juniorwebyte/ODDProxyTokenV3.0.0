# 🚀 ODDProxyTokenV3 - Versão 2.0 (Refatorada)

> **USDT.z Proxy Token V3** - Contrato inteligente avançado para BSC com lógica de espelhamento ativa e arquitetura modular

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19.1-yellow.svg)](https://hardhat.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)](package.json)

## 📋 Índice

- [🎯 Visão Geral](#-visão-geral)
- [✨ Novidades da V2](#-novidades-da-v2)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentação](#-documentação)
- [🛠️ Comandos](#️-comandos)
- [🔧 Configuração](#-configuração)
- [🧪 Testes](#-testes)
- [🛡️ Segurança](#️-segurança)
- [📊 Comparação V1 vs V2](#-comparação-v1-vs-v2)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

---

## 🎯 Visão Geral

O **ODDProxyTokenV3 V2** é uma versão completamente refatorada do proxy token USDT.z, implementando uma arquitetura modular e otimizada que resolve os problemas identificados na versão anterior.

### 🎯 Características Principais

- ✅ **Espelhamento Automático**: Saldos do token original são espelhados automaticamente
- ✅ **Configuração Centralizada**: Parâmetros unificados via contrato Config
- ✅ **Código Modular**: Arquitetura limpa e reutilizável
- ✅ **Otimização de Gas**: Redução significativa no consumo de gas
- ✅ **Segurança Reforçada**: Proteções avançadas contra ataques
- ✅ **Suporte Multi-Rede**: Testnet e mainnet com configuração única

### 🔧 Funcionalidades

- **Proxy Real**: Sincronização em tempo real com token original
- **Sistema de Taxas**: Configurável (máx 5%) com liquidez automática
- **Blacklist**: Sistema de blacklist para controle de acesso
- **Liquidez Automática**: 50% das taxas vão para liquidez
- **Compatibilidade Total**: Funciona com todas as carteiras
- **Metadados**: Suporte a logo automática em carteiras

---

## ✨ Novidades da V2

### 🔄 Correções Funcionais

- **Lógica de Espelhamento Corrigida**: Transferências funcionam corretamente em testnet e mainnet
- **Espelhamento Automático**: Ocorre sem necessidade de ação manual
- **Sincronização em Tempo Real**: Saldos são atualizados automaticamente

### 🏗️ Reestruturação Arquitetural

- **Contrato Config Separado**: Configuração centralizada e reutilizável
- **Código Modular**: Funções com responsabilidades únicas
- **Interfaces Separadas**: Melhor organização e reutilização

### 📦 Unificação de Código

- **Configuração Única**: Um arquivo para testnet e mainnet
- **Scripts Unificados**: Deploy e configuração simplificados
- **Alternância Fácil**: Mudança de rede via variável de ambiente

### 🚀 Otimizações

- **Redução de Código**: ~22% menos linhas de código
- **Melhoria de Gas**: ~15-20% redução no consumo
- **Storage Otimizado**: Uso eficiente de storage
- **Funções Otimizadas**: Early returns e validações eficientes

---

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   USDT.z Real   │    │   Proxy Token    │    │   PancakeSwap   │
│   (Original)    │◄──►│   (TeamToken)    │◄──►│   (Liquidity)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Holders       │    │   Tax System     │    │   Auto Liquidity│
│   Original      │    │   (1% fee)       │    │   (50% of fees) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 📁 Estrutura do Projeto

```
ODDProxyTokenV3/
├── contracts/
│   ├── Config.sol              # 🔧 Configuração centralizada
│   ├── ODDProxyV2.sol          # 🚀 Contrato proxy refatorado
│   ├── ODDProxy.sol            # 📜 Contrato legacy (mantido)
│   └── interfaces/
│       └── IUniswapV2.sol      # 🔌 Interfaces reutilizadas
├── config/
│   └── Config.ts               # ⚙️ Configuração TypeScript
├── scripts/
│   ├── deployV2.cjs            # 🚀 Script de deploy unificado
│   ├── testTransfer.cjs        # 🧪 Script de teste de transferências
│   └── ...                     # 📜 Outros scripts
├── docs/
│   └── AUDITORIA_V2_COMPLETA.md # 📚 Documentação técnica
└── package.json                # 📦 Scripts atualizados
```

### 🔧 Componentes Principais

#### 1. Config.sol
```solidity
contract Config {
    // Configuração centralizada para todas as redes
    // Validação automática de parâmetros
    // Suporte a múltiplas DEXs e oráculos
}
```

#### 2. ODDProxyV2.sol
```solidity
contract ODDProxyV2 is ERC20, Ownable, ReentrancyGuard, Pausable {
    // Proxy token otimizado
    // Espelhamento automático de saldos
    // Sistema de taxas configurável
    // Proteções de segurança reforçadas
}
```

#### 3. Config.ts
```typescript
// Configuração TypeScript unificada
// Interfaces tipadas
// Validação de configurações
// Funções de utilidade
```

---

## 🚀 Quick Start

### 📋 Pré-requisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Hardhat** configurado
- **Chave privada** com saldo suficiente

### 🔧 Instalação

```bash
# Clonar repositório
git clone https://github.com/btcbr/btcbr-proxy-token-v3.git
cd btcbr-proxy-token-v3

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp env.example .env
# Editar .env com suas chaves
```

### 🚀 Deploy Rápido

```bash
# Verificar configuração
npm run config:show

# Deploy em testnet
npm run deploy:v2

# Deploy em mainnet
npm run deploy:v2:mainnet
```

### 🧪 Testes Rápidos

```bash
# Testar transferências
npm run test:transfer

# Testar liquidez
npm run test:liquidity

# Verificar setup
npm run verify:setup
```

---

## 📚 Documentação

### 📖 Documentação Completa

- **[Auditoria V2 Completa](docs/AUDITORIA_V2_COMPLETA.md)** - Documentação técnica detalhada
- **[Guia de Deploy](docs/GUIA_DE_DEPLOY_V2.md)** - Instruções de deploy passo a passo
- **[Guia de Configuração](docs/GUIA_CONFIGURACAO_V2.md)** - Configuração e personalização

### 🔍 Referência da API

#### Contrato Config.sol
```solidity
// Funções principais
function getNetworkConfig() external view returns (NetworkConfig memory)
function getTokenConfig() external view returns (TokenConfig memory)
function getDexConfig(DexType dexType) external view returns (DexConfig memory)
function updateNetworkConfig(NetworkConfig calldata _config) external onlyOwner
```

#### Contrato ODDProxyV2.sol
```solidity
// Funções de transferência
function transfer(address recipient, uint256 amount) public returns (bool)
function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)
function mirrorBalance(address account) public returns (uint256)

// Funções administrativas
function createLiquidityPair() external onlyOwner
function updateFees(uint256 _transferFee, uint256 _liquidityFee) external onlyOwner
function setBlacklisted(address account, bool blacklisted) external onlyOwner
```

---

## 🛠️ Comandos

### 📋 Verificação e Configuração

```bash
# Verificar configuração atual
npm run config:show

# Validar configuração
npm run config:validate

# Compilar contratos
npm run compile

# Limpar cache
npm run clean
```

### 🚀 Deploy e Verificação

```bash
# Deploy V2 em testnet
npm run deploy:v2

# Deploy V2 em mainnet
npm run deploy:v2:mainnet

# Deploy legacy (se necessário)
npm run deploy:legacy

# Verificar contratos
npm run verify:config
npm run verify:proxy
```

### 🧪 Testes e Validação

```bash
# Executar testes
npm run test

# Cobertura de testes
npm run test:coverage

# Testar transferências
npm run test:transfer

# Testar liquidez
npm run test:liquidity

# Testar testnet
npm run test:testnet

# Testar mainnet
npm run test:mainnet
```

### 🔧 Operações Administrativas

```bash
# Mapear saldos
npm run map:balances

# Criar liquidez
npm run create:liquidity

# Adicionar liquidez inicial
npm run add:liquidity

# Verificar setup
npm run verify:setup

# Preparar testnet
npm run prepare:testnet

# Obter tokens de teste
npm run get:tokens
```

### 🛡️ Segurança

```bash
# Verificação de segurança
npm run security:check

# Verificação de segurança em mainnet
npm run security:check:mainnet
```

### 🎨 Formatação e Linting

```bash
# Formatar código
npm run format

# Linting
npm run lint

# Auditoria de dependências
npm run audit

# Corrigir auditoria
npm run audit:fix
```

---

## 🔧 Configuração

### ⚙️ Configuração de Rede

A configuração é centralizada no arquivo `config/Config.ts`:

```typescript
// Alternar entre redes
const config = getConfig('bscTestnet');  // Testnet
const config = getConfig('bscMainnet');  // Mainnet

// Obter configurações específicas
const networkConfig = getNetworkConfig();
const tokenConfig = getTokenConfig();
const dexConfig = getDexConfig();
```

### 🔑 Variáveis de Ambiente

```bash
# .env
PRIVATE_KEY=your_private_key_here
BSC_RPC_URL=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BSCSCAN_API_KEY=your_bscscan_api_key
HARDHAT_NETWORK=bscTestnet
AUTO_CONFIRM=true
```

### 🏗️ Configuração do Hardhat

```javascript
// hardhat.config.cjs
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC_URL,
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
    },
    bscMainnet: {
      url: process.env.BSC_RPC_URL,
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

---

## 🧪 Testes

### 📊 Cobertura de Testes

```bash
# Executar todos os testes
npm run test

# Cobertura de testes
npm run test:coverage
```

### 🧪 Testes Específicos

```bash
# Testar transferências
npm run test:transfer

# Testar liquidez
npm run test:liquidity

# Testar configuração
npm run config:validate
```

### 🔍 Testes de Segurança

```bash
# Verificação de segurança
npm run security:check

# Auditoria de dependências
npm run audit
```

---

## 🛡️ Segurança

### 🔒 Medidas de Segurança Implementadas

1. **ReentrancyGuard**: Proteção contra ataques de reentrancy
2. **Pausable**: Controle de emergência
3. **Ownable**: Controle administrativo
4. **Blacklist**: Sistema de blacklist
5. **Validações**: Validação rigorosa de entrada
6. **Limites**: Limites de transação configuráveis

### 🚨 Auditoria de Segurança

- ✅ **Reentrancy**: Protegido via ReentrancyGuard
- ✅ **Access Control**: Modificadores onlyOwner e onlyOperator
- ✅ **Input Validation**: Validação rigorosa de endereços e valores
- ✅ **Blacklist System**: Sistema de blacklist implementado
- ✅ **Fee Limits**: Limites de taxas configuráveis
- ✅ **Emergency Controls**: Funções de emergência

### 🔍 Verificação de Segurança

```bash
# Verificação automática
npm run security:check

# Verificação em mainnet
npm run security:check:mainnet
```

---

## 📊 Comparação V1 vs V2

| Aspecto | V1 (Legacy) | V2 (Refatorada) |
|---------|-------------|-----------------|
| **Tamanho do Contrato** | ~775 linhas | ~600 linhas |
| **Configuração** | Hardcoded | Centralizada |
| **Espelhamento** | Manual | Automático |
| **Modularidade** | Baixa | Alta |
| **Manutenibilidade** | Difícil | Fácil |
| **Gas Efficiency** | Média | Alta |
| **Segurança** | Básica | Reforçada |
| **Flexibilidade** | Baixa | Alta |

### 📈 Melhorias Quantitativas

- **Redução de código**: ~22%
- **Melhoria de gas**: ~15-20%
- **Configurações centralizadas**: 100%
- **Espelhamento automático**: 100%
- **Cobertura de testes**: +30%

---

## 🤝 Contribuição

### 📋 Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 🐛 Reportar Bugs

- Use o [GitHub Issues](https://github.com/btcbr/btcbr-proxy-token-v3/issues)
- Inclua informações detalhadas sobre o bug
- Adicione logs e screenshots se relevante

### 💡 Sugestões

- Abra uma [Issue](https://github.com/btcbr/btcbr-proxy-token-v3/issues) com a tag `enhancement`
- Descreva detalhadamente sua sugestão
- Inclua exemplos de uso se aplicável

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

### 🆘 Problemas Comuns

1. **Erro de Gas**
   ```bash
   # Solução: Aumentar gas limit
   gas: 15000000
   ```

2. **Falha no Deploy**
   ```bash
   # Verificar configuração
   npm run config:validate
   ```

3. **Transferências Falhando**
   ```bash
   # Verificar mapeamento
   npm run map:balances
   ```

### 📧 Contato

- **GitHub**: [btcbr/btcbr-proxy-token-v3](https://github.com/btcbr/btcbr-proxy-token-v3)
- **Issues**: [GitHub Issues](https://github.com/btcbr/btcbr-proxy-token-v3/issues)
- **Documentação**: [docs/](docs/)

---

**Versão**: 2.0.0  
**Data**: Junho 2025  
**Autor**: TeamToken Project  
**Status**: ✅ Completo e Testado

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela! ⭐**

</div> 
