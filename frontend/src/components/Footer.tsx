import { Link } from "react-router-dom"
import logo from '@/assets/logo.svg'


const footerLinks = [
  {
    title: "Company",
    items: [
      "About",
      "Careers",
      "Affiliates",
      "Blog",
      "Press",
      "Security",
      "Investors",
      "Vendors",
      "Legal & privacy",
      "Cookie policy",
      "Cookie preferences",
    ]
  },
  {
    title: "Individuals",
    items: [
      "Buy & sell",
      "Earn free crypto",
      "Wallet",
      "NFT",
      "Card",
      "Derivatives",
      "Coinbase One"
    ]
  },
  {
    title: "Support",
    items: [
      "Help center",
      "Contact us",
      "Create account",
      "ID verification",
      "Account information",
      "Payment methods",
      "Account access",
      "Supported crypto",
      "Status"
    ]
  },
]


function Footer() {
	return (
    <footer className="ring-1 ring-slate-200 bg-white 
      max-w-screen-xl mx-auto py-12">
      <div className="grid lg:grid-cols-9
        sm:grid-cols-4 gap-5 px-5">
        <div className="px-5 py-3 lg:col-span-3 col-span-2">
          <Link to="/" >
            <img src={logo} alt="logo" width="170px"/>
          </Link>
          <p className="text-gray-500 text-lg mt-5">
            © 2024 Coinbase Clone
          </p>
          <ul className="text-gray-500 text-lg">
            {['Blog', 'Twitter', 'Facebook'].map((li) => (
              <li className="inline-block pr-3" key={li} >
                <a href="#" className="hover:underline">{li}</a>
              </li>
            ))
            }
          </ul>
        </div>
        { footerLinks.map((node) => (
          <div className="text-lg px-5 col-span-2" key={node.title}>
            <p className="font-medium pb-1.5">
              {node.title}
            </p>
            <ul className="text-gray-500">
              {node.items.map((item, idx) => (
                <li className="pb-0.5" key={idx} >
                  <a href="#" className="hover:underline">{item}</a>
                </li>
              ))
              }
            </ul>
          </div>
        )) }
      </div>
    </footer>
  )
}


export default Footer
