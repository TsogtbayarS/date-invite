import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

interface ChoiceButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  primary?: boolean
  subtle?: boolean
}

export function ChoiceButton({
  children,
  primary = false,
  subtle = false,
  className = '',
  ...props
}: ChoiceButtonProps) {
  const classes = [
    'choice-button',
    primary ? 'primary' : '',
    subtle ? 'subtle' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}