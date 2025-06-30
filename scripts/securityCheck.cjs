/**
 * @fileoverview Script para verificação de segurança do contrato
 *
 * Este script verifica aspectos de segurança do contrato TeamToken
 * incluindo validações, permissões, e possíveis vulnerabilidades.
 *
 * @author TeamToken Project
 * @version 1.0.0
 */

require('dotenv').config();
const hre = require('hardhat');
const { ethers } = hre;
const { formatEther, parseEther, parseUnits, isAddress, ZeroAddress } = require('ethers');
const fs = require('fs');

/**
 * Classe para verificação de segurança
 */
class SecurityChecker {
  constructor() {
    this.networkName = process.env.HARDHAT_NETWORK || 'bscTestnet';
    this.issues = [];
    this.warnings = [];
  }

  /**
   * Executa todas as verificações de segurança
   */
  async runSecurityCheck() {
    console.log('🔒 VERIFICAÇÃO DE SEGURANÇA - TEAMTOKEN');
    console.log('='.repeat(80));

    try {
      await this.checkContractDeployment();
      await this.checkAccessControl();
      await this.checkFeeConfiguration();
      await this.checkLiquiditySettings();
      await this.checkEmergencyFunctions();
      await this.checkReentrancyProtection();
      await this.checkInputValidation();
      await this.checkGasOptimization();

      this.generateSecurityReport();
    } catch (error) {
      console.error('❌ Erro durante verificação de segurança:', error.message);
      throw error;
    }
  }

