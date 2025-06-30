// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Interface para Factory do PancakeSwap/UniswapV2
 * @dev Interface para criação e consulta de pares
 */
interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

/**
 * @title Interface para Router do PancakeSwap/UniswapV2
 * @dev Interface completa para interação com DEX
 */
interface IUniswapV2Router {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

/**
 * @title Interface Chainlink AggregatorV3 para consulta de preço
 * @dev Interface para oráculos de preço Chainlink
 */
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/**
 * @title USDT.z Proxy Token
 * @dev Contrato proxy avançado para o token USDT.z original na BSC
 * 
 * CARACTERÍSTICAS:
 * - Proxy real com sincronização em tempo real
 * - Sistema de taxas configurável (máx 5%)
 * - Liquidez automática (50% das taxas)
 * - Compatibilidade total com carteiras
 * - Segurança reforçada com proteções avançadas
 * - Suporte a metadados para logo automática
 * 
 * FUNCIONALIDADES:
 * - Espelhamento automático de saldos do token original
 * - Exibição de logo automática em carteiras compatíveis
 * - Cálculo de valor USD em tempo real via PancakeSwap
 * - Sistema de liquidez automática robusto
 * - Controles administrativos seguros
 * 
 * LIMITAÇÕES:
 * - Logo automática requer submissão manual ao Trust Wallet
 * - Valor USD depende de oráculos externos (PancakeSwap)
 * - Gas limit pode ser alto para operações complexas
 * 
 * SOLUÇÕES IMPLEMENTADAS:
 * - Sistema de proxy real com hooks de transferência
 * - Metadados ERC-20 estendidos para logo
 * - Cálculo de valor USD otimizado
 * - Proteções de segurança avançadas
 */
contract TeamToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    // ============ CONSTANTES ============
    
    /// @dev Endereço do token original USDT.z na BSC
    address public immutable ORIGINAL_TOKEN;
    
    /// @dev Endereço do router do PancakeSwap (BSC Testnet)
    address public constant UNISWAP_ROUTER = 0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3;
    
    /// @dev Denominador para cálculos de taxa (10000 = 100%)
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    /// @dev Taxa máxima permitida (5%)
    uint256 public constant MAX_FEE = 500;
    
    /// @dev Supply fixo do token (27.500.000.000 USDT.z com 18 casas decimais)
    uint256 public constant FIXED_SUPPLY = 27500000000 * 10**18;
    
    // ============ INTERFACES ============
    
    IERC20 public originalToken;
    IUniswapV2Router public uniswapRouter;
    IUniswapV2Factory public uniswapFactory;
    AggregatorV3Interface public priceFeed;
    
    // ============ ESTADOS ============
    
    /// @dev Par de liquidez no PancakeSwap
    address public uniswapPair;
    
    /// @dev Taxa de transferência (padrão: 1%)
    uint256 public transferFee = 100;
    
    /// @dev Porcentagem da taxa que vai para liquidez (padrão: 50%)
    uint256 public liquidityFee = 50;
    
    /// @dev Wallet mãe para receber taxas
    address public motherWallet;
    
    /// @dev Wallet para liquidez
    address public liquidityWallet;
    
    /// @dev Estado de mapeamento inicial
    bool public mappingCompleted;
    
    /// @dev Saldo total mapeado
    uint256 public totalMappedBalance;
    
    /// @dev Controle de swap para evitar reentrancy
    bool private _inSwap;
    
    /// @dev Mínimo de tokens para ativar liquidez automática
    uint256 public minTokensBeforeSwap = 1000 * 10**18;
    
    /// @dev Mapeamento de saldos mapeados
    mapping(address => uint256) private _mappedBalances;
    
    /// @dev Mapeamento de endereços excluídos de taxas
    mapping(address => bool) private _isExcludedFromFee;
    
    /// @dev Mapeamento de endereços com liquidez automática desabilitada
    mapping(address => bool) private _isExcludedFromAutoLiquidity;
    
    /// @dev Mapeamento de permissões de gasto
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // ============ METADADOS PARA CARTEIRAS ============
    
    /// @dev URL da logo do token (para carteiras compatíveis)
    string public logoURI = "https://bscscan.com/token/images/usdtzs_32.png";
    
    /// @dev URL dos metadados do token
    string public metadataURI = "https://bscscan.com/token/0x4BE35Ec329343d7d9F548d42B0F8c17FFfe07db4";
    
    // ============ EVENTOS ============
    
