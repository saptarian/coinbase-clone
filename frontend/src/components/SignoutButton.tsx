import Spinner from '@/components/Spinner'
import { HtmlHTMLAttributes } from 'react'
import { useFetcher } from 'react-router-dom'


type Props = HtmlHTMLAttributes<HTMLButtonElement>

function SignoutButton({className, children}: Props) {
  const fetcher = useFetcher()
  const isLoggingOut = fetcher.formData != null

  return (
    <fetcher.Form method="post" action="/signout">
      <button type="submit" disabled={isLoggingOut}
        className={className || "link"}>
        {isLoggingOut ? (
          <Spinner 
            style={{borderLeftColor:"blue"}}
          />
        ) : children || "Sign out"}
      </button>
    </fetcher.Form>
  )
}

export default SignoutButton
