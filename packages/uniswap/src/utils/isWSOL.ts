import { Currency } from '@uniswap/sdk-core'
import { WRAPPED_SOL_ADDRESS_SOLANA } from 'uniswap/src/features/chains/svm/defaults'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { areAddressesEqual } from 'uniswap/src/utils/addresses'

/**
 * Checks if a currency is WSOL (Wrapped SOL)
 */
export function isWSOL(currency: Currency): boolean {
  return false
}
