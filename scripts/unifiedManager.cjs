#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');
const { ethers } = hre;
const { formatEther, parseEther, parseUnits, isAddress, ZeroAddress } = require('ethers');
const { getNetworkConfig } = require('../config/networks.cjs');
const fs = require('fs');
const path = require('path');

// ===================== UTILITÁRIOS =====================
function usage() {
  console.log('\nUso: node unifiedManager.cjs <deploy|verify|liquidity> [opções]\n');
  console.log('Exemplos:');
  console.log('  node unifiedManager.cjs deploy');
  console.log('  node unifiedManager.cjs verify');
  console.log('  node unifiedManager.cjs liquidity');
  process.exit(1);
}

// ===================== CONFIGURAÇÃO =====================
const networkName = process.env.HARDHAT_NETWORK || 'bscTestnet';
const networkConfig = getNetworkConfig(networkName);
const deployPath = `deployments/${networkName}/deploy-info.json`;

// ===================== DEPLOY =====================
async function deployProxy() {
  console.log('🚀 DEPLOYANDO CONTRATO PROXY USDT.z');
  const [deployer] = await ethers.getSigners();
  // Parâmetros do construtor
  const originalToken = networkConfig.addresses.originalToken;
  const uniswapRouter = networkConfig.addresses.uniswapRouter;
  const motherWallet = deployer.address;
  const liquidityWallet = deployer.address;
  const priceFeed = networkConfig.addresses.priceFeed;
  const logoURI = '';
  const metadataURI = '';
  // Deploy
  const TeamToken = await ethers.getContractFactory('TeamToken');
  const contract = await TeamToken.deploy(
    originalToken,
    uniswapRouter,
    motherWallet,
    liquidityWallet,
    priceFeed,
    logoURI,
    metadataURI
  );
  await contract.deployed();
  console.log(`✅ Contrato deployado: ${contract.address}`);
  // Salvar informações
  if (!fs.existsSync(`deployments/${networkName}`)) {
    fs.mkdirSync(`deployments/${networkName}`, { recursive: true });
  }
  fs.writeFileSync(deployPath, JSON.stringify({
    network: networkName,
    contractAddress: contract.address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    explorer: `${networkConfig.explorer}/address/${contract.address}`
  }, null, 2));
  console.log(`ℹ️  Informações salvas em: ${deployPath}`);
}

// ===================== VERIFICAÇÃO =====================
async function verifyProxy() {
  if (!fs.existsSync(deployPath)) {
    console.log('❌ Deploy não encontrado. Faça o deploy primeiro.');
    process.exit(1);
  }
  const deployInfo = JSON.parse(fs.readFileSync(deployPath, 'utf8'));
  const proxy = await ethers.getContractAt('TeamToken', deployInfo.contractAddress);
  const [deployer] = await ethers.getSigners();
  console.log(`🔍 Verificando contrato: ${deployInfo.contractAddress}`);
  // Checagens principais
  const originalToken = await proxy.ORIGINAL_TOKEN();
  const router = await proxy.uniswapRouter();
  const motherWallet = await proxy.motherWallet();
  const liquidityWallet = await proxy.liquidityWallet();
  const transferFee = await proxy.transferFee();
  const liquidityFee = await proxy.liquidityFee();
  const owner = await proxy.owner();
  console.log(`   Token Original: ${originalToken}`);
  console.log(`   Router: ${router}`);
  console.log(`   Carteira Mãe: ${motherWallet}`);
  console.log(`   Carteira Liquidez: ${liquidityWallet}`);
  console.log(`   Taxa de Transferência: ${transferFee / 100}%`);
  console.log(`   Taxa de Liquidez: ${liquidityFee}%`);
  console.log(`   Owner: ${owner}`);
  if (owner !== deployer.address) {
    console.log('⚠️  Owner não é o deployer atual!');
  }
  console.log('✅ Verificação concluída.');
}

// ===================== LIQUIDEZ =====================
async function addLiquidity() {
  if (!fs.existsSync(deployPath)) {
    console.log('❌ Deploy não encontrado. Faça o deploy primeiro.');
    process.exit(1);
  }
  const deployInfo = JSON.parse(fs.readFileSync(deployPath, 'utf8'));
  const [deployer] = await ethers.getSigners();
  const proxy = await ethers.getContractAt('TeamToken', deployInfo.contractAddress);
  const routerAddress = networkConfig.addresses.uniswapRouter;
  const router = await ethers.getContractAt('IUniswapV2Router', routerAddress);
  // Parâmetros
  const tokenAmount = parseEther('100000');
  const ethAmount = parseEther('0.1');
  // Aprovar router
  const approveTx = await proxy.approve(routerAddress, tokenAmount);
  await approveTx.wait();
  // Adicionar liquidez
  const addLiquidityTx = await router.addLiquidityETH(
    deployInfo.contractAddress,
    tokenAmount,
    tokenAmount,
    ethAmount,
    deployer.address,
    Math.floor(Date.now() / 1000) + 60 * 20,
    { value: ethAmount }
  );
  await addLiquidityTx.wait();
  console.log('✅ Liquidez adicionada com sucesso!');
}

// ===================== MAIN =====================
(async () => {
  const action = process.argv[2];
  if (!action) usage();
  if (action === 'deploy') await deployProxy();
  else if (action === 'verify') await verifyProxy();
  else if (action === 'liquidity') await addLiquidity();
  else usage();
  process.exit(0);
})(); 