import type { UserData, AuthItem } from '@/types'

// ======================== AUTH ======================== //

export function getAuth(): AuthItem | null {
  const authItem = localStorage.getItem('auth')
  return authItem ? JSON.parse(authItem) : null
}

export function storeAuth(newAuth?: AuthItem | null): void {
  if (!newAuth)
    setAuth(null)

  else {
    const auth = getAuth() ?? {}
    setAuth({...auth, ...newAuth })
  }
}

export function getToken(): string | null {
  const auth = getAuth()
  return auth?.token ?? null
}

export function setToken(token: string): void {
  const auth = getAuth() ?? {}
  const newAuth = {token}
  setAuth({...auth, ...newAuth })
}

function setAuth(value: AuthItem | null) {
  localStorage.setItem('auth', JSON.stringify(value))
}


// ======================== USER ======================== //


export function getUser(): UserData | null {
  const userData = sessionStorage.getItem('user')
  return userData ? JSON.parse(userData) : null
}

type PartUserData = Partial<UserData>

export function storeUser(
  newUser: ((user: PartUserData | null) => 
  PartUserData) | PartUserData | null = null
): void 
{
  const user = getUser()

  if (!newUser)
    setUser(null)

  else if (typeof newUser === 'function') 
    setUser(newUser(user))

  else 
    setUser({...user, ...newUser })
}

// export function storeUserProfile(): unknown | null {
//   const user = getUser()
//   return user?.profile ?? null
// }
  
// export function setUserProfile(profile: unknown): void {
//   const user = getUser() ?? {}
//   const newUser = { profile }
//   setUser({...user, ...newUser })
// }

function setUser(value: PartUserData | null) {
  sessionStorage.setItem('user', JSON.stringify(value))
}
