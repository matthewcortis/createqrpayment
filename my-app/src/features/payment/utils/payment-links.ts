import type { PaymentPayload } from '../types/payment.types'
import { DEFAULT_TRANSFER_CONTENT } from '../constants/payment.constants'

export const sanitizeAmount = (value: string): string => value.replace(/[^\d]/g, '')

export const normalizePaymentPayload = (payload: PaymentPayload): PaymentPayload => {
  const normalizedAddInfo = payload.addInfo.trim()

  return {
    bankId: payload.bankId.trim().toLowerCase(),
    accountNo: payload.accountNo.trim(),
    template: payload.template.trim(),
    amount: sanitizeAmount(payload.amount),
    addInfo: normalizedAddInfo || DEFAULT_TRANSFER_CONTENT,
    accountName: payload.accountName.trim(),
  }
}

export const isPayloadComplete = (payload: PaymentPayload): boolean =>
  payload.bankId.length > 0 &&
  payload.accountNo.length > 0 &&
  payload.template.length > 0 &&
  payload.addInfo.length > 0 &&
  payload.accountName.length > 0

export const parseSharedPayload = (search: string): PaymentPayload | null => {
  const params = new URLSearchParams(search)

  if (params.get('mode') !== 'pay') {
    return null
  }

  const payload = normalizePaymentPayload({
    bankId: params.get('bankId') ?? '',
    accountNo: params.get('accountNo') ?? '',
    template: params.get('template') ?? 'compact2',
    amount: params.get('amount') ?? '',
    addInfo: params.get('addInfo') ?? '',
    accountName: params.get('accountName') ?? '',
  })

  return isPayloadComplete(payload) ? payload : null
}

export const buildVietQrLink = (payload: PaymentPayload): string => {
  const query = new URLSearchParams({
    addInfo: payload.addInfo,
    accountName: payload.accountName,
  })

  if (payload.amount) {
    query.set('amount', payload.amount)
  }

  const imageKey = `${payload.bankId}-${payload.accountNo}-${payload.template}`
  return `https://img.vietqr.io/image/${imageKey}.png?${query.toString()}`
}

export const buildShareLink = (
  payload: PaymentPayload,
  currentUrl: string,
): string => {
  const url = new URL(currentUrl)
  url.search = ''
  url.hash = ''

  url.searchParams.set('mode', 'pay')
  url.searchParams.set('addInfo', payload.addInfo)
  url.searchParams.set('bankId', payload.bankId)
  url.searchParams.set('accountNo', payload.accountNo)
  url.searchParams.set('template', payload.template)
  url.searchParams.set('accountName', payload.accountName)

  if (payload.amount) {
    url.searchParams.set('amount', payload.amount)
  }

  return url.toString()
}
