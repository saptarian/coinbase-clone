import { Link } from "react-router-dom"
import { footerLinks, languageAvailable } from '@/constants'


const Footer: React.FC = () => {
  return (
    <footer className="border-t w-full bg-inherit max-md:mt-3 mt-auto">
      <div className="flex flex-col md:flex-row mx-auto
      items-center gap-3 md:px-5 py-2 max-w-screen-xl
      justify-between">
        <div className="flex items-center gap-1
        flex-col md:flex-row max-md:border-b w-full">
          <div className="text-sm flex gap-5
            p-3">
            {footerLinks.map(item => 
              <Link 
                key={item.label}
                to={item.href} 
                className="link">{item.label}
              </Link>
            )}
          </div>
          <small className="text-gray-600
          max-md:hidden">2023 Coinbase</small>
        </div>
        <div className="flex gap-3 items-center py-3
        flex-col md:flex-row shrink-0 text-xs ">
          <select name="language" className="w-24 px-2 
          py-[2px] block border border-gray-400 w-40
          rounded-sm">
            {languageAvailable.map(lang => 
              <option 
                key={lang.label}
                value={lang.name}>{lang.label}
              </option>
            )}
          </select>
          <a href="#" className="rounded-sm px-2 py-1 block
            btn-base btn-blue">
            Need help
          </a>
          <small className="text-gray-600
          md:hidden">2024 Coinbase</small>
        </div>
      </div>
    </footer>
  )
}


export default Footer
