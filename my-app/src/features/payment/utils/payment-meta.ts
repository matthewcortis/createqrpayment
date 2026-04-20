import { currencyFormatter } from '../constants/payment.constants'
import type { PaymentPayload } from '../types/payment.types'

const DEFAULT_TITLE = 'Tao link QR thanh toan'
const DEFAULT_DESCRIPTION = 'Tao nhanh link QR chuyen khoan de gui khach hang.'

type MetaTarget = {
  content: string
  key: string
  selector: 'name' | 'property'
}

type UpdatePaymentMetadataInput = {
  payload: PaymentPayload | null
  qrImageLink: string
  receiverMode: boolean
  url: string
}

const setMetaTag = ({ content, key, selector }: MetaTarget): void => {
  const existing = document.head.querySelector<HTMLMetaElement>(
    `meta[${selector}="${key}"]`,
  )

  if (existing) {
    existing.setAttribute('content', content)
    return
  }

  const element = document.createElement('meta')
  element.setAttribute(selector, key)
  element.setAttribute('content', content)
  document.head.append(element)
}

const getFallbackImage = (): string =>
  `${window.location.origin}/Logo-VNPAY-QR-1.webp`

const buildReceiverDescription = (payload: PaymentPayload): string => {
  const amountText = payload.amount
    ? currencyFormatter.format(Number(payload.amount))
    : 'khong gioi han so tien'

  return `Quet QR de chuyen khoan ${amountText} toi ${payload.accountName}. Noi dung: ${payload.addInfo}.`
}

export const updatePaymentMetadata = ({
  payload,
  qrImageLink,
  receiverMode,
  url,
}: UpdatePaymentMetadataInput): void => {
  const isReceiverPayload = receiverMode && payload !== null
  const title = isReceiverPayload
    ? `QR thanh toan | ${payload.accountName}`
    : DEFAULT_TITLE
  const description = isReceiverPayload
    ? buildReceiverDescription(payload)
    : DEFAULT_DESCRIPTION
  const image = isReceiverPayload ? qrImageLink || getFallbackImage() : getFallbackImage()

  document.title = title

  setMetaTag({ selector: 'name', key: 'description', content: description })
  setMetaTag({ selector: 'property', key: 'og:type', content: 'website' })
  setMetaTag({ selector: 'property', key: 'og:title', content: title })
  setMetaTag({ selector: 'property', key: 'og:description', content: description })
  setMetaTag({ selector: 'property', key: 'og:image', content: image })
  setMetaTag({ selector: 'property', key: 'og:image:alt', content: 'QR thanh toan' })
  setMetaTag({ selector: 'property', key: 'og:url', content: url })
  setMetaTag({ selector: 'name', key: 'twitter:card', content: 'summary_large_image' })
  setMetaTag({ selector: 'name', key: 'twitter:title', content: title })
  setMetaTag({
    selector: 'name',
    key: 'twitter:description',
    content: description,
  })
  setMetaTag({ selector: 'name', key: 'twitter:image', content: image })
}
