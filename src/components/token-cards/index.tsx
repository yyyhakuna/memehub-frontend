import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { TokenCard } from './card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Order } from '@/utils/types'
import { Skeleton } from '../ui/skeleton'
import { CustomSuspense } from '../custom-suspense'
import { Routes } from '@/routes'
import { TokenListItem } from '@/api/token/types'
import { useWalletStore } from '@/stores/use-wallet-store'
import { useStorage } from '@/hooks/use-storage'

interface Props extends ComponentProps<'div'> {
  cards: (TokenListItem | undefined)[]
  isPending: boolean
}

export const TokenCards = ({ className, cards, isPending }: Props) => {
  const { t } = useTranslation()
  const { chains } = useWalletStore()
  const { getChain, setChain } = useStorage()

  const onChange = (chainId: string) => {
    setChain(chainId)
  }

  const defaultChain = getChain()

  return (
    <>
      <div className="flex items-center gap-4 max-sm:justify-between">
        <Select onValueChange={onChange} defaultValue={defaultChain}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <SelectValue placeholder={t('chains')} />
          </SelectTrigger>
          <SelectContent>
            {chains?.map((chain, i) => (
              <SelectItem
                key={i}
                value={chain.id || defaultChain}
                disabled={chain.disabled || false}
              >
                {chain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* <Select defaultValue={String(0)} onValueChange={onChange}>
          <SelectTrigger className="mb-4 w-[inheirt] max-sm:mb-2">
            <div>
              <span>{t('sort-by')}: </span>
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {sortItems.map((s, i) => (
              <SelectItem key={i} value={String(i)}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>
      <CustomSuspense
        list={cards}
        className={cn(
          'grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1',
          'max-sm:gap-2',
          className
        )}
        isPending={isPending}
        fallback={<CardSkeleton />}
        nullback={
          <div className="text-zinc-500">
            {t('tokens.list.empty')},
            <Link className="text-blue-600 ml-2" href={Routes.Create}>
              {t('token.create')}
            </Link>
            {t('period')}
          </div>
        }
      >
        {cards.map((t, i) => (
          <TokenCard key={i} card={t} />
        ))}
      </CustomSuspense>
    </>
  )
}

const CardSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-2 ">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="border rounded flex gap-2 relative" key={i}>
          <Skeleton className="w-32 h-32 flex-shrink-0" />
          <div className="w-full my-2 flex flex-col gap-2 mr-2">
            <Skeleton className="w-1/2 h-4" />
            <Skeleton className="w-1/3 h-3" />
            <Skeleton className="w-[70%] h-3" />
            <Skeleton className="w-1/2 h-3" />
            <Skeleton className="w-full h-5 rounded-full mt-2" />
          </div>
          <Skeleton className="w-8 h-8 absolute right-2 top-2" />
        </div>
      ))}
    </div>
  )
}

export default TokenCards