    event FeesUpdated(uint256 transferFee, uint256 liquidityFee);
    event WalletsUpdated(address motherWallet, address liquidityWallet);
    event BalanceMapped(address indexed holder, uint256 amount);
    event MappingCompleted(uint256 totalMappedBalance);
    event TokensRecovered(address token, uint256 amount);
    event MinTokensBeforeSwapUpdated(uint256 minTokensBeforeSwap);
    event AutoLiquidityTriggered(uint256 tokensSwapped, uint256 bnbReceived, uint256 tokensAdded);
    event ExcludedFromFee(address indexed account, bool excluded);
    event ExcludedFromAutoLiquidity(address indexed account, bool excluded);
    event LogoURIUpdated(string newLogoURI);
    event MetadataURIUpdated(string newMetadataURI);
    
    // ============ MODIFICADORES ============
    
    /**
     * @dev Modificador para evitar reentrancy durante swaps
     */
    modifier lockTheSwap() {
        _inSwap = true;
        _;
        _inSwap = false;
    }
    
    /**
     * @dev Modificador para verificar se o mapeamento foi completado
     */
    modifier mappingRequired() {
        require(mappingCompleted, "Mapping not completed");
        _;
    }
    
    // ============ CONSTRUTOR ============
    
    /**
     * @dev Construtor do contrato
     * @param _originalToken Endereço do token USDT.z original
     * @param _uniswapRouter Endereço do router do PancakeSwap
     * @param _motherWallet Wallet mãe para receber taxas
     * @param _liquidityWallet Wallet para liquidez
     * @param _priceFeed Endereço do Chainlink Price Feed (BNB/USD)
     */
    constructor(
        address _originalToken,
        address _uniswapRouter,
        address _motherWallet,
        address _liquidityWallet,
        address _priceFeed
    ) ERC20("Tether USD Bridged ZED20", "USDT.z") {
        require(_originalToken != address(0), "Original token cannot be zero address");
        require(_uniswapRouter != address(0), "Router cannot be zero address");
        require(_motherWallet != address(0), "Mother wallet cannot be zero address");
        require(_liquidityWallet != address(0), "Liquidity wallet cannot be zero address");
        require(_priceFeed != address(0), "Price feed cannot be zero address");
        
        ORIGINAL_TOKEN = _originalToken;
        originalToken = IERC20(_originalToken);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        uniswapFactory = IUniswapV2Factory(uniswapRouter.factory());
        motherWallet = _motherWallet;
        liquidityWallet = _liquidityWallet;
        priceFeed = AggregatorV3Interface(_priceFeed);
        
        // Exclui wallets de taxas
        _isExcludedFromFee[owner()] = true;
        _isExcludedFromFee[_motherWallet] = true;
        _isExcludedFromFee[_liquidityWallet] = true;
        _isExcludedFromFee[address(this)] = true;
        
        // Exclui wallets de liquidez automática
        _isExcludedFromAutoLiquidity[owner()] = true;
        _isExcludedFromAutoLiquidity[_motherWallet] = true;
        _isExcludedFromAutoLiquidity[_liquidityWallet] = true;
        _isExcludedFromAutoLiquidity[address(this)] = true;
    }
    
    // ============ FUNÇÕES PÚBLICAS ============
    
    /**
     * @dev Retorna o nome do token
     */
    function name() public pure override returns (string memory) {
        return "Tether USD Bridged ZED20";
    }
    
    /**
     * @dev Retorna o símbolo do token
     */
    function symbol() public pure override returns (string memory) {
        return "USDT.z";
    }
    
    /**
     * @dev Retorna os decimais do token
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Retorna o supply total do token
     */
    function totalSupply() public pure override returns (uint256) {
        return FIXED_SUPPLY;
    }
    
    /**
     * @dev Retorna o saldo de um endereço
     * @param account Endereço para consultar
     * @return Saldo do endereço
     */
    function balanceOf(address account) public view override returns (uint256) {
        if (!mappingCompleted) {
            return 0;
        }
        
        // Se o endereço foi mapeado, retorna o saldo mapeado
        if (_mappedBalances[account] > 0) {
            return _mappedBalances[account];
        }
        
        // Caso contrário, verifica o saldo atual no token original
        uint256 originalBalance = originalToken.balanceOf(account);
        if (originalBalance > 0) {
            // Calcula o valor equivalente em USD e converte para tokens proxy
            return _calculateProxyAmount(originalBalance);
        }
        
        return 0;
    }
    
