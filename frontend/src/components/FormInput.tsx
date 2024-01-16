import React from 'react'
import { Eye, EyeSlash } from './Icons'


interface FormInputProps extends
React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  invalidMessage?: string
  value?: string
}

const FormInput: React.FC<FormInputProps> = ({
  id, 
  type,
  name,
  label, 
  value,
  pattern, 
  invalidMessage,
  className,
  required,
  ...rest
}) =>
{
  const [focused, setFocused] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const isPasswordType = name?.includes('password')
  const requiredMessage = label 
        ? `${label} is required*` 
        : 'This field is required'

  return (
    <>
      {label ? (
        <label htmlFor={id} 
          className="font-medium text-sm pb-2 block">
          {`${label}${required ? '*' : ''}`} 
        </label>  
      ) : ''}
      <div className="flex items-center relative">
        <input {...rest}
          id={id}
          name={name}
          value={value}
          pattern={pattern}
          type={name?.includes('password')
            ? showPassword ? 'text' : 'password'
            : type}
          required={required}
          className={`${className ?? 
            "input-rounded border-gray-500 peer"} ${focused 
            ? "invalid:border-red-600 invalid:ring-red-600"
            : '' }`}
          onBlur={() => setFocused(true)}
          // onFocus={() => setFocused(false)}
        />
        {isPasswordType ? (
          <button className="absolute px-3 h-full right-0" 
            type="button"
            tabIndex={-1}
            onClick={() => {
              setShowPassword((state) => !state)
            }}>
            <span>
              {showPassword ? <EyeSlash /> : <Eye />}
            </span>
          </button>
        ) : ''}
        {focused && required && value?.length === 0 ? (
          <small
            className="text-red-600 hidden peer-placeholder-shown:block
            absolute right-0 -bottom-4">
            {requiredMessage}
          </small>
        ) : ''}
        {focused && value?.length ? (
          <small 
            className="text-red-600 hidden peer-invalid:block
            absolute right-0 -bottom-4">
            {invalidMessage}
          </small>
        ) : ''}
      </div>
      {isPasswordType ? (
        <PasswordStrength value={value}/>
      ) : ''}
    </>
  )
}


const getStrengthByPattern = (value: string): string => {
  if (value.length < 6)
    return 'weak'

  else if (/^(?=.*\W)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/.test(value)) {
    if (value.length >= 10)
      return 'strong'

    return 'moderate'
  }

  return 'unexpected'
}


const PasswordStrength = ({value=''}) => {

  if (value.length === 0)
    return ''

  if (value.length < 6 || 
      value.length > 20 ||
      getStrengthByPattern(value) === 'unexpected')
    return (
      <small className="text-red-600 leading-3">
        Use 8 to 20 characters with atleast:
        <ul className="flex gap-4 font-medium">
          <li>1 capital</li>
          <li>1 number</li>
          <li>1 symbol</li>
        </ul>
      </small>
    )

  const passwordStrength = getStrengthByPattern(value)


  return (
    <div className="flex items-center gap-3 py-2">
      <span className="w-full flex gap-2">
        {[1,2,3].map(i => (
          <div key={i} className={`h-1 w-full rounded-md ${
            passwordStrength === 'weak' 
            ? "first:bg-pink-600 bg-stone-300" :
            passwordStrength === 'strong' 
            ? "bg-green-600" :
            passwordStrength === 'moderate' 
            ? "last:bg-stone-300 bg-blue-600" :
            "hidden"
          }`}></div>
        ))}
      </span>
      <small className={`w-24 text-right leading-3 ${
        passwordStrength === 'weak' ? "text-red-600" :
        passwordStrength === 'strong' ? "text-green-600" :
        passwordStrength === 'moderate' ? "text-blue-600" :
        "hidden"
        } font-medium`} 
        autoCapitalize="true">
        {passwordStrength[0]?.toUpperCase() + passwordStrength.slice(1,)}
      </small>
    </div>
  )
}


export default FormInput
