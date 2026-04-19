import { ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { currencyFormatter } from '../constants/payment.constants'
import type { PaymentPayload } from '../types/payment.types'

type PaymentPreviewPanelProps = {
  className?: string
  copiedKey: string
  payload: PaymentPayload | null
  qrImageLink: string
  receiverMode: boolean
  shareLink: string
  onCopy: (value: string, key: string) => Promise<void>
}

type ReceiverInfoRow = {
  canCopy: boolean
  copyKey: string
  copyValue: string
  label: string
  value: string
}

const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700'

const copyButtonClass =
  'inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:border-white/70 disabled:hover:text-slate-700'

const buildReceiverInfoRows = (payload: PaymentPayload): ReceiverInfoRow[] => {
  const amountLabel = payload.amount
    ? currencyFormatter.format(Number(payload.amount))
    : 'Khách tự nhập số tiền'

  return [
    {
      canCopy: true,
      copyKey: 'accountNo',
      copyValue: payload.accountNo,
      label: 'Số tài khoản',
      value: payload.accountNo,
    },
    {
      canCopy: Boolean(payload.amount),
      copyKey: 'amount',
      copyValue: payload.amount,
      label: 'Số tiền',
      value: amountLabel,
    },
    {
      canCopy: true,
      copyKey: 'addInfo',
      copyValue: payload.addInfo,
      label: 'Nội dung',
      value: payload.addInfo,
    },
  ]
}

export const PaymentPreviewPanel = ({
  className = '',
  copiedKey,
  payload,
  qrImageLink,
  receiverMode,
  shareLink,
  onCopy,
}: PaymentPreviewPanelProps) => {
  if (!payload) {
    return (
      <aside
        className={`flex items-center justify-center bg-gradient-to-b from-teal-50 to-amber-50 p-6 sm:p-8 ${className}`.trim()}
      >
        <p className="max-w-sm text-center text-sm text-slate-600 sm:text-base">
          Sau khi bấm <strong>Tạo link</strong>, khu vực này sẽ hiển thị QR và đường
          dẫn để gửi khách.
        </p>
      </aside>
    )
  }

  if (receiverMode) {
    const infoRows = buildReceiverInfoRows(payload)

    return (
      <aside className={className}>
        <div className="rounded-3xl border border-white/55 bg-white/35 p-4 shadow-[0_20px_55px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            VietQR Dynamic Link
          </p>
          <p className="mt-3 text-sm text-slate-700 sm:text-base">
            Quét QR hoặc copy thông tin chuyển khoản phía dưới.
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Mã QR
          </p>

          <div className="mx-auto mt-3 aspect-square w-full max-w-[350px] rounded-2xl border border-white/70 bg-white/70 p-4 shadow-xl shadow-slate-900/15 sm:max-w-[370px]">
            <img
              src={qrImageLink}
              alt="QR thanh toán"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="mt-5 space-y-2">
            {infoRows.map((row) => (
              <article
                key={row.copyKey}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/45 px-3 py-2 backdrop-blur"
              >
                <div className="min-w-0 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {row.label}
                  </p>
                  <p className="break-words font-mono text-sm font-semibold text-slate-900">
                    {row.value}
                  </p>
                </div>

                <button
                  type="button"
                  className={`${copyButtonClass} ${
                    copiedKey === row.copyKey
                      ? 'border-emerald-500 bg-white/90 text-emerald-700'
                      : ''
                  }`}
                  onClick={() => void onCopy(row.copyValue, row.copyKey)}
                  disabled={!row.canCopy}
                >
                  <ClipboardDocumentIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Sao chép</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  const amountLabel = payload.amount
    ? currencyFormatter.format(Number(payload.amount))
    : 'Khách tự nhập số tiền'

  return (
    <aside
      className={`flex flex-col items-center gap-4 bg-gradient-to-b from-teal-50 to-amber-50 p-6 text-center sm:p-8 ${className}`.trim()}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        Mã QR
      </p>

      <div className="aspect-square w-full max-w-[330px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
        <img
          src={qrImageLink}
          alt="QR thanh toán"
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="rounded-full bg-emerald-100 px-4 py-1.5 font-heading text-sm font-semibold text-emerald-800">
        {amountLabel}
      </div>

      <p className="max-w-[330px] break-words font-mono text-sm font-semibold text-slate-800">
        {payload.addInfo}
      </p>

      <div className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Quick Link VietQR
        </span>
        <a
          className="mt-1 block text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          href={qrImageLink}
          target="_blank"
          rel="noreferrer"
        >
          Mở ảnh QR gốc
        </a>
      </div>

      {shareLink ? (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left">
          <label
            className="mb-2 block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500"
            htmlFor="shareLink"
          >
            Link gửi khách
          </label>
          <input
            id="shareLink"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            type="text"
            value={shareLink}
            readOnly
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => void onCopy(shareLink, 'shareLink')}
            >
              {copiedKey === 'shareLink' ? 'Đã copy link' : 'Copy link'}
            </button>
            <a
              className={secondaryButtonClass}
              href={shareLink}
              target="_blank"
              rel="noreferrer"
            >
              Mở trang khách
            </a>
          </div>
        </div>
      ) : null}
    </aside>
  )
}
