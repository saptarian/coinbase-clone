import logo from '$/assets/logo-coinbase.svg'

function Nav() {
	return (
    <header className="flex items-center py-6 px-4 
      justify-between border-b">
      <a href="/">
        <img src={logo} alt="logo" width="100" />
      </a>
    </header>
	)
}

export default Nav