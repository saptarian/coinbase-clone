import React from 'react'
import { Form, useNavigation } from 'react-router-dom'

import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import SignoutButton from '@/components/SignoutButton'
import { isEveryInputOK } from '@/lib/validation'


const patterns = {
  prefix: "^[0-9]{1,4}$",
  number: "^[0-9]{4,12}$"
}

type FormValues = {
  prefix: string
  number: string
}

export function SetupPhone() {
  const [formInput, setFormInput] = React.useState<FormValues>({
    prefix: '',
    number: '',
  })

  const navigation = useNavigation()
  const isSubmiting = navigation.formData != null  
  const canSubmit = isEveryInputOK<FormValues>(formInput, {
    prefix: (val) => new RegExp(patterns.prefix).test(val),
    number: (val) => new RegExp(patterns.number).test(val),
  })


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
            <FormInput
              name="prefix"
              type="tel"
              placeholder="1"
              pattern={patterns['prefix']}
              value={formInput['prefix']}
              onChange={({target}) => {
                 setFormInput({
                  ...formInput,
                  [target.name]: target.value
                })
              }}
              required
            />
          </div>
          <div className="w-full">
            <FormInput
              name="number"
              type="tel"
              placeholder="000 000-0000"
              pattern={patterns['number']}
              value={formInput['number']}
              invalidMessage="Use a valid phone number"
              onChange={({target}) => {
                 setFormInput({
                  ...formInput,
                  [target.name]: target.value
                })
              }}
              required
            />
          </div>
        </div>
        <Button 
          type="submit" 
          isLoading={isSubmiting} 
          disabled={!canSubmit}
        >Continue</Button>
      </Form>
      <div className="text-center py-4 font-medium">
        <SignoutButton />
      </div>
    </main>
	)
}
