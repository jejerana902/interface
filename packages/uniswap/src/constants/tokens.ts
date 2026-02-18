import { Currency, NativeCurrency, Token } from '@uniswap/sdk-core'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { NEXUS_CHAIN_INFO } from 'uniswap/src/features/chains/evm/info/nexus'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { isUniverseChainId } from 'uniswap/src/features/chains/utils'
import { logger } from 'utilities/src/logger/logger'

// Export Nexus tokens
export const { USDC: USDC_NEXUS } = NEXUS_CHAIN_INFO.tokens

// Default USDC is Nexus USDC
export const USDC = USDC_NEXUS

// TODO: Replace with actual deployed contract address on Nexus Testnet3
export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } = {
  [UniverseChainId.Nexus]: new Token(
    UniverseChainId.Nexus,
    '0x0000000000000000000000000000000000000001', // Placeholder WNEX address
    18,
    'WNEX',
    'Wrapped NEX',
  ),
}

class NativeCurrencyImpl extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) {
      return wrapped
    }
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  constructor(chainId: number) {
    if (!isUniverseChainId(chainId)) {
      logger.warn('tokens.ts', 'NativeCurrencyImpl', `Initializing native currency for non-universe chain: ${chainId}`)
      super(chainId, 18, 'NEX', 'NEX')
      return
    }

    const { name, decimals, symbol } = getChainInfo(chainId).nativeCurrency
    super(chainId, decimals, symbol, name)
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrencyImpl } = {}

/**
 * @deprecated Prefer obtaining metadata via the non-sdk-based getChainInfo(chainId).nativeCurrency instead.
 *
 * Utility for obtaining an `@uniswap/sdk-core` `NativeCurrency` instance for a given chainId.
 */
export function nativeOnChain(chainId: number): NativeCurrencyImpl {
  const cached = cachedNativeCurrency[chainId]

  if (cached) {
    return cached
  }

  const result = new NativeCurrencyImpl(chainId)
  cachedNativeCurrency[chainId] = result
  return result
}

// Nexus doesn't have bridged assets (removed Unichain-specific code)
export const NEXUS_BRIDGED_ASSETS: readonly BridgedAsset[] = []

export function isBridgedAsset(address: string): boolean {
  return NEXUS_BRIDGED_ASSETS.some((asset) => asset.nexusAddress === address)
}

export type BridgedAsset = {
  nexusAddress: string
  nativeChain: string
  nativeAddress: string
}
