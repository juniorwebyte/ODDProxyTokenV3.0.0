const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function submitToTrustWallet() {
  console.log('🚀 Iniciando submissão para o Trust Wallet...\n');

  const tokenAddress = '0x73bCB684d3a1F469Bd27226254a94639e501ec3e';
  const sourceDir = path.join(
    __dirname,
    '..',
    'trustwallet-submission',
    'blockchains',
    'bsc',
    'assets',
    tokenAddress
  );
  const targetDir = path.join(
    __dirname,
    '..',
    'assets',
    'blockchains',
    'bsc',
    'assets',
    tokenAddress
  );

  try {
    // Verificar se a logo existe
    const logoPath = path.join(sourceDir, 'logo.png');
    if (!fs.existsSync(logoPath)) {
      throw new Error(
        '❌ Logo não encontrada! Adicione logo.png no diretório do token.'
      );
    }

    console.log('✅ Logo encontrada!');
    console.log('📁 Copiando arquivos para o repositório Trust Wallet...');

    // Criar diretório de destino se não existir
    fs.mkdirSync(targetDir, { recursive: true });

    // Copiar arquivos
    const files = ['info.json', 'info.md', 'logo.png'];
    files.forEach(file => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`✅ ${file} copiado`);
    });

    console.log('\n📋 Arquivos copiados com sucesso!');
    console.log(`🎯 Token: ${tokenAddress}`);
    console.log(`📁 Diretório: ${targetDir}`);

    // Verificar se estamos no repositório correto
    const gitDir = path.join(__dirname, '..', 'assets', '.git');
    if (!fs.existsSync(gitDir)) {
      console.log('\n⚠️  Repositório Git não encontrado!');
      console.log('📋 Execute os seguintes comandos manualmente:');
      console.log('\n1. Clone seu fork:');
      console.log('   git clone https://github.com/juniorwebyte/assets.git');
      console.log('   cd assets');
      console.log('\n2. Copie os arquivos:');
      console.log(
        `   cp -r ../BTCBRProxyTokenV3/trustwallet-submission/blockchains/bsc/assets/${tokenAddress} blockchains/bsc/assets/`
      );
      console.log('\n3. Commit e Push:');
      console.log('   git add .');
      console.log('   git commit -m "Add BTCBR Proxy Token"');
      console.log('   git push');
      console.log('\n4. Pull Request:');
      console.log('   Vá para https://github.com/juniorwebyte/assets');
      console.log('   Clique em "Pull Request"');
    } else {
      console.log('\n🔄 Executando comandos Git...');

      // Mudar para o diretório do repositório
      process.chdir(path.join(__dirname, '..', 'assets'));

      // Adicionar arquivos
      execSync('git add .', { stdio: 'inherit' });
      console.log('✅ Arquivos adicionados ao Git');

      // Commit
      execSync('git commit -m "Add ODDProxy Token"', { stdio: 'inherit' });
      console.log('✅ Commit realizado');

      // Push
      execSync('git push', { stdio: 'inherit' });
      console.log('✅ Push realizado');

      console.log('\n🎉 Submissão concluída com sucesso!');
      console.log('📋 Próximo passo: Criar Pull Request');
      console.log('🔗 Vá para: https://github.com/juniorwebyte/assets');
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n📋 Execute manualmente:');
    console.log(
      '1. Clone seu fork: git clone https://github.com/juniorwebyte/assets.git'
    );
    console.log('2. Copie os arquivos da pasta trustwallet-submission');
    console.log('3. Commit e Push');
    console.log('4. Crie Pull Request');
  }
}

submitToTrustWallet()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
