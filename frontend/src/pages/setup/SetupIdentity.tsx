import React from 'react'
import { Form, useNavigation, useLoaderData } from 'react-router-dom'
import { 
  YEAR_MIN,
  YEAR_MAX,
  addressForm, 
  identityForm, 
  monthNameValue,
  useAppForAnswer,
  dateOfBirthForm,
  postalCodePattern,
  sourceOfFundsAnswer,
  employmentStatusAnswer
} from '@/constants'

import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import SignoutButton from '@/components/SignoutButton'
import { isEveryInputOK } from '@/lib/validation'
import { FullName } from "@/types";


const initial = {
  first_name: '', last_name: '',
  month: '', day: '', street: '', city: '',
  source_of_funds: '', employment_status: '',
  year: '', postal_code: '', country: '', use_app_for: '',
}

type FormValues = typeof initial


export function SetupIdentity() {
  const [formInput, setFormInput] = 
    React.useState(initial)
  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null
  const { user } = useLoaderData() as {user: FullName} ?? {user:{}}

  function handleChange (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) { 
    setFormInput({
      ...formInput,
      [event.target.name]: event.target.value
    })
  }

  React.useEffect(() => {
    setFormInput({
      ...formInput,
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? ''
    })
  }, [])

  const isStringAboveZero = (val: string): boolean => {
    return Boolean(parseInt(val) > 0)
  }

  const isSubmitReady = isEveryInputOK<FormValues>(formInput, {
    month: (val) => isStringAboveZero(val) 
                    && Boolean(parseInt(val) <= 12),
    day: (val) => isStringAboveZero(val) 
                  && Boolean(parseInt(val) <= 31),
    year: (val) => Boolean(parseInt(val) >= YEAR_MIN) 
                   && Boolean(parseInt(val) <= YEAR_MAX),
    postal_code: (val) => new RegExp(postalCodePattern).test(val),
  })


	return (
		<main className="py-6 px-4">
      <h1 className="text-4xl font-medium py-2">
        Verify your identity
      </h1>
      <p className="text-gray-500 mb-5 block">
        Financial regulations require us verify your
        identity. <span><a href="https://google.com"
          className="link" target="_blank">
          Learn more</a>
        </span>
      </p>
      <Form method="post" replace>
        <div className="flex flex-col md:flex-row gap-5">
          <section className="w-full">
            <div className="gap-3 md:gap-2 mb-8 flex flex-col md:flex-row">
              {identityForm.map(({name, caption, type}) => (
                <div key={name}>
                  <Label label={caption} />
                  <FormInput 
                    name={name}
                    type={type}
                    value={formInput[name]}
                    className="input-simple"
                    disabled
                  />
                </div>
              ))}
            </div>
            <Label label="Date of birth" />
            <div className="flex gap-2 mb-8">
              <div className="w-full">
                <Select 
                  name="month"
                  defaultLabel="Month"
                  value={formInput['month']}
                  onChange={handleChange}
                  options={monthNameValue.map(
                    ({name, value}) => (
                      {value, label: name}
                    )
                  )}
                />
              </div>
              {dateOfBirthForm.map(({name, ...props}) => (
                <div 
                  key={name}
                  className="w-[12rem]">
                  <FormInput 
                    {...props}
                    name={name}
                    value={formInput[name]}
                    onChange={handleChange}
                    className="input-simple"
                  />
                </div>
              ))}
            </div>
            <Label label="Street address" />
            <div className="flex gap-2 flex-wrap mb-8">
              {addressForm.map(({name, width, ...props}) => (
                <div 
                  key={name}
                  className="w-full grow"
                  style={{width: width ?? ''}}>
                  <FormInput 
                    {...props}
                    name={name}
                    value={formInput[name]}
                    onChange={handleChange}
                    className="input-simple"
                  />
                </div>
              ))}
            </div>
          </section>
          <section className="md:w-[26rem]">
            <div className="flex gap-5 flex-wrap mb-3">
              <div className="w-full">
                <Label label="What will you use Coninbase for?" />
                <Select 
                  name="use_app_for"
                  defaultLabel="Select an option"
                  value={formInput['use_app_for']}
                  onChange={handleChange}
                  options={useAppForAnswer.map(
                    (item) => (
                      {value: item, label: item}
                    ))
                  }
                />
              </div>
              <div className="w-full">
                <Label label=" What is your source of funds?" />
                <Select 
                  name="source_of_funds"
                  defaultLabel="Select an option"
                  value={formInput['source_of_funds']}
                  onChange={handleChange}
                  options={sourceOfFundsAnswer.map(
                    (item) => (
                      {value: item, label: item}
                    ))
                  }
                />
              </div>
              <div className="w-full">
                <Label label="Employment status" />
                <Select 
                  name="employment_status"
                  defaultLabel="Select an option"
                  value={formInput['employment_status']}
                  onChange={handleChange}
                  options={employmentStatusAnswer.map(
                    (item) => (
                      {value: item, label: item}
                    ))
                  }
                />
              </div>
            </div>
          </section>
        </div>
        <hr className="my-6" />
        <div className="flex mb-5">
          <span className="md:w-full"></span>
          <Button 
            type="submit" 
            isLoading={isSubmiting} 
            disabled={!isSubmitReady}
          >Continue</Button>
        </div>
      </Form>
      <div className="text-center py-4 font-medium">
        <SignoutButton />
      </div>
    </main>
	)
}


interface PropsSelect extends 
React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{value: string, label: string}>
  defaultLabel: string
}

const Select = ({
  name,
  options,
  defaultLabel,
  ...rest
}: PropsSelect) => (
  <select 
    name={name} 
    className={"input-simple" + 
      `${rest.value ? '' : ' text-gray-400'}`
    }
    style={{paddingLeft: '1rem'}}
    {...rest}
  >
    <option className="text-gray-300"
      value="">{defaultLabel}</option>
    {options.map(({value, label}, idx) => (
      <option className="text-black" 
        key={idx} value={value}>
        {label}
      </option>
    ))}
  </select>
)


const Label = ({label}: {label:string}) => (
  <p className="font-medium text-sm pb-1 text-gray-600">
    {label}
  </p>
)
