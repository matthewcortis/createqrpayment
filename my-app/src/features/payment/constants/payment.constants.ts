import type { PaymentPayload } from '../types/payment.types'

export const DEFAULT_PAYMENT_FORM: PaymentPayload = {
  bankId: 'vietinbank',
  accountNo: '108872561615',
  template: 'compact2',
  amount: '',
  addInfo: '',
  accountName: 'HOANG TUNG DUONG',
}

export const DEFAULT_TRANSFER_CONTENT = 'noi dung chuyen khoan'

export const BANK_ID_OPTIONS = [
  'vietcombank',
  'vietinbank',
  'bidv',
  'agribank',
  'techcombank',
  'mbbank',
  'vpbank',
  'acb',
  'sacombank',
  'tpbank',
] as const

export const TEMPLATE_OPTIONS = [
  'compact',
  'compact2',
  'qr_only',
  'print',
] as const

export const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
})

export const MISSING_FIELDS_MESSAGE =
  'Vui lòng nhập đủ Bank ID, số tài khoản, template và tên tài khoản.'