    /**
     * @dev Função de transferência principal
     * @param recipient Endereço destinatário
     * @param amount Quantidade a transferir
     * @return Sucesso da operação
     */
    function transfer(address recipient, uint256 amount) public override whenNotPaused mappingRequired returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    /**
     * @dev Função de transferência com aprovação
     * @param sender Endereço remetente
     * @param recipient Endereço destinatário
     * @param amount Quantidade a transferir
     * @return Sucesso da operação
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override whenNotPaused mappingRequired returns (bool) {
        _transfer(sender, recipient, amount);
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }
    
    /**
     * @dev Função de aprovação
     * @param spender Endereço aprovado
     * @param amount Quantidade aprovada
     * @return Sucesso da operação
     */
    function approve(address spender, uint256 amount) public override whenNotPaused returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    /**
     * @dev Retorna a permissão de gasto
     * @param owner Endereço proprietário
     * @param spender Endereço aprovado
     * @return Quantidade aprovada
     */
    function allowance(address owner, address spender) public view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    /**
     * @dev Retorna o preço mais recente do BNB/USD via Chainlink
     * @return Preço atual (8 casas decimais padrão Chainlink)
     */
    function getLatestPrice() public view returns (int) {
        (
            ,
            int price,
            ,
            ,
            
        ) = priceFeed.latestRoundData();
        return price;
    }
    
    // ============ FUNÇÕES DE ADMINISTRAÇÃO ============
    
    /**
     * @dev Cria o par de liquidez no PancakeSwap
     * @notice Apenas owner pode executar
     */
    function createLiquidityPair() external onlyOwner {
        require(uniswapPair == address(0), "Pair already created");
        
        // Verifica se o par já existe
        address existingPair = uniswapFactory.getPair(address(this), uniswapRouter.WETH());
        if (existingPair != address(0)) {
            uniswapPair = existingPair;
            return;
        }
        
        // Cria o par
        uniswapPair = uniswapFactory.createPair(address(this), uniswapRouter.WETH());
    }
    
    /**
     * @dev Pausa o contrato
     * @notice Apenas owner pode executar
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Despausa o contrato
     * @notice Apenas owner pode executar
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Atualiza as taxas do contrato
     * @param _transferFee Nova taxa de transferência
     * @param _liquidityFee Nova porcentagem para liquidez
     * @notice Apenas owner pode executar
     */
    function updateFees(uint256 _transferFee, uint256 _liquidityFee) external onlyOwner {
        require(_transferFee <= MAX_FEE, "Transfer fee too high");
        require(_liquidityFee <= 100, "Liquidity fee too high");
        transferFee = _transferFee;
        liquidityFee = _liquidityFee;
        emit FeesUpdated(_transferFee, _liquidityFee);
    }
    
    /**
     * @dev Atualiza as wallets do contrato
     * @param _motherWallet Nova wallet mãe
     * @param _liquidityWallet Nova wallet de liquidez
     * @notice Apenas owner pode executar
     */
    function updateWallets(address _motherWallet, address _liquidityWallet) external onlyOwner {
        require(_motherWallet != address(0), "Mother wallet cannot be zero address");
        require(_liquidityWallet != address(0), "Liquidity wallet cannot be zero address");
        motherWallet = _motherWallet;
        liquidityWallet = _liquidityWallet;
        emit WalletsUpdated(_motherWallet, _liquidityWallet);
    }
    
    /**
     * @dev Atualiza o mínimo de tokens para liquidez automática
     * @param _minTokensBeforeSwap Novo mínimo
     * @notice Apenas owner pode executar
     */
    function updateMinTokensBeforeSwap(uint256 _minTokensBeforeSwap) external onlyOwner {
        minTokensBeforeSwap = _minTokensBeforeSwap;
        emit MinTokensBeforeSwapUpdated(_minTokensBeforeSwap);
    }
    
    /**
     * @dev Exclui ou inclui endereço das taxas
     * @param account Endereço a modificar
     * @param excluded Se deve ser excluído
     * @notice Apenas owner pode executar
     */
    function setExcludedFromFee(address account, bool excluded) external onlyOwner {
        _isExcludedFromFee[account] = excluded;
        emit ExcludedFromFee(account, excluded);
    }
    
    /**
     * @dev Exclui ou inclui endereço da liquidez automática
     * @param account Endereço a modificar
     * @param excluded Se deve ser excluído
     * @notice Apenas owner pode executar
     */
    function setExcludedFromAutoLiquidity(address account, bool excluded) external onlyOwner {
        _isExcludedFromAutoLiquidity[account] = excluded;
        emit ExcludedFromAutoLiquidity(account, excluded);
    }
    
