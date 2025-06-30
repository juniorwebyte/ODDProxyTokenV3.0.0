/**
 * @fileoverview Script para configuração rápida do ambiente
 *
 * Este script ajuda a configurar rapidamente o ambiente para deploy
 * verificando e configurando todos os arquivos necessários.
 *
 * @author TeamToken Project
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class SetupConfig {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * Executa o setup completo
   */
  async run() {
    console.log('🚀 CONFIGURAÇÃO RÁPIDA - ODDProxy Token V3');
    console.log('='.repeat(60));

    try {
      await this.checkDependencies();
      await this.checkEnvFile();
      await this.checkConfigFiles();
      await this.validateConfiguration();
      await this.generateSummary();
    } catch (error) {
      console.error('❌ Erro durante configuração:', error.message);
      process.exit(1);
    } finally {
      this.rl.close();
    }
  }

  /**
   * Verifica se as dependências estão instaladas
   */
  async checkDependencies() {
    console.log('\n📦 VERIFICANDO DEPENDÊNCIAS');
    console.log('-'.repeat(40));

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');

    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json não encontrado. Execute este script na raiz do projeto.');
    }

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('⚠️  node_modules não encontrado');
      const install = await this.askQuestion('Deseja instalar as dependências? (y/N): ');
      if (install.toLowerCase() === 'y') {
        console.log('📦 Instalando dependências...');
        const { execSync } = require('child_process');
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependências instaladas com sucesso');
      } else {
        console.log('❌ Execute "npm install" antes de continuar');
        process.exit(1);
      }
    } else {
      console.log('✅ Dependências já instaladas');
    }
  }

  /**
   * Verifica e configura o arquivo .env
   */
  async checkEnvFile() {
    console.log('\n🔐 VERIFICANDO ARQUIVO .env');
    console.log('-'.repeat(40));

    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), 'env.example');

    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        console.log('📄 Criando arquivo .env a partir do exemplo...');
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ Arquivo .env criado');
        console.log('⚠️  IMPORTANTE: Configure suas chaves privadas no arquivo .env');
      } else {
        throw new Error('env.example não encontrado');
      }
    } else {
      console.log('✅ Arquivo .env já existe');
    }

    // Verificar se as chaves obrigatórias estão configuradas
    const envContent = fs.readFileSync(envPath, 'utf8');
    const hasPrivateKey = envContent.includes('PRIVATE_KEY=') && !envContent.includes('PRIVATE_KEY=sua_chave_privada_mainnet_aqui');

    if (!hasPrivateKey) {
      console.log('⚠️  ATENÇÃO: Configure PRIVATE_KEY no arquivo .env');
      console.log('   Exemplo: PRIVATE_KEY=0x1234567890abcdef...');
    } else {
      console.log('✅ PRIVATE_KEY configurada');
    }
  }

  /**
   * Verifica arquivos de configuração
   */
  async checkConfigFiles() {
    console.log('\n⚙️  VERIFICANDO ARQUIVOS DE CONFIGURAÇÃO');
    console.log('-'.repeat(40));

    const configFiles = [
      'hardhat.config.cjs',
      'config/networks.js',
      'package.json'
    ];

    for (const file of configFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} encontrado`);
      } else {
        console.log(`❌ ${file} não encontrado`);
      }
    }
  }

  /**
   * Valida a configuração atual
   */
  async validateConfiguration() {
    console.log('\n🔍 VALIDANDO CONFIGURAÇÃO');
    console.log('-'.repeat(40));

    try {
      // Verificar se o Hardhat consegue carregar a configuração
      const hre = require('hardhat');
const { ethers } = hre;
const { formatEther, parseEther, parseUnits, isAddress, ZeroAddress } = require('ethers');
      const network = await ethers.provider.getNetwork();
      console.log(`✅ Hardhat configurado - Chain ID: ${network.chainId}`);

      // Verificar se o arquivo networks.cjs existe
      const networksPath = path.join(process.cwd(), 'config', 'networks.cjs');
      if (fs.existsSync(networksPath)) {
        console.log('✅ Arquivo config/networks.cjs encontrado');
      } else {
        console.log('❌ Arquivo config/networks.cjs não encontrado');
      }

      console.log('✅ Configuração básica validada com sucesso');

    } catch (error) {
      console.log(`⚠️  Erro ao validar configuração: ${error.message}`);
    }
  }

  /**
   * Gera resumo da configuração
   */
  async generateSummary() {
    console.log('\n📋 RESUMO DA CONFIGURAÇÃO');
    console.log('='.repeat(60));

    console.log('✅ Ambiente configurado com sucesso!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('1. Configure suas chaves privadas no arquivo .env');
    console.log('2. Execute: npm run test');
    console.log('3. Execute: npm run compile');
    console.log('4. Para testnet: npm run deploy');
    console.log('5. Para mainnet: npm run deploy:mainnet');

    console.log('\n🔧 COMANDOS ÚTEIS:');
    console.log('- npm run test          # Executar testes');
    console.log('- npm run compile       # Compilar contratos');
    console.log('- npm run deploy        # Deploy na testnet');
    console.log('- npm run deploy:mainnet # Deploy na mainnet');
    console.log('- npm run verify        # Verificar contrato na testnet');
    console.log('- npm run security:check # Verificar segurança');

    console.log('\n📚 DOCUMENTAÇÃO:');
    console.log('- GUIA_CONFIGURACAO_DEPLOY.md');
    console.log('- README.md');
    console.log('- docs/');

    console.log('\n⚠️  IMPORTANTE:');
    console.log('- Sempre teste na testnet antes da mainnet');
    console.log('- Mantenha suas chaves privadas seguras');
    console.log('- Verifique os contratos no BscScan após deploy');
  }

  /**
   * Faz uma pergunta ao usuário
   */
  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
}

/**
 * Função principal
 */
async function main() {
  try {
    const setup = new SetupConfig();
    await setup.run();
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

module.exports = SetupConfig; 