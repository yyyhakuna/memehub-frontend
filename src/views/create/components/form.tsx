import React, { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatEther } from 'viem'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSwitchChain } from 'wagmi'

import { aiApi } from '@/api/ai'
import { useCreateTokenForm } from '../hooks/use-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { useDeploy } from '../hooks/use-deploy'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { fmt } from '@/utils/fmt'
import { useNewsList } from '@/hooks/use-news-list'

interface Props {
  newsListData: ReturnType<typeof useNewsList>
  formData: ReturnType<typeof useCreateTokenForm>
  deployResult: ReturnType<typeof useDeploy>
  isLoadingMemeInfo: boolean
  isLoadingMemeImg: boolean
  isLoadingMemePoster: boolean
}

export const CreateTokenForm = forwardRef<{}, Props>((props, ref) => {
  const { isLoadingMemeInfo, isLoadingMemeImg, isLoadingMemePoster } = props
  const { deployFee, deploySymbol, isDeploying } = props.deployResult
  const {
    url,
    form,
    chains,
    formSchema,
    formFields,
    onSubmit,
    onChangeUpload,
  } = props.formData
  const { switchChain } = useSwitchChain()

  const [handLoadingPoster, setHandLoadingPoster] = useState(false)

  const { t } = useTranslation()

  const fee = Number(formatEther(BigInt(deployFee))).toFixed(3)
  const symbol = deploySymbol

  const beforeSubmit = (values: z.infer<typeof formSchema>) => {
    if (isLoadingMemeInfo || isLoadingMemeImg) {
      toast.warning(t('onsubmit.createing.warning'))
      return
    }
    onSubmit(values)
  }

  const getAIMemePoster = async (e: any) => {
    e.preventDefault()

    const fullname = form.getValues(formFields.fullname) as string
    const description = form.getValues(formFields.description) as string
    if (!fullname || !description) {
      return toast.warning(t('need.base.info.warning'))
    }
    try {
      setHandLoadingPoster(true)
      const { data } = await aiApi.getMemePoster({
        name: fullname,
        description,
      })
      form.setValue(formFields.poster, [...data.poster1, ...data.poster2])
    } catch {
    } finally {
      setHandLoadingPoster(false)
    }
  }

  const loadingPoster = isLoadingMemePoster || handLoadingPoster

  useEffect(() => {
    if (url) {
      form.setValue(formFields.logo, url)
    }
  }, [url])

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(beforeSubmit)}
          className="flex flex-col space-y-3 max-sm:w-full max-sm:space-y-2"
        >
          {/* Loog/name/chain/symbol */}
          <div className="flex gap-5  max-sm:flex-col max-sm:gap-1">
            <div className="flex">
              {/* Logo */}
              <FormField
                control={form.control}
                name={formFields.logo}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={cn(
                          'relative flex',
                          'border-2 border-black rounded-md overflow-hidden',
                          'w-[150px] h-[150px]'
                        )}
                      >
                        {!isLoadingMemeImg && field.value ? (
                          <div>
                            <img
                              src={field.value as string}
                              alt="logo"
                              className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              'absolute top-0 left-0 flex flex-col items-center justify-end w-full h-full p-2',
                              !field.value && !isLoadingMemeImg
                                ? 'justify-center'
                                : ''
                            )}
                          >
                            {!isLoadingMemeImg ? (
                              <div className=" text-center">
                                <div className="mb-4 text-gray-400">
                                  {t('meme.logo')}
                                </div>
                                <span>{t('click.upload')}</span>
                              </div>
                            ) : (
                              <>
                                <img
                                  src="/images/logo-loading.png"
                                  alt="logo"
                                  className="w-[60%] h-[60%] object-cover"
                                />
                                <div className="mt-2 px-3 text-sm text-center">
                                  {t('ai.createing.logo')}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        <Input
                          placeholder={t('logo.placeholder')}
                          type="file"
                          {...field}
                          value={''}
                          className="h-full opacity-0"
                          inputClassName="h-full w-full absolute top-0 left-0 cursor-pointer z-10"
                          onChange={onChangeUpload}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* name/symbol */}
              <div className=" flex flex-col ml-5 items-center justify-between max-w-[200px]">
                <FormField
                  control={form.control}
                  name={formFields.fullname}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="mt-0">*{t('fullname')}</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder={t('name.placeholder')}
                          {...field}
                          className="w-full"
                          inputClassName="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={formFields.symbol}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>*{t('symbol')}</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          placeholder={t('symbol.placeholder')}
                          {...field}
                          className="w-full"
                          inputClassName="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* chain */}
            <FormField
              control={form.control}
              name={formFields.chainName}
              render={({ field }) => (
                <FormItem className="mt-0">
                  <FormLabel className="mt-0">
                    *
                    {fmt.firstUpperCase(
                      chains.find((c) => c.name === field.value)?.name
                    )}{' '}
                    {t('chain')}
                  </FormLabel>
                  <FormControl>
                    {chains ? (
                      <RadioGroup
                        onValueChange={(v: string) => {
                          form.setValue(formFields.chainName, v)
                        }}
                        defaultValue={field.value}
                        className="flex w-max gap-0 border-2 border-black rounded-md overflow-hidden flex-wrap  max-sm:w-max"
                      >
                        {chains?.map((c, i) => (
                          <FormItem
                            key={i}
                            title={c.name}
                            className={cn(
                              'block p-1 min-w-[35px]',
                              c.name === field.value! ? 'bg-black' : '',
                              i !== chains.length - 1
                                ? 'border-r-2 border-black'
                                : ''
                            )}
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={c.name}
                                disabled={!c.is_supported}
                                onClick={() => {
                                  switchChain({ chainId: Number(c.id) })
                                }}
                              >
                                <img
                                  src={c.logo}
                                  alt={c.name}
                                  about={c.name}
                                  className={cn(
                                    'w-[27px] h-[27px] block rounded-full overflow-hidden',
                                    !c.is_supported
                                      ? 'opacity-50 cursor-not-allowed'
                                      : ''
                                  )}
                                />
                              </RadioGroupItem>
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div>{t('loading')}</div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name={formFields.description}
            render={({ field }) => (
              <FormItem className="max-w-[500px]">
                <FormLabel>*{t('description.placeholder')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('description.placeholder')}
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Poster */}
          <FormField
            control={form.control}
            name={formFields.poster}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="mr-2">
                    {loadingPoster ? t('ai.poster.tip') : t('ai.poster')}
                  </FormLabel>
                  <FormControl>
                    {loadingPoster ? (
                      <img src="/images/poster-loading.png" alt="loading" />
                    ) : !!field.value?.length ? (
                      <div className="flex gap-3 w-max max-md:w-[99%] max-md:overflow-x-auto">
                        {(field.value as string[])?.map((item, i) => {
                          return (
                            <a
                              href={item}
                              key={item}
                              download
                              target="_blank"
                              className={cn('flex-shrink-0')}
                            >
                              <img
                                src={item}
                                className={cn(
                                  'object-cover rounded-md',
                                  i < 2
                                    ? 'w-[133px] h-[153px]'
                                    : 'w-[233px] h-[153px]'
                                )}
                              />
                            </a>
                          )
                        })}
                      </div>
                    ) : (
                      <Button onClick={getAIMemePoster}>
                        {t('create.ai.poster')}
                      </Button>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          {/* Twitter & telegram */}
          <div className="flex justify-between max-w-[500px]">
            <FormField
              control={form.control}
              name={formFields.twitter}
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel>{t('twitter-x')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('twitter-x.placeholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={formFields.telegram}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>{t('telegram')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('telegram.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Website */}
          <div className="flex justify-between max-w-[500px]">
            <FormField
              control={form.control}
              name={formFields.website}
              render={({ field }) => (
                <FormItem className="flex-1 mr-4">
                  <FormLabel>{t('website')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('website.placeholder')}
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={formFields.website}
              render={({ field }) => (
                <FormItem className="flex-1 opacity-0">
                  <FormLabel>{t('website')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('website.placeholder')}
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-start space-y-2 max-w-[500px]">
            <Button
              variant="default"
              className="self-center px-10 mt-3"
              disabled={isDeploying}
            >
              {t('create')}
            </Button>
            <p className="text-zinc-400 text-xs">
              {t('deploy.fee')}: {fee} {symbol}
            </p>
          </div>
        </form>
      </Form>
    </>
  )
})

export default CreateTokenForm
