'use client'

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { UserIcon } from '@heroicons/react/16/solid'
import { useMemo, useState } from 'react'

export type SelectOption = {
  id: string | number
  imageUrl?: string
  name: string
}

type SearchableComboboxProps<T extends SelectOption> = {
  allowCustomValue?: boolean
  className?: string
  label: string
  onChange: (option: T) => void
  options: readonly T[]
  placeholder?: string
  showOptionIcon?: boolean
  value: T | null
}

export const SearchableCombobox = <T extends SelectOption>({
  allowCustomValue = false,
  className,
  label,
  onChange,
  options,
  placeholder,
  showOptionIcon = true,
  value,
}: SearchableComboboxProps<T>) => {
  const [query, setQuery] = useState('')

  const filteredOptions = useMemo(() => {
    if (!query.trim()) {
      return [...options]
    }

    const normalizedQuery = query.trim().toLowerCase()

    return options.filter((option) =>
      option.name.toLowerCase().includes(normalizedQuery),
    )
  }, [options, query])

  const normalizedQuery = query.trim()
  const hasQuery = normalizedQuery.length > 0
  const hasExistingOption = options.some(
    (option) => option.name.toLowerCase() === normalizedQuery.toLowerCase(),
  )
  const showCustomOption = allowCustomValue && hasQuery && !hasExistingOption

  return (
    <Combobox
      as="div"
      className={className ?? 'space-y-2'}
      value={value}
      onChange={(selectedOption: T | null) => {
        if (!selectedOption) {
          return
        }

        setQuery('')
        onChange(selectedOption)
      }}
    >
      <Label className="block text-sm font-semibold text-slate-700">{label}</Label>

      <div className="relative">
        <ComboboxInput
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 pr-11 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          displayValue={(option: T | null) => option?.name ?? ''}
          onBlur={() => setQuery('')}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
        />

        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 transition hover:text-slate-700">
          <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          transition
          className="absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-xl outline-none data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in data-[closed]:data-[leave]:opacity-0"
        >
          {showCustomOption ? (
            <ComboboxOption
              value={{ id: normalizedQuery, name: normalizedQuery } as T}
              className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-slate-800 transition data-[focus]:bg-emerald-600 data-[focus]:text-white"
            >
              {showOptionIcon ? (
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-300 transition group-data-[focus]:bg-white">
                  <UserIcon
                    className="h-4 w-4 fill-white group-data-[focus]:fill-emerald-600"
                    aria-hidden="true"
                  />
                </div>
              ) : null}
              <span
                className={`block truncate font-medium ${
                  showOptionIcon ? 'ml-3' : ''
                }`}
              >
                {normalizedQuery}
              </span>
            </ComboboxOption>
          ) : null}

          {filteredOptions.map((option) => (
            <ComboboxOption
              key={option.id}
              value={option}
              className="group flex cursor-pointer items-center rounded-lg px-3 py-2 text-slate-800 transition data-[focus]:bg-emerald-600 data-[focus]:text-white"
            >
              {showOptionIcon ? (
                option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-300 transition group-data-[focus]:bg-white">
                    <UserIcon
                      className="h-4 w-4 fill-white group-data-[focus]:fill-emerald-600"
                      aria-hidden="true"
                    />
                  </div>
                )
              ) : null}
              <span
                className={`block truncate font-medium ${
                  showOptionIcon ? 'ml-3' : ''
                }`}
              >
                {option.name}
              </span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </Combobox>
  )
}
