import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { BigNumber } from 'bignumber.js'

import type { UserCoinsHeld } from '@/api/user/types'

import { Card } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { CustomSuspense } from '@/components/custom-suspense'
import { Skeleton } from '@/components/ui/skeleton'
import { Routes } from '@/routes'
import { useScrollLoad } from '@/hooks/use-scroll-load'
import { fmt } from '@/utils/fmt'

interface Props {
  cards: UserCoinsHeld[]
  total: number
  isLoading: boolean
  isPending?: boolean
  onFetchNext?: () => void
}

export const TokenHeldCards = (props: Props) => {
  const { cards, total, isLoading, isPending, onFetchNext } = props
  const { t } = useTranslation()
  const { noMore } = useScrollLoad({
    hasMore: total > cards.length,
    onFetchNext,
  })

  return (
    <CustomSuspense
      isPending={isLoading}
      fallback={<CardSkeleton />}
      nullback={<p className="text-zinc-500">{t('token.no-token')}</p>}
      className="grid grid-cols-3 gap-3 2xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-2"
    >
      {cards?.map((c, i) => (
        <HeldCard c={c} key={i} />
      ))}
      {isPending && (
        <p className="text-zinc-500 text-center col-span-3">{t('loading')}</p>
      )}
      {noMore && (
        <p className="text-zinc-500 text-center col-span-3">{t('nomore')}</p>
      )}
    </CustomSuspense>
  )
}

const HeldCard = ({ c }: { c: UserCoinsHeld }) => {
  const router = useRouter()

  return (
    <Card
      padding="md"
      hover="bg"
      onClick={() => {
        const href = fmt.toHref(Routes.Main, c.chain.name, c.coin.address)
        router.push(href)
      }}
    >
      <div className="flex items-center gap-2">
        <Avatar src={c.coin.image} fallback={c.coin.ticker.charAt(0)} />
        <div className="flex flex-col justify-between">
          <p className="font-bold truncate">
            {c.coin.name}({c.coin.ticker})
          </p>
          <p className="text-zinc-500 text-sm">
            {fmt.decimals(c.amount)} {c.coin.ticker}
          </p>
        </div>
      </div>
    </Card>
  )
}

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-3 2xl:grid-cols-4 max-sm:grid-cols-1 max-sm:gap-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card className="flex gap-2" padding="md" key={i}>
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col justify-between">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-14 h-3 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  )
}

export default TokenHeldCards
