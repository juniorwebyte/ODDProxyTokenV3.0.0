# ODDProxyTokenV3 - USDT.z Proxy

## Visão Geral
Este projeto implementa um token proxy (USDT.z) que espelha o saldo do token original, com lógica de taxas, liquidez automática e administração robusta. O deploy, verificação e liquidez são unificados e funcionam para testnet e mainnet.

---

## Lógica de Mirroring (Espelhamento)
- **Saldo de qualquer endereço é atualizado automaticamente em cada transferência.**
- Não depende de mapeamento inicial: qualquer carteira pode receber tokens a qualquer momento.
- O saldo é mantido internamente e atualizado em cada operação.
- O supply total é fixo e igual ao USDT.z original.

---

## Estrutura do Projeto
- `contracts/ODDProxy.sol`: Contrato principal, modular, seguro e comentado.
- `config/networks.cjs`: Parâmetros de rede centralizados (endereços, gas, etc).
- `scripts/unifiedManager.cjs`: Script único para deploy, verificação e liquidez.
- `deployments/`: Informações de deploy por rede.
- `docs/`: Documentação técnica e operacional.

---

## Deploy, Verificação e Liquidez (Unificados)

### Comandos principais

```sh
# Deploy (testnet ou mainnet)
HARDHAT_NETWORK=bscTestnet node scripts/unifiedManager.cjs deploy
HARDHAT_NETWORK=bscMainnet node scripts/unifiedManager.cjs deploy

# Verificação do contrato
HARDHAT_NETWORK=bscTestnet node scripts/unifiedManager.cjs verify
HARDHAT_NETWORK=bscMainnet node scripts/unifiedManager.cjs verify

# Adicionar liquidez inicial
HARDHAT_NETWORK=bscTestnet node scripts/unifiedManager.cjs liquidity
HARDHAT_NETWORK=bscMainnet node scripts/unifiedManager.cjs liquidity
```

- Todos os parâmetros de rede são definidos em `config/networks.cjs`.
- O deploy salva as informações em `deployments/<rede>/deploy-info.json`.

---

## Permissões e Administração
- **Owner**: Pode pausar/despausar, atualizar taxas, wallets, parâmetros e recuperar fundos.
- **Funções administrativas**:
  - `pause()` / `unpause()`
  - `updateFees(uint256, uint256)`
  - `updateWallets(address, address)`
  - `updateMinTokensBeforeSwap(uint256)`
  - `setExcludedFromFee(address, bool)`
  - `setExcludedFromAutoLiquidity(address, bool)`
  - `recoverTokens(address, uint256)`
  - `recoverBNB()`

---

## Checklist de Deploy Seguro
- [ ] Parâmetros de rede revisados em `config/networks.cjs`
- [ ] Deploy realizado com owner seguro
- [ ] Taxas e wallets configuradas
- [ ] Liquidez inicial adicionada
- [ ] Contrato pausado/despausado conforme necessário
- [ ] Verificação do deploy e permissões

---

## Eventos e Funções Principais
- **Eventos**: `FeesUpdated`, `WalletsUpdated`, `MinTokensBeforeSwapUpdated`, `AutoLiquidityTriggered`, `ExcludedFromFee`, `ExcludedFromAutoLiquidity`, `LogoURIUpdated`, `MetadataURIUpdated`, `TokensRecovered`
- **Funções**: `transfer`, `transferFrom`, `approve`, `createLiquidityPair`, `updateFees`, `updateWallets`, `pause`, `unpause`, `recoverTokens`, `recoverBNB`

---

## Segurança e Boas Práticas
- Sempre use wallets seguras para owner e liquidez.
- Teste em testnet antes de mainnet.
- Não compartilhe chaves privadas.
- Use apenas endereços válidos e revisados.
- Pausar o contrato em caso de emergência.

---

## Adicionando Novas Redes
- Edite `config/networks.cjs` e adicione um novo bloco de configuração.
- Use o nome da rede no comando via `HARDHAT_NETWORK`.

---

## Atualização de Supply, Taxas e Wallets
- O supply é fixo e só pode ser alterado em novo deploy.
- Taxas e wallets podem ser atualizadas via funções administrativas.

---

## Fluxo de Uso Resumido
1. Configure a rede em `config/networks.cjs`.
2. Faça o deploy com o script unificado.
3. Verifique o contrato e permissões.
4. Adicione liquidez inicial.
5. Configure taxas e wallets conforme necessário.
6. Use as funções administrativas para manutenção.

---

Dúvidas? Consulte os arquivos em `docs/` ou abra um issue. 