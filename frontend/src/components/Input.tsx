import React from 'react'
import { isValidEmail, isValidPassword } from '@/lib/validation'


interface InputProps extends 
React.InputHTMLAttributes<HTMLInputElement> {
  caption?: string
  error?: string
  novalidate?: boolean
}


const Input: React.FC<InputProps> = ({
  caption, 
  error,
  value,
  className,
  novalidate,
  ...rest
}) => 
{
  const [errState, setErrState] = React.useState('')
  const [state, setState] = React.useState('')

  const validateInput = (
    event?: React.FocusEvent<HTMLInputElement, Element>
  ): void => 
  {
    const args = event?.target ?? rest
    const val = state ? state : value?.toString() ?? ''

    if (args.required && !val) 
      setErrState(`${caption ?? 'This field'} is required*`)

    else if (args.name && args.name.search('password') >= 0) {
      if (val?.length < 5) 
        setErrState('Too weak')

      else if (!isValidPassword(val))
        setErrState('Use 8 characters minimum with 1 capital, number and symbol')

      else 
        setErrState('')
    } 
    else if (args.name && args.name.search('email') >= 0 && !isValidEmail(val))
      setErrState('Use a valid email address')

    else
      setErrState(error ?? '')
  }

  React.useEffect(() => {
    (state || value) && validateInput()
  }, [state, value, error])


  return (
  <>
    {caption && (
      <p className="font-medium text-sm pb-2">
        {rest.required ? `${caption}*` : caption} 
      </p>
    )}
    <input 
      onBlur={validateInput}
      onChange={(e) => setState(e.target.value)}
      value={value ?? state}
      className={className 
        ? className 
        : (!novalidate && errState)
          ? "input-rounded border-red-600 outline-red-600"
          : "input-rounded border-gray-500 outline-sky-600"
      }
      {...rest}
    />
    {(!novalidate && errState) 
      ? (<small className="block text-red-600">
          {errState}
        </small>)
      : ''
    }

  </>
  )
}


export default Input
