import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Token } from '@uniswap/sdk-core'
import { GraphQLApi } from '@universe/api'
import { PollingInterval } from 'uniswap/src/constants/misc'
import { ALL_CHAIN_IDS, getChainInfo, ORDERED_CHAINS } from 'uniswap/src/features/chains/chainInfo'
import { EnabledChainsInfo, GqlChainId, NetworkLayer, UniverseChainId } from 'uniswap/src/features/chains/types'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'

// Some code from the web app uses chainId types as numbers
// This validates them as coerces into SupportedChainId
export function toSupportedChainId(chainId?: BigNumberish): UniverseChainId | null {
  if (!chainId || !ALL_CHAIN_IDS.map((c) => c.toString()).includes(chainId.toString())) {
    return null
  }
  return parseInt(chainId.toString(), 10) as UniverseChainId
}

export function getChainLabel(chainId: UniverseChainId): string {
  return getChainInfo(chainId).label
}

/**
 * Return the explorer name for the given chain ID
 * @param chainId the ID of the chain for which to return the explorer name
 */
export function getChainExplorerName(chainId: UniverseChainId): string {
  return getChainInfo(chainId).explorer.name
}

export function isTestnetChain(chainId: UniverseChainId): boolean {
  return Boolean(getChainInfo(chainId).testnet)
}

export function isBackendSupportedChainId(chainId: UniverseChainId): boolean {
  const info = getChainInfo(chainId)
  return info.backendChain.backendSupported
}

export function isBackendSupportedChain(chain: GraphQLApi.Chain): chain is GqlChainId {
  const chainId = fromGraphQLChain(chain)
  if (!chainId) {
    return false
  }

  return isBackendSupportedChainId(chainId)
}

export function chainIdToHexadecimalString(chainId: UniverseChainId): string {
  return BigNumber.from(chainId).toHexString()
}

export function hexadecimalStringToInt(hex: string): number {
  return parseInt(hex, 16)
}

export function isL2ChainId(chainId?: UniverseChainId): boolean {
  return chainId !== undefined && getChainInfo(chainId).networkLayer === NetworkLayer.L2
}

export function isMainnetChainId(chainId?: UniverseChainId): boolean {
  return chainId === UniverseChainId.Nexus
}

export function toGraphQLChain(chainId: UniverseChainId): GqlChainId {
  return getChainInfo(chainId).backendChain.chain
}

export function fromGraphQLChain(chain: GraphQLApi.Chain | string | undefined): UniverseChainId | null {
  // Since we only support Nexus now, return Nexus for Ethereum (as placeholder) or null for others
  switch (chain) {
    case GraphQLApi.Chain.Ethereum:
    case GraphQLApi.Chain.EthereumSepolia:
      return UniverseChainId.Nexus
  }

  return null
}

export function getPollingIntervalByBlocktime(chainId?: UniverseChainId): PollingInterval {
  return isMainnetChainId(chainId) ? PollingInterval.Fast : PollingInterval.LightningMcQueen
}

export function fromUniswapWebAppLink(network: string | null): UniverseChainId {
  // Default to Nexus for any network parameter
  return UniverseChainId.Nexus
}

export function toUniswapWebAppLink(chainId: UniverseChainId): string | null {
  // Only support Nexus, return 'nexus' as URL param
  if (chainId === UniverseChainId.Nexus) {
    return 'nexus'
  }
  return null
}

export function filterChainIdsByFeatureFlag(
  featureFlaggedChainIds: {
    [key in UniverseChainId]?: boolean
  },
): UniverseChainId[] {
  return ALL_CHAIN_IDS.filter((chainId) => {
    return featureFlaggedChainIds[chainId] ?? true
  })
}

/**
 * Filters chain IDs by platform (EVM or SVM)
 * @param chainIds Array of chain IDs to filter (as numbers)
 * @param platform Platform to filter by (EVM or SVM)
 * @returns Filtered array of chain IDs matching the specified platform
 */
export function filterChainIdsByPlatform<T extends number>(chainIds: T[], platform: Platform): T[] {
  return chainIds.filter<T>((chainId): chainId is T => {
    const universeChainId = chainId as UniverseChainId
    if (!ALL_CHAIN_IDS.includes(universeChainId)) {
      return false
    }
    const chainInfo = getChainInfo(universeChainId)
    return chainInfo.platform === platform
  })
}

export function getEnabledChains({
  platform,
  /**
   * When `true`, it will return all enabled chains, including testnets.
   */
  includeTestnets = false,
  isTestnetModeEnabled,
  featureFlaggedChainIds,
}: {
  platform?: Platform
  isTestnetModeEnabled: boolean
  featureFlaggedChainIds: UniverseChainId[]
  includeTestnets?: boolean
}): EnabledChainsInfo {
  const enabledChainInfos = ORDERED_CHAINS.filter((chainInfo) => {
    // Filter by platform
    if (platform !== undefined && platform !== chainInfo.platform) {
      return false
    }

    // Filter by testnet mode
    if (!includeTestnets && isTestnetModeEnabled !== isTestnetChain(chainInfo.id)) {
      return false
    }

    // Filter by feature flags
    if (!featureFlaggedChainIds.includes(chainInfo.id)) {
      return false
    }

    return true
  })

  // Extract chain IDs and GQL chains from filtered results
  const chains = enabledChainInfos.map((chainInfo) => chainInfo.id)
  const gqlChains = enabledChainInfos.map((chainInfo) => chainInfo.backendChain.chain)

  const result = {
    chains,
    gqlChains,
    defaultChainId: getDefaultChainId({ platform, isTestnetModeEnabled }),
    isTestnetModeEnabled,
  }

  return result
}

function getDefaultChainId({
  platform,
  isTestnetModeEnabled,
}: {
  platform?: Platform
  isTestnetModeEnabled: boolean
}): UniverseChainId {
  // Always return Nexus as it's our only supported chain
  return UniverseChainId.Nexus
}

/** Returns all stablecoins for a given chainId. */
export function getStablecoinsForChain(chainId: UniverseChainId): Token[] {
  return getChainInfo(chainId).tokens.stablecoins
}

/** Returns the primary stablecoin for a given chainId. */
export function getPrimaryStablecoin(chainId: UniverseChainId): Token {
  return getChainInfo(chainId).tokens.stablecoins[0]
}

export function isUniverseChainId(chainId?: number | UniverseChainId | null): chainId is UniverseChainId {
  return !!chainId && ALL_CHAIN_IDS.includes(chainId as UniverseChainId)
}
