import * as React from 'react'
import type { 
  LoaderFunctionArgs 
} from "react-router-dom";
import { 
  Form,
  redirect,
  useNavigation,
  useLoaderData,
} from 'react-router-dom'
import { 
  addressForm, 
  identityForm, 
  monthNameValue,
  useAppForAnswer,
  dateOfBirthForm,
  sourceOfFundsAnswer,
  employmentStatusAnswer
} from '$/constants'
import { Button, Input } from '$/components'
import { 
  getUser,
  createIdentity, 
  validateIdentity, 
} from 'lib/auth'
import { queryClient } from 'lib/queries'


interface FormInput {
  first_name: string
  last_name: string
  month: string
  day: string
  year: string
  street: string
  city: string
  postal_code: string
  country: string
  use_app_for: string
  source_of_funds: string
  employment_status: string
}


const loader = async () => {
  try {
    const resp = await validateIdentity()
    if (resp.status == 202) {
      const data = await getUser()
      return { data, ok: true }
    }
  }
  catch (error) {
    console.warn(error)
    return { error, ok: false }
  }
  return redirect("/trade")
}

const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData()

  // TODO: Doing some validation check before hit the server

  const month = formData.get("month")
  const day = formData.get("day")
  const year = formData.get("year")
  const date_of_birth = `${year}-${month}-${day}`

  const body = {
    identity: {
      date_of_birth,
    },
    address: {
      street: formData.get("street"),
      city: formData.get("city"),
      postal_code: formData.get("postal_code"),
      country: formData.get("country"),
    },
    analytic: {
      use_app_for: formData.get("use_app_for"),
      source_of_funds: formData.get("source_of_funds"),
      employment_status: formData.get("employment_status"),
    },
  }

  try {
    await createIdentity(body)
  }
  catch (error) {
    return { error, ok: false }
  }

  return redirect("/trade")
}

function validateInput (formInput: FormInput): boolean {
  if (Object.entries(formInput).length != 12)
    return false

  else if (Object.values(formInput).some(val => val === ''))
    return false

  // TODO: more validate, isnumber, value length

  return true
}

function SetupIdentity() {
  const [canSubmit, setCanSubmit] = React.useState<boolean>(false)
  const [formInput, setFormInput] = React.useState<FormInput>({})

  const navigation = useNavigation()
  const isLoading = navigation.formData != null
  const loaderData = useLoaderData()

  function onChange ({target}) { 
    setFormInput({
      ...formInput,
      [target.name]: target.value
    })
  }

  React.useEffect(() => {
    setFormInput({
      ...formInput,
      first_name: loaderData?.data?.data?.first_name,
      last_name: loaderData?.data?.data?.last_name
    })
  }, [])

  React.useEffect(() => {
    setCanSubmit(validateInput(formInput))
  }, [formInput])

	return (
		<main className="py-6 px-4">
      <h1 className="text-4xl font-medium py-2">
        Verify your identity
      </h1>
      <p className="text-gray-500 mb-5 block">
        Financial regulations require us verify your
        identity. <span><a href="#" className="link">
          Learn more</a>
        </span>
      </p>
      <Form method="post" replace>
        <div className="flex flex-col md:flex-row gap-5">
          <section className="w-full">
            <div className="gap-3 md:gap-2 mb-8 flex flex-col md:flex-row">
              {identityForm.map(item => (
                <div key={item.name}>
                  <Label label={item.caption} />
                  <Input 
                    name={item.name}
                    type={item.type}
                    value={formInput[item.name]}
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
                  onChange={onChange}
                  options={[...new Set(
                    monthNameValue.map(({name, value}) => (
                      {value, key: name, label: name}
                    ))
                  )]}
                />
              </div>
              {dateOfBirthForm.map(({...props}) => (
                <div 
                  key={props.name}
                  className="w-[12rem]">
                  <Input 
                    {...props}
                    value={formInput[props.name]}
                    onChange={onChange}
                    className="input-simple"
                  />
                </div>
              ))}
            </div>
            <Label label="Street address" />
            <div className="flex gap-2 flex-wrap mb-8">
              {addressForm.map(({...props}) => (
                <div 
                  key={props.name}
                  className="w-full grow"
                  style={{width: props.width}}>
                  <Input 
                    {...props}
                    value={formInput[props.name]}
                    onChange={onChange}
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
                  onChange={onChange}
                  options={[...new Set(
                    useAppForAnswer.map((item, idx) => (
                      {key: idx, value: item, label: item}
                    ))
                  )]}
                />
              </div>
              <div className="w-full">
                <Label label=" What is your source of funds?" />
                <Select 
                  name="source_of_funds"
                  defaultLabel="Select an option"
                  value={formInput['source_of_funds']}
                  onChange={onChange}
                  options={[...new Set(
                    sourceOfFundsAnswer.map((item, idx) => (
                      {key: idx, value: item, label: item}
                    ))
                  )]}
                />
              </div>
              <div className="w-full">
                <Label label="Employment status" />
                <Select 
                  name="employment_status"
                  defaultLabel="Select an option"
                  value={formInput['employment_status']}
                  onChange={onChange}
                  options={[...new Set(
                    employmentStatusAnswer.map((item, idx) => (
                      {key: idx, value: item, label: item}
                    ))
                  )]}
                />
              </div>
            </div>
          </section>
        </div>
        <hr className="my-6" />
        <div className="flex mb-5">
          <span className="md:w-full"></span>
          <Button 
            text="Continue" 
            type="submit" 
            isLoading={isLoading} 
            disabled={!canSubmit}
          />
        </div>
      </Form>
      <div className="text-center py-4 font-medium">
        <a href="#" className="link">Sign out</a>
      </div>
    </main>
	)
}

const Select = ({
  name,
  defaultLabel,
  options,
  ...rest
}) => (
  <select 
    name={name} 
    className={"input-simple" + 
      `${rest.value ? '' : ' text-gray-400'}`
    }
    style={{paddingLeft: '1rem'}}
    defaultValue=""
    aria-expanded
    {...rest}
  >
    <option className="text-gray-300"
      value="">{defaultLabel}</option>
    {options.map(({key, value, label}) => (
      <option className="text-black" 
        key={key} value={value}>
        {label}
      </option>
    ))}
  </select>
)

const Label = ({label}) => (
  <p className="font-medium text-sm pb-1 text-gray-600">
    {label}
  </p>
)

export default { 
  loader, 
  action, 
  element: <SetupIdentity /> 
}
