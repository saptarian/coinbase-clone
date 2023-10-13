interface AuthItem {
  token: string
}

interface UserItem {
  user: unknown
  address: unknown
  identity: unknown
  analytic: unknown
  preference: unknown
}

interface CoinData {
  stats: unknown
  coins: unknown
  updatedAt: unknown
}

// ======================== AUTH ======================== //

export function getAuth(): AuthItem | null {
  return JSON.parse(localStorage.getItem('auth'))
}

export function updateAuth(newAuth?: AuthItem | null): void {
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


export function getUser(): UserItem | null {
  return JSON.parse(sessionStorage.getItem('user'))
}

export function updateUser(newUser?: UserItem | null): void {
  if (!newUser)
    setUser(null)

  else {
    const user = getUser() ?? {}
    setUser({...user, ...newUser })
  }
}

export function getUserProfile(): unknown | null {
  const user = getUser()
  return user?.profile ?? null
}
  
export function setUserProfile(profile: unknown): void {
  const user = getUser() ?? {}
  const newUser = { profile }
  setUser({...user, ...newUser })
}

function setUser(value: UserItem | null) {
  sessionStorage.setItem('user', JSON.stringify(value))
}


// ======================== COINS ======================== //

export function getCoins(): CoinData | null {
  return JSON.parse(sessionStorage.getItem('coins'))
}

export function updateCoins(data?: CoinData | null): void {
  if (!data)
    setCoins(null)

  else {
    const coins = getCoins() ?? {}
    setCoins({...coins, ...data })
  }
}

function setCoins(data: CoinData | null) {
  sessionStorage.setItem('coins', JSON.stringify(data))
}
