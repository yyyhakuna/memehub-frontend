import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useReadContracts } from 'wagmi'
import { formatEther } from 'viem'

import { TradeTab } from './components/trade-tab'
import { Button } from '@/components/ui/button'
import { TokenInfo } from './components/token-info'
import { CommentTradeTab } from './components/comment-trade-tab'
import { useResponsive } from '@/hooks/use-responsive'
import { HoldersRank } from './components/holders-rank'
import { TokenProvider } from '@/contexts/token'
import { continousTokenAbi } from '@/contract/continous-token'

const address = ''
export const TokenPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isMobile } = useResponsive()
  const { data = [], refetch } = useReadContracts({
    contracts: [
      {
        abi: continousTokenAbi,
        address,
        functionName: 'ETH_AMOUNT',
      },
      {
        abi: continousTokenAbi,
        address,
        functionName: 'raiseEthAmount',
      },
    ],
  })
  const weiTotal = data[0]?.result || BigInt(0)
  const weiCurrent = data[1]?.result || BigInt(0)
  const total = formatEther(weiTotal)
  const current = formatEther(weiCurrent)

  return (
    <TokenProvider total={total} current={current} refetchInfo={refetch}>
      <main className="px-4 max-sm:px-3 pt-4">
        <Button className="mb-3" onClick={router.back}>
          {t('back')}
        </Button>
        <div className="flex space-x-4 max-sm:flex-col max-sm:space-x-0">
          {/* Left */}
          <div className="flex flex-col flex-1">
            {isMobile && <TradeTab />}
            <TokenInfo className="mt-0" />
            <CommentTradeTab className="my-6 max-sm:mb-0" />
          </div>

          {/* Right */}
          {!isMobile && (
            <div className="w-aside">
              <TradeTab />
              {/* <HoldersRank className="mt-4" /> */}
            </div>
          )}
        </div>
      </main>
    </TokenProvider>
  )
}

export default TokenPage
