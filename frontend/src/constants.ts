import { currencyFormater } from 'root/lib/helper'

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


/* ::::: SETUP IDENTITY PAGE ::::: */

export const identityForm = [
  { 
    name: "first_name", 
    caption: "Legal first name",
    type: "text", 
  },
  { 
    name: "last_name", 
    caption: "Legal last name",
    type: "text", 
  },
]

export const dateOfBirthForm = [
  { 
    name: "day", 
    type: "number", 
    placeholder: "Day",
    required: true,
  },
  { 
    name: "year", 
    type: "number", 
    placeholder: "Year",
    required: true,
  },
]

export const addressForm = [
  { 
    name: "street", 
    type: "text", 
    placeholder: "Address line 1",
    required: true,
  },
  { 
    name: "city", 
    type: "text", 
    placeholder: "City",
    required: true,
  },
  { 
    name: "postal_code", 
    type: "number", 
    placeholder: "Postal code",
    width: "12rem",
    required: true,
  },
  { 
    name: "country", 
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

export const sidebarLinks = [
  { label: "Home", path: "/home" },
  { label: "My assets", path: "/assets" },
  { label: "Trade", path: "/trade" },
  { label: "Earn", path: "/earn" },
  { label: "Profile", path: "/profile" },
  { label: "Learning rewards", path: "/rewards" },
]

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/careers" },
  { label: "Legal & Privacy", href: "/legal-privacy" },
]

export const mobileMenuLinks = [
  { label: "Home", path: "/home" },
  { label: "Assets", path: "/assets" },
  { label: "Trade", path: "/trade" },
  { label: "Earn", path: "/earn" },
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
    price: currencyFormater("24410.72"),
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
        sub: currencyFormater("476000000000.0"),
        spanTitle: "",
        spanSub: "",
      },
      { 
        title: "Volume (24h)",
        sub: currencyFormater("11800000000.0"),
        spanTitle: "+6.48%",
        spanSub: "",
      },
      { 
        title: "Circulating supply",
        sub: currencyFormater("19500000.0"),
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