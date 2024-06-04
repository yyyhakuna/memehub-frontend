import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { CustomSuspense } from '@/components/custom-suspense'
import { NewsSkeleton } from '@/components/news/skeleton'
import { useNewsList } from '@/hooks/use-news-list'
import { NewsCard } from '@/components/news'
import { Routes } from '@/routes'

export const HotNewsAside = () => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { handleClick, isFetching, newsList } = useNewsList({
    isOpportunity: true,
  })

  return (
    <aside className="w-aside max-sm:hidden border-r-2 border-black pt-3 min-h-body">
      <div className="h-fit sticky top-20">
        <h2 className="text-red-500 text-xl font-bold mb-4">
          {t('hot-opportunity')}
        </h2>
        <CustomSuspense
          isPending={isFetching}
          fallback={<NewsSkeleton />}
          nullback={<>{t('no.data')}</>}
          className="flex flex-col gap-3 pr-5"
        >
          {newsList?.map((news, i) => (
            <NewsCard
              key={i}
              news={news!}
              onMeme={() => {
                handleClick(news)
              }}
              onClick={() => {
                push(`${Routes.Idea}/${news?.id}?type=2`)
              }}
            />
          ))}
        </CustomSuspense>
        {/* <AICreateMemecoinDialog
          data={{
            name: memeit?.title,
            image: memeit?.image,
            description: memeit?.content,
          }}
          show={show}
          onCancel={hidden}
          onConfirm={() => {}}
        /> */}
      </div>
    </aside>
  )
}

export default HotNewsAside
