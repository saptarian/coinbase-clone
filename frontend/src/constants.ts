export const languageAvailable = [
  { name: "en", label: "English" },
]


/* ::::: SIGNUP PAGE ::::: */

export const signupForm = [
  { name: "first_name", 
    caption: "Legal first name",
    type: "text", 
    placeholder: "Legal first name",
    width: "12rem",
    required: true,
  },
  { name: "last_name", 
    caption: "Legal last name",
    type: "text", 
    placeholder: "Legal last name",
    width: "12rem",
    required: true,
  },
  { name: "email", 
    caption: "Email",
    type: "email", 
    placeholder: "Email",
    width: "24rem",
    required: true,
  },
]


export const signupFormWithPattern = [
  { 
    id: 'first_name',
    name: "first_name" as const,
    label: "Legal first name",
    type: "text", 
    placeholder: "Legal first name",
    pattern: '^[A-Za-z0-9]{3,16}$',
    invalidMessage: 'Use a valid legal first name',
    width: "12rem",
    required: true,
  },
  { 
    id: 'last_name',
    name: "last_name" as const,
    label: "Legal last name",
    type: "text", 
    placeholder: "Legal last name",
    // pattern: '^[A-Za-z0-9]{1,16}$',
    invalidMessage: 'Use a valid legal last name',
    width: "12rem",
    required: true,
  },
  { 
    id: 'email',
    name: "email" as const,
    label: "Email",
    type: "email", 
    placeholder: "Email",
    // pattern: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$',
    invalidMessage: 'Use a valid email address',
    width: "24rem",
    required: true,
  },
  { 
    id: 'password',
    name: "password" as const,
    label: "Password",
    type: "password", 
    placeholder: "Enter password",
    pattern: '^(?=.*\\W)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$',
    // invalidMessage: 'Wrong input',
    width: "24rem",
    required: true,
  },
]


/* ::::: SETUP IDENTITY PAGE ::::: */

export const identityForm = [
  { 
    name: "first_name" as const, 
    caption: "Legal first name",
    type: "text", 
  },
  { 
    name: "last_name" as const, 
    caption: "Legal last name",
    type: "text", 
  },
]

export const YEAR_MAX = 2011
export const YEAR_MIN = 1924

export type FormValuesWithValidation = Readonly<{
  id?: string
  name: string
  type: string 
  caption?: string
  placeholder?: string
  label?: string
  min?: number
  max?: number
  width?: string
  pattern?: string
  required?: boolean
  invalidMessage?: string
}>

export const dateOfBirthForm = 
[
  { 
    name: "day" as const, 
    type: "number", 
    placeholder: "Day",
    min: 1,
    max: 31,
    required: true,
  },
  { 
    name: "year" as const, 
    type: "number", 
    min: YEAR_MIN,
    max: YEAR_MAX,
    placeholder: "Year",
    required: true,
  },
]

export const postalCodePattern = "^[0-9]{4,7}$"

export const addressForm = [
  { 
    name: "street" as const,
    type: "text", 
    placeholder: "Address line 1",
    required: true,
  },
  { 
    name: "city" as const,
    type: "text", 
    placeholder: "City",
    required: true,
  },
  { 
    name: "postal_code" as const,
    type: "text", 
    pattern: postalCodePattern,
    placeholder: "Postal code",
    width: "12rem",
    required: true,
  },
  { 
    name: "country" as const,
    type: "text", 
    placeholder: "Country",
    width: "12rem",
    required: true,
  },
]

export const monthNameValue = [
  { name: 'January', value: '1' },
  { name: 'February', value: '2' },
  { name: 'March', value: '3' },
  { name: 'April', value: '4' },
  { name: 'May', value: '5' },
  { name: 'June', value: '6' },
  { name: 'July', value: '7' },
  { name: 'August', value: '8' },
  { name: 'September', value: '9' },
  { name: 'October', value: '10' },
  { name: 'November', value: '11' },
  { name: 'December', value: '12' },
]

export const useAppForAnswer = [
  'Investing', 'Trading on Coinbase',
  'Trading on other exchanges', 'Online purchases', 
  'Payments to friends', 'Online payments'
]

export const sourceOfFundsAnswer = [
  'Occupation', 'Investments', 'Savings',
  'Credit/Loan', 'Inheritance'
]

export const employmentStatusAnswer = [
  'Employed', 'Unemployed', 'Retired'
]


/* ::::: FRONT PAGE ::::: */

export const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Learn", href: "/learn" },
  { label: "Individuals", href: "/individuals" },
  { label: "Businesses", href: "/businesses" },
  { label: "Developers", href: "/developers" },
  { label: "Company", href: "/company" },
]

/* ::::: DASHBOARD ::::: */