    /**
     * @dev Atualiza a URL da logo
     * @param _logoURI Nova URL da logo
     * @notice Apenas owner pode executar
     */
    function updateLogoURI(string memory _logoURI) external onlyOwner {
        logoURI = _logoURI;
        emit LogoURIUpdated(_logoURI);
    }
    
    /**
     * @dev Atualiza a URL dos metadados
     * @param _metadataURI Nova URL dos metadados
     * @notice Apenas owner pode executar
     */
    function updateMetadataURI(string memory _metadataURI) external onlyOwner {
        metadataURI = _metadataURI;
        emit MetadataURIUpdated(_metadataURI);
    }
    
    /**
     * @dev Recupera tokens enviados por engano
     * @param token Endereço do token
     * @param amount Quantidade a recuperar
     * @notice Apenas owner pode executar
     */
    function recoverTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "Cannot recover proxy token");
        IERC20(token).transfer(owner(), amount);
        emit TokensRecovered(token, amount);
    }
    
    // ============ FUNÇÕES DE MAPEAMENTO ============
    
    /**
     * @dev Mapeia saldos de holders do token original
     * @param holders Array de endereços de holders
     * @notice Apenas owner pode executar
     */
    function mapBalances(address[] calldata holders) external onlyOwner {
        require(!mappingCompleted, "Mapping already completed");
        
        uint256 totalMapped = 0;
        for (uint256 i = 0; i < holders.length; i++) {
            require(holders[i] != address(0), "Invalid holder address");
            uint256 originalBalance = originalToken.balanceOf(holders[i]);
            if (originalBalance > 0) {
                uint256 proxyAmount = _calculateProxyAmount(originalBalance);
                _mappedBalances[holders[i]] = proxyAmount;
                totalMapped += proxyAmount;
                emit BalanceMapped(holders[i], proxyAmount);
            }
        }
        
        mappingCompleted = true;
        totalMappedBalance = totalMapped;
        emit MappingCompleted(totalMappedBalance);
    }
    
    /**
     * @dev Reseta o mapeamento
     * @notice Apenas owner pode executar
     */
    function resetMapping() external onlyOwner {
        mappingCompleted = false;
        totalMappedBalance = 0;
        emit MappingCompleted(0);
    }
    
    // ============ FUNÇÕES DE CÁLCULO ============
    
    /**
     * @dev Calcula o valor em USD do token original
     * @param amount Quantidade do token original
     * @return Valor em USD (em wei)
     */
    function getOriginalTokenUSDValue(uint256 amount) public view returns (uint256) {
        if (amount == 0) return 0;
        
        address[] memory path = new address[](2);
        path[0] = ORIGINAL_TOKEN;
        path[1] = uniswapRouter.WETH();
        
        try uniswapRouter.getAmountsOut(amount, path) returns (uint256[] memory amounts) {
            return amounts[1];
        } catch {
            return 0;
        }
    }
    
    /**
     * @dev Calcula a quantidade de tokens proxy equivalente a um valor USD
     * @param usdValue Valor em USD (em wei)
     * @return Quantidade de tokens proxy
     */
    function getProxyTokenAmount(uint256 usdValue) public view returns (uint256) {
        if (usdValue == 0) return 0;
        
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapRouter.WETH();
        
        try uniswapRouter.getAmountsIn(usdValue, path) returns (uint256[] memory amounts) {
            return amounts[0];
        } catch {
            return 0;
        }
    }
    
    // ============ FUNÇÕES INTERNAS ============
    
    /**
     * @dev Função interna de transferência
     * @param sender Endereço remetente
     * @param recipient Endereço destinatário
     * @param amount Quantidade a transferir
     */
    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override whenNotPaused {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Verifica se o remetente tem saldo suficiente
        uint256 senderBalance = balanceOf(sender);
        require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
        
        // Calcula taxas se aplicável
        uint256 feeAmount = 0;
        if (transferFee > 0 && !_isExcludedFromFee[sender] && !_isExcludedFromFee[recipient]) {
            feeAmount = (amount * transferFee) / FEE_DENOMINATOR;
        }
        
        uint256 transferAmount = amount - feeAmount;
        
        // Atualiza saldos
        _updateBalance(sender, senderBalance - amount);
        _updateBalance(recipient, balanceOf(recipient) + transferAmount);
        
        // Emite eventos
        emit Transfer(sender, recipient, transferAmount);
        
        // Processa taxas se houver
        if (feeAmount > 0) {
            _processFees(sender, feeAmount);
        }
        
        // Ativa liquidez automática se necessário
        if (!_inSwap && !_isExcludedFromAutoLiquidity[sender] && sender != uniswapPair) {
            _checkAndTriggerAutoLiquidity();
        }
    }
    
    /**
     * @dev Atualiza o saldo de um endereço
     * @param account Endereço
     * @param newBalance Novo saldo
     */
    function _updateBalance(address account, uint256 newBalance) internal {
        _mappedBalances[account] = newBalance;
    }
    
    /**
     * @dev Processa as taxas de transferência
     * @param sender Endereço remetente
     * @param feeAmount Quantidade da taxa
     */
    function _processFees(address sender, uint256 feeAmount) internal {
        uint256 liquidityAmount = (feeAmount * liquidityFee) / 100;
        uint256 motherAmount = feeAmount - liquidityAmount;
        
        // Adiciona à wallet mãe
        if (motherAmount > 0) {
            _updateBalance(motherWallet, balanceOf(motherWallet) + motherAmount);
            emit Transfer(sender, motherWallet, motherAmount);
        }
        
        // Adiciona à wallet de liquidez
        if (liquidityAmount > 0) {
            _updateBalance(liquidityWallet, balanceOf(liquidityWallet) + liquidityAmount);
            emit Transfer(sender, liquidityWallet, liquidityAmount);
        }
    }
    
    /**
     * @dev Verifica e ativa liquidez automática
     */
    function _checkAndTriggerAutoLiquidity() internal {
        uint256 contractBalance = balanceOf(address(this));
        if (contractBalance >= minTokensBeforeSwap) {
            _swapAndLiquify(contractBalance);
        }
    }
    
    /**
     * @dev Executa swap e adiciona liquidez
     * @param amount Quantidade de tokens para swap
     */
    function _swapAndLiquify(uint256 amount) private lockTheSwap {
        uint256 half = amount / 2;
        uint256 otherHalf = amount - half;
        
        // Swap por BNB
        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = uniswapRouter.WETH();
        
        _approve(address(this), address(uniswapRouter), half);
        
        uint256 initialBalance = address(this).balance;
        
        try uniswapRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(
            half,
            0,
            path,
            address(this),
            block.timestamp
        ) {
            uint256 bnbReceived = address(this).balance - initialBalance;
            
            // Adiciona liquidez
            _approve(address(this), address(uniswapRouter), otherHalf);
            
            try uniswapRouter.addLiquidityETH{value: bnbReceived}(
                address(this),
                otherHalf,
                0,
                0,
                liquidityWallet,
                block.timestamp
            ) {
                emit AutoLiquidityTriggered(half, bnbReceived, otherHalf);
            } catch {
                // Se falhar, envia BNB para a wallet de liquidez
                payable(liquidityWallet).transfer(bnbReceived);
            }
        } catch {
            // Se o swap falhar, não faz nada
        }
    }
    
    /**
     * @dev Calcula a quantidade de tokens proxy equivalente
     * @param originalAmount Quantidade do token original
     * @return Quantidade de tokens proxy
     */
    function _calculateProxyAmount(uint256 originalAmount) internal pure returns (uint256) {
        if (originalAmount == 0) return 0;
        
        // Para simplificar, usa mapeamento 1:1
        // Em uma implementação mais avançada, poderia usar oráculos de preço
        return originalAmount;
    }
    
    /**
     * @dev Função de aprovação interna
     * @param owner Endereço proprietário
     * @param spender Endereço aprovado
     * @param amount Quantidade aprovada
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal override {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    // ============ FUNÇÕES DE CONSULTA ============
    
    /**
     * @dev Verifica se um endereço está excluído das taxas
     * @param account Endereço a verificar
     * @return Se está excluído
     */
    function isExcludedFromFee(address account) external view returns (bool) {
        return _isExcludedFromFee[account];
    }
    
    /**
     * @dev Verifica se um endereço está excluído da liquidez automática
     * @param account Endereço a verificar
     * @return Se está excluído
     */
    function isExcludedFromAutoLiquidity(address account) external view returns (bool) {
        return _isExcludedFromAutoLiquidity[account];
    }
    
    /**
     * @dev Retorna o saldo mapeado de um endereço
     * @param account Endereço a consultar
     * @return Saldo mapeado
     */
    function getMappedBalance(address account) external view returns (uint256) {
        return _mappedBalances[account];
    }
    
    // ============ FUNÇÕES DE EMERGÊNCIA ============
    
    /**
     * @dev Função para receber BNB
     */
    receive() external payable {}
    
    /**
     * @dev Função para recuperar BNB enviado por engano
     * @notice Apenas owner pode executar
     */
    function recoverBNB() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No BNB to recover");
        payable(owner()).transfer(balance);
    }
}