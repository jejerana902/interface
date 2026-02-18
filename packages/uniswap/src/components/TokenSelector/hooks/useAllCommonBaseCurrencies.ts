import { GqlResult } from '@universe/api'
import { useCurrencies } from 'uniswap/src/components/TokenSelector/hooks/useCurrencies'
import { USDC } from 'uniswap/src/constants/tokens'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { CurrencyInfo } from 'uniswap/src/features/dataApi/types'
import { buildNativeCurrencyId, buildWrappedNativeCurrencyId, currencyId } from 'uniswap/src/utils/currencyId'

// Use Nexus base token addresses
const baseCurrencyIds = [
  buildNativeCurrencyId(UniverseChainId.Nexus),
  buildWrappedNativeCurrencyId(UniverseChainId.Nexus),
  currencyId(USDC),
]

export function useAllCommonBaseCurrencies(): GqlResult<CurrencyInfo[]> {
  const { isTestnetModeEnabled } = useEnabledChains()
  return useCurrencies(isTestnetModeEnabled ? baseCurrencyIds : baseCurrencyIds)
}
