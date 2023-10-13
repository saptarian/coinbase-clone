import Spinner from './Spinner'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  text,
  isLoading,
  className,
  children,
  disabled,
  height,
  ...rest
}) => (
  <button 
    type="button" 
    className={className ? className : "primary-btn"} 
    disabled={disabled || isLoading}
    style={{height: height ?? '3rem'}}
    {...rest}
  >
    {isLoading ? <Spinner /> : children ?? text}
  </button>
)

export default Button
