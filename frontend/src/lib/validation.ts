type Entries<T> = {
  [P in keyof T]: [P, T[P]]
}[keyof T][]

export function isEveryInputOK<T extends object>(
  formValues: T,
  formValidations: {[P in keyof T]?: (v: T[P]) => boolean}
): boolean 
{
  return (Object.entries(formValues) as Entries<T>)
    .every(([key, val]) => {
      if (Boolean(val) === false)
        return false

      if (key in formValidations)
        return formValidations[key]?.(val)

      return true
    })
}


export function isTokenExpired(token: string): boolean {
  const midToken = token.split('.')[1]
  if (!midToken) return true

  try {
    const tokenObj = JSON.parse(atob(midToken))
    return (tokenObj.exp < Date.now() / 1000)
  } catch (error) {
    console.warn(error)
    return true
  }
}


export function isValidEmail(email: string):boolean {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(email)
}


export function isValidPassword(password: string): boolean {
  return /^(?=.*\W)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/.test(password)
}


