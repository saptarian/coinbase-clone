import * as React from 'react'
import type { 
  LoaderFunctionArgs 
} from "react-router-dom";
import { 
  Form,
  redirect,
  useNavigation,
  useActionData,
} from 'react-router-dom'
import { Button, Input } from '$/components'
import { createPhone, validatePhone } from 'lib/auth'

interface FormInput {
  prefix: string
  number: string
}

const loader = async () => {
  try {
    const phone = await validatePhone()
    if (phone.status == 202) 
      return { ok: true }
  }
  catch (error) {
    return { error, ok: false }
  }
  return redirect("/setup/identity")
}

const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData()
  const prefix = formData.get("prefix") as string | null
  const number = formData.get("number") as string | null

  // TODO: Doing some validation check before hit the server

  const phone_number = `${prefix}${number}`

  try {
    await createPhone({phone_number})
  }
  catch (error) {
    return { error, ok: false }
  }

  return redirect("/setup/identity")
}


function validateInput (formInput: FormInput): boolean {
  if (Object.entries(formInput).length != 2)
    return false

  else if (Object.values(formInput).some(val => val === ''))
    return false

  // TODO: more validate, isnumber, value length

  return true
}

function SetupPhone() {
  const [canSubmit, setCanSubmit] = React.useState<boolean>(false)
  const [formInput, setFormInput] = React.useState<FormInput>({})
  const [inputError, setInputError] = React.useState<FormInput>({})

  const actionData = useActionData()
  const navigation = useNavigation()
  const isLoading = navigation.formData != null  

  function onChange ({target}) { 
    setFormInput({
      ...formInput,
      [target.name]: target.value
    })

    if (inputError[target.name])
      setInputError({...inputError ,[target.name]: ''})
  }

  React.useEffect(() => {
    setInputError(actionData?.error ?? {})
  }, [actionData])

  React.useEffect(() => {
    setCanSubmit(validateInput(formInput))
  }, [formInput])

	return (
		<main className="py-6 px-4">
      <h1 className="text-3xl font-medium ">
        Set up two-step verification
      </h1>
      <p className="py-3">
        Please enter the mobile number associated
        with your device. We'll text a verification code to
        your mobile phone when you sign in.
      </p>
      <Form method="post" replace>
        <p className="font-medium py-1">
          Phone number
        </p>
        <div className="mb-5 flex gap-2">
          <div className="w-[100px] flex-none relative">
            <Input
              name="prefix"
              type="tel"
              placeholder="62"
              value={formInput['prefix']}
              error={inputError['prefix']}
              onChange={onChange}
              required
            />
          </div>
          <div className="w-full">
            <Input
              name="number"
              type="tel"
              placeholder="000 000-0000"
              value={formInput['number']}
              error={inputError['number']}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <Button 
          text="Continue" 
          type="submit" 
          isLoading={isLoading} 
          disabled={!canSubmit}
        />
      </Form>
      <div className="text-center py-4 font-medium">
        <a href="#" className="link">Sign out</a>
      </div>
    </main>
	)
}

export default { 
  loader, 
  action, 
  element: <SetupPhone /> 
}
