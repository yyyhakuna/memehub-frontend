import React, { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Card, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { Progress } from '../ui/progress'

interface Props extends ComponentProps<'div'> {
  card: {
    name: string
    symbol: string
    description: string
    creator: string
    marketCap: number
    commentCount: number
    address: string
  }
}

export const TokenCard = ({ card, className }: Props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const percent = 30

  const onClick = () => {
    router.push({
      pathname: Routes.Token,
    })
  }

  return (
    <Card
      className={cn(
        'flex items-stretch rounded overflow-hidden gap-2 relative',
        className
      )}
      hover="border"
      onClick={onClick}
    >
      <img src="https://via.placeholder.com/150" alt="img" />
      <img
        src="https://scrollscan.com/images/svg/brands/main.svg?v=24.5.1.0"
        alt="chain"
        className="absolute right-2 top-2 w-5"
      />
      <div className="self-start py-2 pr-2 h-full w-full flex flex-col justify-between">
        <div>
          <CardTitle className="pt-2">BTC(Bitcoin)</CardTitle>
          <p className="text-zinc-500 text-xs mt-0.5">
            {t('creator')}: {card.creator}
          </p>
          <p className="text-zinc-500 text-sm break-all line-clamp-4">
            {card.description}
          </p>
        </div>
        <Progress
          className="h-4 self-end w-full mt-1"
          indicatorClass="bg-green-500"
          value={percent}
          label={percent}
        />
      </div>
    </Card>
  )
}

export default TokenCard
