'use client'

import React, { useRef, useEffect } from 'react'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { IconSend, IconHiint, IconSpinner } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import type { UseChatHelpers } from 'ai/react'
import { useControlFeedBack, useControlHint } from '@/app/(chat)/[id]/action'

export function PromptForm({
  isLoading,
  input,
  isFinished,
  setInput,
  onSubmit,
  onRequestHint
}: Pick<UseChatHelpers, 'input' | 'setInput' | 'isLoading'> & {
  isFinished: boolean
  onSubmit: (value: string) => Promise<void>
  onRequestHint: () => Promise<void>
}) {
  const { open: openHint } = useControlHint()
  const { open } = useControlFeedBack()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  if (isFinished)
    return (
      <Button size="cta" onClick={open}>
        피드백 보기
      </Button>
    )
  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // // Blur focus on mobile
        // if (window.innerWidth < 600) {
        //   e.target['message']?.blur()
        // }

        if (isLoading) return

        const value = input.trim()
        setInput('')
        await onSubmit(value)
      }}
    >
      <div className="relative flex justify-center items-center gap-2 max-h-60 w-full grow overflow-hidden bg-background">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full place-center bg-background hover:bg-muted/90 p-2"
          onClick={async e => {
            e.preventDefault()
            await onRequestHint()
            openHint()
          }}
        >
          <IconHiint />
          <span className="sr-only">Show Hint</span>
        </Button>
        <div className="flex justify-center items-center rounded-full bg-muted px-4 h-12 flex-1">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="메시지를 입력하세요."
            className="size-full bg-transparent resize-none focus-within:outline-none text-sm text-muted-foreground"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Button
            className="size-8 bg-transparent hover:bg-transparent p-0 cursor-pointer"
            type="submit"
            size="icon"
            variant="ghost"
            disabled={isLoading || input.trim() === ''}
          >
            {isLoading ? (
              <IconSpinner />
            ) : (
              <IconSend
                className={
                  isLoading || input.trim() === '' ? '' : 'text-primary'
                }
              />
            )}
            <span className="sr-only">메시지 보내기</span>
          </Button>
        </div>
      </div>
    </form>
  )
}
