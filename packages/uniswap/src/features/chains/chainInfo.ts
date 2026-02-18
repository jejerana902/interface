import { NEXUS_CHAIN_INFO } from 'uniswap/src/features/chains/evm/info/nexus'
import { UniverseChainId, UniverseChainInfo } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { getNonEmptyArrayOrThrow } from 'utilities/src/primitives/array'

export function getChainInfo(chainId: UniverseChainId): UniverseChainInfo {
  return UNIVERSE_CHAIN_INFO[chainId]
}

export const ORDERED_CHAINS = [NEXUS_CHAIN_INFO] as const satisfies UniverseChainInfo[]

type ConstChainInfo = Extract<(typeof ORDERED_CHAINS)[number], { platform: Platform.EVM }>

function getOrderedEVMChains(): ConstChainInfo[] {
  // Since we only have EVM chains now (Nexus), just return ORDERED_CHAINS
  return [...ORDERED_CHAINS]
}

export const ALL_CHAIN_IDS: UniverseChainId[] = ORDERED_CHAINS.map((chain) => chain.id)

// Exported with narrow typing for viem config typing on web. Will throw if no EVM chain is provided in ORDERED_CHAINS.
export const ORDERED_EVM_CHAINS = getNonEmptyArrayOrThrow(getOrderedEVMChains())

export const ALL_EVM_CHAIN_IDS = ORDERED_EVM_CHAINS.map((chain) => chain.id)

// Typing ensures the `UNIVERSE_CHAIN_INFO` map contains a proper mapping for each item defined in `ORDERED_EVM_CHAINS` (all keys defined & keys match corresponding value's `id` field)
type AllChainsMap = {
  [chainId in UniverseChainId]: Extract<ConstChainInfo, { id: chainId }>
}

export const UNIVERSE_CHAIN_INFO = {
  [UniverseChainId.Nexus]: NEXUS_CHAIN_INFO,
} as const satisfies AllChainsMap

export const GQL_MAINNET_CHAINS = ORDERED_EVM_CHAINS.filter((chain) => !chain.testnet).map(
  (chain) => chain.backendChain.chain,
)

export const GQL_TESTNET_CHAINS = ORDERED_EVM_CHAINS.filter((chain) => chain.testnet).map(
  (chain) => chain.backendChain.chain,
)

// If limit support expands beyond Nexus, refactor to use a `supportsLimits`
// property on chain info objects and filter chains, similar to the pattern used above
export const LIMIT_SUPPORTED_CHAINS = [UniverseChainId.Nexus]
