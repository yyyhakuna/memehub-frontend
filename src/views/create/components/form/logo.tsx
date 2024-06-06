import {
  FormItem,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { t } from 'i18next'
import { useCreateTokenForm } from '../../hooks/use-form'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import Input from '@/components/input'
import { useEffect } from 'react'
import { aiApi } from '@/api/ai'
import { Button } from '@/components/ui/button'
import { LuRefreshCcw } from 'react-icons/lu'
import { toast } from 'sonner'
import { Router } from 'next/router'

interface Props {
  formData: ReturnType<typeof useCreateTokenForm>
}

let memeLogoSign = new AbortController()
export const FormLogo = ({ formData }: Props) => {
  const { form, formFields } = formData
  const { loadingLogo, setLoadingLogo } = useAimemeInfoStore()

  const createLogo = (e: any) => {
    e.stopPropagation()
    e.preventDefault()
    if (
      form.getValues(formFields?.fullname) === '' ||
      form.getValues(formFields?.description) === ''
    ) {
      toast.warning(t('need.base.info.warning'))
      return
    }
    setLoadingLogo(true)
  }

  const fetchMemeLogo = () => {
    memeLogoSign.abort()
    memeLogoSign = new AbortController()
    aiApi
      .getMemeImage(
        {
          name: form.getValues(formFields.fullname)! as string,
          description: form.getValues(formFields.description)! as string,
        },
        memeLogoSign.signal
      )
      .then(({ data }) => {
        if (data) {
          form.setValue(formFields.logo, data[0])
        }
      })
      .finally(() => {
        setLoadingLogo(false)
      })
  }

  useEffect(() => {
    if (loadingLogo) {
      fetchMemeLogo()
    }
  }, [loadingLogo])

  useEffect(() => {
    const cb = () => {
      memeLogoSign.abort()
    }
    Router.events.on('routeChangeStart', cb)
    return () => {
      Router.events.off('routeChangeStart', cb)
    }
  }, [])

  return (
    <div>
      <FormField
        control={form?.control}
        name={formFields?.logo!}
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
                {loadingLogo ? (
                  <div
                    className={cn(
                      'absolute top-0 left-0 flex flex-col items-center justify-end w-full h-full p-2',
                      !field.value && !loadingLogo ? 'justify-center' : ''
                    )}
                  >
                    <img
                      src="/images/logo-loading.png"
                      alt="logo"
                      className="w-[60%] h-[60%] object-cover"
                    />
                    <div className="mt-2 px-3 text-sm text-center">
                      {t('ai.createing.logo')}
                    </div>
                  </div>
                ) : field.value ? (
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
                      !field.value && !loadingLogo ? 'justify-center' : ''
                    )}
                  >
                    <div className=" text-center">
                      <div className="mb-4 text-gray-400">{t('meme.logo')}</div>
                      <span>{t('click.upload')}</span>
                    </div>
                  </div>
                )}
                <Input
                  placeholder={t('logo.placeholder')}
                  type="file"
                  {...field}
                  value={''}
                  className="h-full opacity-0"
                  inputClassName="h-full w-full absolute top-0 left-0 cursor-pointer z-10"
                  onChange={formData.onChangeUpload}
                />
              </div>
            </FormControl>
            <FormMessage />

            {!loadingLogo ? (
              <Button className="mt-2 mb-2" onClick={createLogo}>
                <LuRefreshCcw className="mr-1" />
                {t('create.ai.logo')}
              </Button>
            ) : null}
          </FormItem>
        )}
      />
    </div>
  )
}
