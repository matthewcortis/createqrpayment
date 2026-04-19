import { ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { currencyFormatter } from '../constants/payment.constants'
import type { PaymentPayload } from '../types/payment.types'

type PaymentReceiverPanelProps = {
  payload: PaymentPayload
  onCopy: (value: string, key: string) => Promise<void>
}

type ReceiverInfoRow = {
  canCopy: boolean
  copyKey: string
  copyValue: string
  label: string
  value: string
}

const copyButtonClass =
  'inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-slate-300 disabled:hover:text-slate-700'

const buildInfoRows = (payload: PaymentPayload): ReceiverInfoRow[] => {
  const amountText = payload.amount
    ? currencyFormatter.format(Number(payload.amount))
    : '0'
  const amountToCopy = payload.amount || '0'

  return [
    {
      canCopy: true,
      copyKey: 'accountNo',
      copyValue: payload.accountNo,
      label: 'Số tài khoản',
      value: payload.accountNo,
    },
    {
      canCopy: true,
      copyKey: 'amount',
      copyValue: amountToCopy,
      label: 'Số tiền',
      value: amountText,
    },
    {
      canCopy: true,
      copyKey: 'addInfo',
      copyValue: payload.addInfo,
      label: 'Nội dung',
      value: payload.addInfo,
    }
  ]
}

export const PaymentReceiverPanel = ({
  payload,
  onCopy,
}: PaymentReceiverPanelProps) => {
  const rows = buildInfoRows(payload)

  return (
    <>
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:hidden">
        <div className="divide-y divide-slate-200">
          {rows.map((row) => (
            <div key={row.copyKey} className="grid gap-2 py-3 first:pt-0 last:pb-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {row.label}
              </span>
              <strong className="break-words font-mono text-sm text-slate-900">
                {row.value}
              </strong>
              <button
                type="button"
                className={`${copyButtonClass} w-fit`}
                onClick={() => void onCopy(row.copyValue, row.copyKey)}
                disabled={!row.canCopy}
              >
                <ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />
                <span>Sao chép</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 hidden gap-3 sm:grid">
        {rows.map((row) => (
          <article
            key={row.copyKey}
            className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[120px_minmax(0,1fr)_auto] sm:items-center"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {row.label}
            </span>
            <strong className="break-words font-mono text-sm text-slate-900 sm:text-base">
              {row.value}
            </strong>
            <button
              type="button"
              className={copyButtonClass}
              onClick={() => void onCopy(row.copyValue, row.copyKey)}
              disabled={!row.canCopy}
            >
              <ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />
              <span>Sao chép</span>
            </button>
          </article>
        ))}
      </div>
    </>
  )
}
