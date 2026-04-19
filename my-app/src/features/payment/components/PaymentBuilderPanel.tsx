import type { FormEvent } from 'react'
import { SearchableCombobox, type SelectOption } from '@/components/combobox'
import {
  BANK_ID_OPTIONS,
  TEMPLATE_OPTIONS,
} from '../constants/payment.constants'
import type { PaymentPayload } from '../types/payment.types'
import { sanitizeAmount } from '../utils/payment-links'

type PaymentBuilderPanelProps = {
  errorMessage: string
  formValues: PaymentPayload
  onFieldChange: (field: keyof PaymentPayload, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const BANK_OPTIONS: SelectOption[] = BANK_ID_OPTIONS.map((bankId) => ({
  id: bankId,
  name: bankId,
}))

const TEMPLATE_SELECT_OPTIONS: SelectOption[] = TEMPLATE_OPTIONS.map(
  (templateOption) => ({
    id: templateOption,
    name: templateOption,
  }),
)

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'

const labelClass = 'mb-2 block text-sm font-semibold text-slate-700'

export const PaymentBuilderPanel = ({
  errorMessage,
  formValues,
  onFieldChange,
  onSubmit,
}: PaymentBuilderPanelProps) => {
  const selectedBankOption =
    BANK_OPTIONS.find((option) => option.id === formValues.bankId) ??
    (formValues.bankId
      ? { id: formValues.bankId, name: formValues.bankId }
      : null)
  const selectedTemplateOption =
    TEMPLATE_SELECT_OPTIONS.find((option) => option.id === formValues.template) ??
    (formValues.template
      ? { id: formValues.template, name: formValues.template }
      : null)

  return (
    <>
      <h1 className="font-heading text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
        Tạo link QR thanh toán
      </h1>
      <p className="mt-3 text-sm text-slate-600 sm:text-base">
        Nhập số tiền và nội dung để sinh link gửi khách.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <label htmlFor="amount">
          <span className={labelClass}>Số tiền (VND)</span>
          <input
            id="amount"
            className={inputClass}
            type="text"
            inputMode="numeric"
            placeholder="Ví dụ: 10000 (có thể bỏ trống)"
            value={formValues.amount}
            onChange={(event) =>
              onFieldChange('amount', sanitizeAmount(event.target.value))
            }
          />
        </label>

        <label htmlFor="addInfo">
          <span className={labelClass}>Nội dung chuyển khoản</span>
          <textarea
            id="addInfo"
            className={`${inputClass} min-h-[92px] resize-y`}
            placeholder="Ví dụ: noi dung chuyen khoan (có thể bỏ trống)"
            value={formValues.addInfo}
            onChange={(event) => onFieldChange('addInfo', event.target.value)}
          />
        </label>

        <label htmlFor="accountName">
          <span className={labelClass}>Tên tài khoản</span>
          <input
            id="accountName"
            className={inputClass}
            type="text"
            value={formValues.accountName}
            onChange={(event) => onFieldChange('accountName', event.target.value)}
            required
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SearchableCombobox
            className="space-y-2"
            label="Bank ID"
            options={BANK_OPTIONS}
            value={selectedBankOption}
            onChange={(selected) => onFieldChange('bankId', String(selected.id))}
          />

          <label htmlFor="accountNo">
            <span className={labelClass}>Số tài khoản</span>
            <input
              id="accountNo"
              className={inputClass}
              type="text"
              value={formValues.accountNo}
              onChange={(event) => onFieldChange('accountNo', event.target.value)}
              required
            />
          </label>

          <SearchableCombobox
            className="space-y-2"
            label="Template"
            options={TEMPLATE_SELECT_OPTIONS}
            placeholder="Chọn template"
            showOptionIcon={false}
            value={selectedTemplateOption}
            onChange={(selected) => onFieldChange('template', String(selected.id))}
          />
        </div>

        {errorMessage ? (
          <p className="text-sm font-semibold text-rose-600">{errorMessage}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5"
          >
            Tạo link
          </button>
          <p className="text-sm text-slate-500">QR theo đúng cú pháp Quick Link VietQR.</p>
        </div>
      </form>
    </>
  )
}
