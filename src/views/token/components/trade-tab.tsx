import React, { type ComponentProps, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Address, formatEther } from 'viem'
import { toast } from 'sonner'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { isEmpty } from 'lodash'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { useTrade } from '../hooks/use-trade'
import { useTokenContext } from '@/contexts/token'
import { useWallet } from '@/hooks/use-wallet'
import { useWalletStore } from '@/stores/use-wallet-store'

enum Tab {
  Buy = 'buy',
  Sell = 'sell',
}

const buyItems = ['0.001', '0.01', '1']
const sellItems = ['10', '25', '75', '100']

export const TradeTab = (props: ComponentProps<'div'>) => {
  const { className } = props
  const { t } = useTranslation()
  const [tab, setTab] = useState(String(Tab.Buy))
  const [value, setValue] = useState('0')
  const [slippage, setSlippage] = useState('5')
  const { isTrading, buy, sell, checkTrade } = useTrade()
  const router = useRouter()
  const { total } = useTokenContext()
  const { isConnected } = useAccount()
  const { setConnectOpen } = useWalletStore()

  const isBuy = tab === Tab.Buy
  const isSell = tab === Tab.Sell
  const symbol = 'ETH'
  const address = router.query.address as Address

  const onBuy = async () => {
    const { totalAmount, currentAmount } = await checkTrade(address)
    const total = formatEther(totalAmount)
    const current = formatEther(currentAmount)

    if (value + current > total) {
      const currentTotal = BigNumber(total).minus(current).toString()
      setValue(currentTotal)
      toast.info(
        t('trade.limit').replace('{}', currentTotal).replace('{}', t('buy'))
      )
      return
    }

    if (BigNumber(value).lt(0)) {
      toast.error(t('trade.is-zero'))
      return
    }

    buy(value, address)
  }

  const onSell = async () => {
    sell(value, address)
  }

  const setPercent = (value: string) => {}

  return (
    <Card className={cn('p-3 grid gap-4 rounded-lg', className)}>
      <Tabs className="w-full" value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-2 h-11 mb-6">
          <TabsTrigger className="h-full" value={Tab.Buy}>
            {t('buy')}
          </TabsTrigger>
          <TabsTrigger className="h-full" value={Tab.Sell}>
            {t('sell')}
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-between w-full gap-2">
          <AlertDialog
            title={<p>Set max slippage</p>}
            footerClass="!flex-row-reverse gap-2"
            description={
              <div>
                <p className="mb-3">Set max trade slippage</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={slippage}
                    type="number"
                    onChange={({ target }) => {
                      if (target.value.length > 3) return
                      setSlippage(target.value)
                    }}
                  />
                  <span>%</span>
                </div>
              </div>
            }
            onConfirm={() => {
              if (isEmpty(slippage) || BigNumber(slippage).lt(0)) {
                setSlippage('5')
              }
            }}
          >
            <Button size="xs">
              {t('set-max-slippage')}({slippage}%)
            </Button>
          </AlertDialog>
        </div>
        <div className="flex flex-col my-6">
          <div className="flex items-center border rounded-md focus-within:border-black pr-2">
            <Input
              placeholder="0"
              border="none"
              disableFocusBorder
              className="flex-1"
              type="number"
              value={value}
              onChange={({ target }) => setValue(target.value)}
            />
            <div className="flex items-center">
              <span className="mr-2 text-zinc-600">{symbol}</span>
              <img
                loading="lazy"
                decoding="async"
                width={20}
                height={20}
                src="/images/scroll.svg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="xs" onClick={() => setValue('0')}>
              {t('reset')}
            </Button>
            {(isBuy ? buyItems : sellItems).map((value, i) => (
              <Button
                size="xs"
                key={i}
                onClick={() => (isBuy ? setValue(value) : setPercent(value))}
              >
                {value} {isBuy ? symbol : '%'}
              </Button>
            ))}
          </div>
        </div>
        <Button
          className="w-full"
          onClick={() => {
            if (!isConnected) {
              setConnectOpen(true)
              return
            }
            isBuy ? onBuy() : onSell()
          }}
          disabled={isTrading || Number(value) <= 0}
        >
          {t('trade')}
        </Button>
      </Tabs>
    </Card>
  )
}

export default TradeTab