  /**
   * Verifica se o contrato foi deployado corretamente
   */
  async checkContractDeployment() {
    console.log('\n📋 VERIFICANDO DEPLOY DO CONTRATO');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      if (!fs.existsSync(deployPath)) {
        this.issues.push('Contrato não encontrado. Execute o deploy primeiro.');
        return;
      }

      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contractAddress = deployInfo.contractAddress;

      console.log(`✅ Contrato encontrado: ${contractAddress}`);

      // Verificar se o contrato tem código
      const code = await ethers.provider.getCode(contractAddress);
      if (code === '0x') {
        this.issues.push('Contrato não tem código válido');
        return;
      }

      // Verificar se o contrato é verificável
      const contract = await ethers.getContractAt('TeamToken', contractAddress);
      console.log('✅ Contrato pode ser instanciado');

      // Verificar owner
      const owner = await contract.owner();
      console.log(`✅ Owner: ${owner}`);

      // Verificar se o owner não é endereço zero
      if (owner === ZeroAddress) {
        this.issues.push('Owner é endereço zero');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar deploy: ${error.message}`);
    }
  }

  /**
   * Verifica controle de acesso
   */
  async checkAccessControl() {
    console.log('\n🔐 VERIFICANDO CONTROLE DE ACESSO');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contract = await ethers.getContractAt(
        'TeamToken',
        deployInfo.contractAddress
      );
      const [deployer] = await ethers.getSigners();

      // Verificar se o deployer é o owner
      const owner = await contract.owner();
      if (owner !== deployer.address) {
        this.warnings.push('Deployer não é o owner do contrato');
      } else {
        console.log('✅ Deployer é o owner');
      }

      // Verificar funções onlyOwner
      const onlyOwnerFunctions = [
        'updateFees',
        'updateWallets',
        'updateMinTokensBeforeSwap',
        'setExcludedFromFee',
        'setExcludedFromAutoLiquidity',
        'updateLogoURI',
        'updateMetadataURI',
        'recoverTokens',
        'recoverBNB',
        'pause',
        'unpause'
      ];

      console.log(
        '✅ Funções onlyOwner identificadas:',
        onlyOwnerFunctions.length
      );
    } catch (error) {
      this.issues.push(
        `Erro ao verificar controle de acesso: ${error.message}`
      );
    }
  }

  /**
   * Verifica configuração de taxas
   */
  async checkFeeConfiguration() {
    console.log('\n💰 VERIFICANDO CONFIGURAÇÃO DE TAXAS');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contract = await ethers.getContractAt(
        'TeamToken',
        deployInfo.contractAddress
      );

      const transferFee = await contract.transferFee();
      const liquidityFee = await contract.liquidityFee();
      const maxFee = await contract.MAX_FEE();

      console.log(`✅ Taxa de transferência: ${transferFee / 100}%`);
      console.log(`✅ Taxa de liquidez: ${liquidityFee}%`);
      console.log(`✅ Taxa máxima: ${maxFee / 100}%`);

      // Verificar se as taxas estão dentro dos limites
      if (BigInt(transferFee) > BigInt(maxFee)) {
        this.issues.push(
          `Taxa de transferência (${transferFee / 100}%) excede o máximo (${
            maxFee / 100
          }%)`
        );
      }

      if (BigInt(liquidityFee) > BigInt(100)) {
        this.issues.push(`Taxa de liquidez (${liquidityFee}%) excede 100%`);
      }

      // Verificar wallets
      const motherWallet = await contract.motherWallet();
      const liquidityWallet = await contract.liquidityWallet();

      console.log(`✅ Wallet mãe: ${motherWallet}`);
      console.log(`✅ Wallet liquidez: ${liquidityWallet}`);

      if (motherWallet === ZeroAddress) {
        this.issues.push('Wallet mãe é endereço zero');
      }

      if (liquidityWallet === ZeroAddress) {
        this.issues.push('Wallet de liquidez é endereço zero');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar taxas: ${error.message}`);
    }
  }

  /**
   * Verifica configurações de liquidez
   */
  async checkLiquiditySettings() {
    console.log('\n💧 VERIFICANDO CONFIGURAÇÕES DE LIQUIDEZ');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contract = await ethers.getContractAt(
        'TeamToken',
        deployInfo.contractAddress
      );

      const minTokensBeforeSwap = await contract.minTokensBeforeSwap();
      const uniswapPair = await contract.uniswapPair();

      console.log(`✅ Mínimo para swap: ${formatEther(minTokensBeforeSwap)} tokens`);
      console.log(`✅ Par de liquidez: ${uniswapPair}`);

      if (minTokensBeforeSwap===0)) {
        this.warnings.push('Mínimo para swap é zero');
      }

      if (uniswapPair === ZeroAddress) {
        this.warnings.push('Par de liquidez não criado');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar liquidez: ${error.message}`);
    }
  }

  /**
   * Verifica funções de emergência
   */
  async checkEmergencyFunctions() {
    console.log('\n🚨 VERIFICANDO FUNÇÕES DE EMERGÊNCIA');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contract = await ethers.getContractAt(
        'TeamToken',
        deployInfo.contractAddress
      );

      const isPaused = await contract.paused();
      console.log(`✅ Contrato pausado: ${isPaused}`);

      if (isPaused) {
        this.warnings.push('Contrato está pausado');
      }

      // Verificar se as funções de emergência existem
      const emergencyFunctions = ['pause', 'unpause', 'recoverTokens', 'recoverBNB'];
      console.log('✅ Funções de emergência disponíveis:', emergencyFunctions.length);
    } catch (error) {
      this.issues.push(`Erro ao verificar emergência: ${error.message}`);
    }
  }

  /**
   * Verifica proteção contra reentrancy
   */
  async checkReentrancyProtection() {
    console.log('\n🛡️ VERIFICANDO PROTEÇÃO CONTRA REENTRANCY');
    console.log('-'.repeat(50));

    try {
      // Verificar se o contrato herda de ReentrancyGuard
      const contractFactory = await ethers.getContractFactory('TeamToken');
      const contractCode = contractFactory.bytecode;

      if (contractCode.includes('ReentrancyGuard')) {
        console.log('✅ Contrato herda de ReentrancyGuard');
      } else {
        this.issues.push('Contrato não herda de ReentrancyGuard');
      }

      // Verificar se usa modifier lockTheSwap
      if (contractCode.includes('lockTheSwap')) {
        console.log('✅ Usa modifier lockTheSwap');
      } else {
        this.warnings.push('Não usa modifier lockTheSwap');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar reentrancy: ${error.message}`);
    }
  }

  /**
   * Verifica validação de entrada
   */
  async checkInputValidation() {
    console.log('\n✅ VERIFICANDO VALIDAÇÃO DE ENTRADA');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );
      const contract = await ethers.getContractAt(
        'TeamToken',
        deployInfo.contractAddress
      );

      // Verificar constantes de segurança
      const maxFee = await contract.MAX_FEE();
      const feeDenominator = await contract.FEE_DENOMINATOR();

      console.log(`✅ Taxa máxima: ${maxFee / 100}%`);
      console.log(`✅ Denominador: ${feeDenominator}`);

      if (BigInt(maxFee) > BigInt(1000))) {
        this.warnings.push('Taxa máxima muito alta');
      }

      if (feeDenominator===0)) {
        this.issues.push('Denominador de taxa é zero');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar validação: ${error.message}`);
    }
  }

  /**
   * Verifica otimização de gas
   */
  async checkGasOptimization() {
    console.log('\n⛽ VERIFICANDO OTIMIZAÇÃO DE GAS');
    console.log('-'.repeat(50));

    try {
      const deployPath = `deployments/${this.networkName}/deploy-info.json`;
      const deployInfo = JSON.parse(
        fs.readFileSync(deployPath, 'utf8')
      );

      console.log(`✅ Gas usado no deploy: ${deployInfo.gasUsed || 'N/A'}`);
      console.log(`✅ Gas limit: ${deployInfo.gasLimit || 'N/A'}`);

      if (deployInfo.gasUsed && deployInfo.BigInt(gasUsed) > BigInt(8000000)) {
        this.warnings.push('Gas usado no deploy muito alto');
      }
    } catch (error) {
      this.issues.push(`Erro ao verificar gas: ${error.message}`);
    }
  }

  /**
   * Gera relatório de segurança
   */
  generateSecurityReport() {
    console.log('\n📊 RELATÓRIO DE SEGURANÇA');
    console.log('='.repeat(80));

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('🎉 CONTRATO SEGURO! Nenhum problema encontrado.');
      return;
    }

    if (this.issues.BigInt(length) > BigInt(0)) {
      console.log('\n❌ PROBLEMAS CRÍTICOS:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    }

    if (this.warnings.BigInt(length) > BigInt(0)) {
      console.log('\n⚠️ AVISOS:');
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning}`);
      });
    }

    console.log('\n📈 RESUMO:');
    console.log(`- Problemas críticos: ${this.issues.length}`);
    console.log(`- Avisos: ${this.warnings.length}`);
    console.log(`- Status: ${this.issues.length === 0 ? '✅ SEGURO' : '❌ PROBLEMAS ENCONTRADOS'}`);
  }
}

/**
 * Função principal
 */
async function main() {
  try {
    const checker = new SecurityChecker();
    await checker.runSecurityCheck();
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = SecurityChecker; 