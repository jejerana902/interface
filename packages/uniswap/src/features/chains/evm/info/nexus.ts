import { GraphQLApi } from '@universe/api'
import { SwapConfigKey } from '@universe/gating'
import { ETHEREUM_LOGO, ETH_LOGO } from 'ui/src/assets'
import { config } from 'uniswap/src/config'
import {
  DEFAULT_NATIVE_ADDRESS_LEGACY,
  DEFAULT_RETRY_OPTIONS,
} from 'uniswap/src/features/chains/evm/rpc'
import { buildChainTokens } from 'uniswap/src/features/chains/evm/tokens'
import {
  GqlChainId,
  NetworkLayer,
  RPCType,
  UniverseChainId,
  UniverseChainInfo,
} from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import { buildUSDC } from 'uniswap/src/features/tokens/stablecoin'

// TODO: Replace with actual deployed contract address on Nexus Testnet3
const NEXUS_USDC_ADDRESS = '0x0000000000000000000000000000000000000002'

const tokens = buildChainTokens({
  stables: {
    USDC: buildUSDC(NEXUS_USDC_ADDRESS, UniverseChainId.Nexus),
  },
})

// Define custom chain object for Nexus Testnet3 (not in wagmi/chains)
const nexusTestnet = {
  id: 3945,
  name: 'Nexus Testnet3',
  nativeCurrency: { name: 'NEX', symbol: 'NEX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.nexus.xyz'] },
    public: { http: ['https://testnet.rpc.nexus.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Nexus Explorer', url: 'https://nexus.testnet.blockscout.com' },
  },
  testnet: true,
}

export const NEXUS_CHAIN_INFO = {
  ...nexusTestnet,
  id: UniverseChainId.Nexus,
  platform: Platform.EVM,
  assetRepoNetworkName: undefined,
  backendChain: {
    // Use Ethereum as placeholder since GraphQL backend won't support Nexus
    chain: GraphQLApi.Chain.Ethereum as GqlChainId,
    backendSupported: false,
    nativeTokenBackendAddress: undefined,
  },
  blockPerMainnetEpochForChainId: 1,
  blockWaitMsBeforeWarning: undefined,
  bridge: undefined,
  docs: 'https://docs.nexus.xyz/',
  elementName: ElementName.ChainEthereum, // Reuse existing element name
  explorer: {
    name: 'Nexus Explorer',
    url: 'https://nexus.testnet.blockscout.com/',
    apiURL: undefined,
  },
  interfaceName: 'nexus',
  label: 'Nexus Testnet3',
  logo: ETHEREUM_LOGO, // Using Ethereum logo as placeholder
  nativeCurrency: {
    name: 'NEX',
    symbol: 'NEX',
    decimals: 18,
    address: DEFAULT_NATIVE_ADDRESS_LEGACY,
    logo: ETH_LOGO, // Using ETH logo as placeholder
  },
  networkLayer: NetworkLayer.L1,
  pendingTransactionsRetryOptions: DEFAULT_RETRY_OPTIONS,
  rpcUrls: {
    [RPCType.Public]: { http: ['https://testnet.rpc.nexus.xyz'] },
    [RPCType.Default]: { http: ['https://testnet.rpc.nexus.xyz'] },
    [RPCType.Fallback]: { http: ['https://testnet.rpc.nexus.xyz'] },
    [RPCType.Interface]: { http: ['https://testnet.rpc.nexus.xyz'] },
  },
  urlParam: 'nexus',
  statusPage: undefined,
  tokens,
  supportsV4: false,
  supportsNFTs: false,
  // TODO: Replace with actual deployed contract address on Nexus Testnet3
  wrappedNativeCurrency: {
    name: 'Wrapped NEX',
    symbol: 'WNEX',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000001',
  },
  gasConfig: {
    send: {
      configKey: SwapConfigKey.EthSendMinGasAmount,
      default: 20, // .002 NEX
    },
    swap: {
      configKey: SwapConfigKey.EthSwapMinGasAmount,
      default: 150, // .015 NEX
    },
  },
  tradingApiPollingIntervalMs: 500,
} as const satisfies UniverseChainInfo
