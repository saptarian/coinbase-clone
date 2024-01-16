import { Link } from "react-router-dom"
import { navLinks } from '@/constants'


function Nav() {
        
  return (
    <nav className="gap-6 font-medium grow shrink-0
      max-lg:hidden flex flex-row justify-end">
      {navLinks.map(item => 
        <div key={item.label}>
          <Link to={item.href} 
            className="hover:border-b-2 py-6 border-gray-800">
            {item.label}
          </Link>
        </div>
      )}
    </nav>
  )
}

export default Nav