import { 
  Home, 
  Globe, 
  ChartMixed, 
  BadgeCheck,
  ChartLineUp, 
} from './components/Icons'
import { IconProps } from './components/Icons/Icons'

export type MenuIconedItem = {
  label: string
  path: string
  icon: React.FC<IconProps>
}

export const sidebarLinks = [
  { label: "Home", path: "/home", icon: Home },
  { label: "My assets", path: "/assets", icon: Globe },
  { label: "Trade", path: "/trade", icon: ChartLineUp },
  { label: "Earn", path: "/earn", icon: ChartMixed },
  { label: "Learning rewards", path: "/rewards", icon: BadgeCheck },
]

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/careers" },
  { label: "Legal & Privacy", href: "/legal-privacy" },
]

export const mobileMenuLinks = [
  { label: "Home", path: "/home", icon: Home },
  { label: "Assets", path: "/assets", icon: Globe },
  { label: "Trade", path: "/trade", icon: ChartLineUp },
  { label: "Earn", path: "/earn", icon: ChartMixed },
]

export const newAssets = [
  { alias: "HNT" },
]

export const trendingAssets = [
  { alias: "BTC" },
]

export const currencyRateAgainstUSD = [
  { name: "IDR", rate: "15000" }
]


/* ::::: ACCOUNT PAGE ::::: */

export const accountSidebar = [
  { label: "Profile", path: "/profile" },
  { label: "Transactions", path: "/transactions" },
]

export const profile = {
  contactInfo: {
    displayName: "John Doe",
    profileImage: ""
  },
  user: {
    legalFirstName: "John",
    legalLastName: "Doe",
    emailAddress: "email@company.com",
  },
  identity: {
    dateOfBirth: "2001/01/01",
    address: {
      street: "",
      unit: "",
      city: "",
      postalCode: "",
      country: "",
    },
    employmentStatus: "Employed",
    sourceOfFunds: "Savings",
    useAppFor: "Investing",
    workInIndustry: "Arts & Media",
    isActive: true,
  },
  phoneNumbers: [
    { number: "62811223344", isPrimary: true },
  ],
  preference: {
    timezone: "Paris",
    currency: "EUR",
  },
}

export const currencyAlias = [
  { name: "Euro", alias: "EUR" },
  { name: "US Dollar", alias: "USD" },
]

export const timezoneAlias = [
  { name: "Paris", tz: "GMT+01:00" },
  { name: "UTC", tz: "GMT+00:00" },
  { name: "Jakarta", tz: "GMT+07:00" },
]

export const transactions = []

/* ::::: TRADE OVERVIEW PAGE ::::: */

export const overviewNavLinks = [
  { label: "Overview", path: "/"},
  { label: "Primary balance", path: "/accounts/"},
]

export const chartTime = [
  "1h", "1d", "1w", "1m", "1y", "all"
]

export const assets = [
  {
    name: "Bitcoin",
    alias: "BTC",
    price: "24410.72",
    change: "+1.58%",
    views: "",
    performance: {
      lastUpdated: "September 8, 2023 at 4:41 PM GMT+7",
      range: "1y",
      value: "-46%",
      market: "+9%",
    },
    description: `Ethereum is a decentralized computing 
    platform that uses ETH (also called Ether) to 
    pay transactions fees (or "gas"). 
    Developers can user Ethereum to run 
    decentralized applications (dApps) and issue 
    new crypto assets, known as Ethereum tokens.`,
    stats: [
      { 
        title: "Market cap",
        sub: "476000000000.0",
        spanTitle: "",
        spanSub: "",
      },
      { 
        title: "Volume (24h)",
        sub: "11800000000.0",
        spanTitle: "+6.48%",
        spanSub: "",
      },
      { 
        title: "Circulating supply",
        sub: "19500000.0",
        spanTitle: "93% of total supply",
        spanSub: "",
      },
      { 
        title: "Typical hold time",
        sub: "158 days",
        spanTitle: "",
        spanSub: "",
      },
      { 
        title: "Trading activity",
        sub: "99% buy",
        spanTitle: "",
        spanSub: "1% sell",
      },
      { 
        title: "Popularity",
        sub: "#1",
        spanTitle: "",
        spanSub: "",
      },
      { 
        title: "",
        sub: "",
        spanTitle: "",
        spanSub: "",
      },
      { 
        title: "Earn",
        sub: "Earn 2.00% APY",
        spanTitle: "",
        spanSub: "",
      },
    ],
    resources: [
      { label: "Whitepaper", href: "https://google.com" },
      { label: "Official website", href: "https://wikipedia.com" },
    ],
    apy: "It's based on the ETH staking rewards generated.",
  },

  {
    name: "Helium",
    alias: "HNT",
    views: "1966.63%",
  },
]