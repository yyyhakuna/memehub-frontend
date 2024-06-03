import React, { useEffect, useRef, useState } from 'react'

import { Main } from './components/main'
import { CreateTokenStatusDialog } from './components/dialog'
import { useDeploy } from './hooks/use-deploy'
import { useCreateTokenForm } from './hooks/use-form'
import { useNewsList } from '@/hooks/use-news-list'
import { useAIMemeInfo } from '@/hooks/use-ai-meme-info'
import { useAimemeInfoStore } from '@/stores/use-ai-meme-info-store'
import { OpportunityMoonshot } from '@/components/opportunity-moonshot'
import { CreateTokenContext } from './context'

export const CreatePage = () => {
  const deployResult = useDeploy()
  const [tab, setTab] = useState(0)
  const formData = useCreateTokenForm(deployResult)
  const aiMemeInfo = useAIMemeInfo({ form: formData.form })
  const newsListData = useNewsList({
    formData,
    isOpportunity: tab === 1,
  })
  const aimemeInfoStore = useAimemeInfoStore()
  const isFirst = useRef(true)

  useEffect(() => {
    if (aimemeInfoStore.formInfo?.name !== undefined && isFirst.current) {
      isFirst.current = false
      newsListData.setShow(true)
      aiMemeInfo.getAIMemeImg()
      aimemeInfoStore.setFormInfo(undefined)
    }
  }, [])

  useEffect(() => {
    if (aimemeInfoStore.info?.name !== undefined && isFirst.current) {
      isFirst.current = false
      newsListData.setShow(true)
      aiMemeInfo.getAIMemeInfo(aimemeInfoStore.info?.name || '')
      aimemeInfoStore.setInfo(undefined)
    }
  }, [])

  return (
    <CreateTokenContext.Provider
      value={{
        formData,
        deployResult,
        newsListData,
        aiMemeInfo,
      }}
    >
      <main className="min-h-main flex justify-center mx-auto max-md:flex-col max-md:items-center max-sm:gap-8">
        <OpportunityMoonshot
          className="max-sm:!hidden"
          newsListData={newsListData}
          isDialogLoading={aiMemeInfo.isLoadingMemeInfo}
          onConfirmDialog={() =>
            aiMemeInfo.getAIMemeInfo(newsListData.memeit?.title || '')
          }
          tab={tab}
          setTab={setTab}
        />
        <Main
          className="flex-1  max-md:order-1 max-md:border-l-0 max-md:ml-0 max-md:pl-0"
          tab={tab}
          setTab={setTab}
        />

        {/* All status dialog during create. */}
        <CreateTokenStatusDialog {...deployResult} />
      </main>
    </CreateTokenContext.Provider>
  )
}

export default CreatePage
