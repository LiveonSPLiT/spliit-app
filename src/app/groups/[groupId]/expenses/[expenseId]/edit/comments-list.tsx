'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getComment, getComments, getExpense, getGroup } from '@/lib/api'
import { CommentFormValues } from '@/lib/schemas'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CommentForm } from './comment-form'
import { CommentItem } from './comment-item'

type Props = {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>
  expense: NonNullable<Awaited<ReturnType<typeof getExpense>>>
  comments: NonNullable<Awaited<ReturnType<typeof getComments>>>
  onCreate: (values: CommentFormValues, participantId: string) => Promise<void>
  onUpdate: (values: CommentFormValues, commentId: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export function CommentsList({
  group,
  expense,
  comments,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [selectedComment, setSelectedComment] =
    useState<NonNullable<Awaited<ReturnType<typeof getComment>>>>()
  const t = useTranslations('ExpenseForm')

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('expenseCommentField.label')}</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            comments.map(
              (
                comment: NonNullable<Awaited<ReturnType<typeof getComment>>>,
              ) => (
                <CommentItem
                  key={comment.id}
                  group={group}
                  comment={comment}
                  onDelete={onDelete}
                  onClick={(
                    comment: NonNullable<
                      Awaited<ReturnType<typeof getComment>>
                    >,
                  ) => {
                    setSelectedComment(comment)
                  }}
                />
              ),
            )
          ) : (
            <p className="px-6 text-sm py-6">
              {t('expenseCommentField.noCommentText')}{' '}
            </p>
          )}
        </CardContent>
      </Card>
      <CommentForm
        group={group}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onCancel={() => setSelectedComment(undefined)}
        comment={selectedComment}
      />
    </>
  )
}
