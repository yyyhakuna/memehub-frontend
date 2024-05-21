import React, { type ComponentProps, useState } from 'react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

import { CommentCard } from './components/card'
import { CommentForm } from './components/form'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useComments } from './hooks/use-comments'
import { Dialog } from '@/components/ui/dialog'
import { CustomSuspense } from '../custom-suspense'
import { Skeleton } from '../ui/skeleton'

interface Props extends ComponentProps<'div'> {
  readonly?: boolean
}

export const CommentCards = ({ readonly = false }: Props) => {
  const { t } = useTranslation()
  const { comments, isFetching, addComment, likeComment, unlikeComment } =
    useComments()
  const [replyId, setReplyId] = useState('')

  const onComment = (content: string, mentions: string[], img?: string) => {
    const related_comments = [...mentions]

    // Reply another comment.
    if (replyId) related_comments.push(replyId)

    addComment({ content, related_comments, img }).then(() => setReplyId('')) // Close when success.
  }

  return (
    <>
      <Dialog
        open={!isEmpty(replyId)}
        // Close the dialog if `false`.
        onOpenChange={(value) => !value && setReplyId('')}
      >
        <CommentForm onComment={onComment} />
      </Dialog>
      {!readonly && <CommentForm className="mb-4" onComment={onComment} />}
      <div className="flex flex-col gap-2">
        <CustomSuspense
          isPending={isFetching}
          fallback={<CardSkeleton />}
          nullback={<p className="text-zinc-500">{t('comment.list.empty')}</p>}
        >
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              c={c}
              readonly={readonly}
              onLike={likeComment}
              onUnlike={unlikeComment}
              onReply={(id) => setReplyId(id)}
            />
          ))}
        </CustomSuspense>
      </div>
      {/* <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </>
  )
}

const CardSkeleton = () => {
  return Array.from({ length: 3 }).map(() => (
    <div className="border shadow rounded-md flex flex-col p-4">
      <div className="flex gap-2 items-stretch">
        <Skeleton className="rounded-full w-8 h-8" />
        <div className="flex flex-col justify-between">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  ))
}

export default CommentCards
