import { Token } from '@uniswap/sdk-core'
import { USDC_NEXUS, WRAPPED_NATIVE_CURRENCY } from 'uniswap/src/constants/tokens'
import { UniverseChainId } from 'uniswap/src/features/chains/types'

type ChainTokenList = {
  readonly [chainId: number]: Token[]
}

const WRAPPED_NATIVE_CURRENCIES_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean),
)

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_CURRENCIES_ONLY,
  [UniverseChainId.Nexus]: [
    ...WRAPPED_NATIVE_CURRENCIES_ONLY[UniverseChainId.Nexus],
    USDC_NEXUS,
  ],
}

export const PINNED_PAIRS: { readonly [chainId: number]: [Token, Token][] } = {
  [UniverseChainId.Nexus]: [
    // No pinned pairs for Nexus yet - user can add after deploying contracts
  ],
}
