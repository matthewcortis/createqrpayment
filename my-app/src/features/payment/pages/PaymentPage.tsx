import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { PaymentBuilderPanel } from '../components/PaymentBuilderPanel'
import { PaymentPreviewPanel } from '../components/PaymentPreviewPanel'
import {
  DEFAULT_PAYMENT_FORM,
  MISSING_FIELDS_MESSAGE,
} from '../constants/payment.constants'
import { useCopyFeedback } from '../hooks/useCopyFeedback'
import type { PaymentPayload } from '../types/payment.types'
import {
  buildShareLink,
  buildVietQrLink,
  isPayloadComplete,
  normalizePaymentPayload,
  parseSharedPayload,
} from '../utils/payment-links'
import { updatePaymentMetadata } from '../utils/payment-meta'

export const PaymentPage = () => {
  const currentUrl = window.location.href

  const sharedPayload = useMemo(
    () => parseSharedPayload(window.location.search),
    [],
  )
  const receiverMode = sharedPayload !== null

  const [formValues, setFormValues] = useState<PaymentPayload>(
    sharedPayload ?? DEFAULT_PAYMENT_FORM,
  )
  const [createdPayload, setCreatedPayload] = useState<PaymentPayload | null>(
    sharedPayload,
  )
  const [shareLink, setShareLink] = useState<string>(
    receiverMode ? currentUrl : '',
  )
  const [errorMessage, setErrorMessage] = useState('')

  const { copiedKey, copyValue } = useCopyFeedback()

  const activePayload = receiverMode ? sharedPayload : createdPayload
  const qrImageLink = activePayload ? buildVietQrLink(activePayload) : ''

  useEffect(() => {
    updatePaymentMetadata({
      payload: activePayload,
      qrImageLink,
      receiverMode,
      url: shareLink || currentUrl,
    })
  }, [activePayload, currentUrl, qrImageLink, receiverMode, shareLink])

  const handleFieldChange = (
    field: keyof PaymentPayload,
    value: string,
  ): void => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const handleCopy = async (value: string, key: string): Promise<void> => {
    await copyValue(value, key)
  }

  const handleGenerateLink = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    const payload = normalizePaymentPayload(formValues)

    if (!isPayloadComplete(payload)) {
      setErrorMessage(MISSING_FIELDS_MESSAGE)
      return
    }

    setErrorMessage('')
    setCreatedPayload(payload)
    setFormValues(payload)
    setShareLink(buildShareLink(payload, currentUrl))
  }

  if (receiverMode && activePayload) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 px-4 py-6 sm:px-6 lg:px-10">
        <section className="mx-auto w-full max-w-3xl">
          <PaymentPreviewPanel
            copiedKey={copiedKey}
            payload={activePayload}
            qrImageLink={qrImageLink}
            receiverMode={receiverMode}
            shareLink={shareLink}
            onCopy={handleCopy}
          />
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 px-4 py-6 sm:px-6 lg:px-10">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-300/70 bg-white/80 shadow-2xl shadow-slate-900/15 backdrop-blur md:grid-cols-[1.15fr_0.85fr]">
        <div className="border-b border-slate-200 p-6 sm:p-8 md:border-b-0 md:border-r">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            LÃO RÂU BẠC
          </p>

          <PaymentBuilderPanel
            errorMessage={errorMessage}
            formValues={formValues}
            onFieldChange={handleFieldChange}
            onSubmit={handleGenerateLink}
          />
        </div>

        <PaymentPreviewPanel
          copiedKey={copiedKey}
          payload={activePayload}
          qrImageLink={qrImageLink}
          receiverMode={receiverMode}
          shareLink={shareLink}
          onCopy={handleCopy}
        />
      </section>
    </main>
  )
}
