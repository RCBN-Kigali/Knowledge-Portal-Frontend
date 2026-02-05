import { forwardRef, useId, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import clsx from 'clsx'

interface RadioGroupContextType {
  name: string
  value?: string
  onChange?: (value: string) => void
}

const RadioGroupCtx = createContext<RadioGroupContextType | null>(null)

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export interface RadioGroupProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  children: ReactNode
  label?: string
  error?: string
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, disabled, value, className, ...props },
  ref
) {
  const id = useId()
  const group = useContext(RadioGroupCtx)

  return (
    <div className={clsx('relative', className)}>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={id}
          type="radio"
          disabled={disabled}
          name={group?.name}
          value={value}
          checked={group ? group.value === value : undefined}
          onChange={(e) => {
            group?.onChange?.(e.target.value)
            props.onChange?.(e)
          }}
          className="mt-0.5 w-5 h-5 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label
                htmlFor={id}
                className={clsx(
                  'text-sm font-medium cursor-pointer',
                  disabled ? 'text-gray-400' : 'text-gray-700'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
})

export function RadioGroup({
  name,
  value,
  onChange,
  children,
  label,
  error,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <RadioGroupCtx.Provider value={{ name, value, onChange }}>
      <fieldset className={className}>
        {label && (
          <legend className="text-sm font-medium text-gray-700 mb-2">{label}</legend>
        )}
        <div
          className={clsx(
            'gap-3',
            orientation === 'horizontal' ? 'flex flex-wrap' : 'flex flex-col'
          )}
        >
          {children}
        </div>
        {error && (
          <p className="text-sm text-danger-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupCtx.Provider>
  )
}

export default Radio
