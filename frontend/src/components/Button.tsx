import Spinner from './Spinner'


interface ButtonProps extends
React.ButtonHTMLAttributes<HTMLButtonElement> {
  height?: string
  width?: string
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  isLoading, children, disabled, height, width, ...rest
}) => 
(
  <button 
    className="primary-btn w-full"
    disabled={disabled || isLoading}
    style={{
      height: height ?? '3rem',
      width: width ?? ''
    }}
    {...rest}
  >
    {isLoading ? (
      <Spinner className="max-h-full" />
    ) : children}
  </button>
)


export default Button
