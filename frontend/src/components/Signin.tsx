import coinbaseLogo from '../assets/logo-coinbase.svg'

function Signin() {

	return (
		<>
      <main className="flex flex-col max-w-sm sm:ring-1 
        sm:ring-gray-900/10 sm:rounded-2xl gap-4 mx-auto sm:p-10
        sm:mt-8 p-6"
        >
        <img src={coinbaseLogo} alt="coinbase logo" width="120"
          className="sm:mb-8 mb-3" 
        />
        <h1 className="text-2xl
          "><strong>Sign in to Coinbase</strong>
        </h1>
        <p className="text-sm/4 text-slate-500
          ">
          Not your device? Use a private or incognito window to sign in</p>
        <form action="" className="mt-4 flex flex-col gap-4"
        >
          <p className="text-sm
            "><strong>Email</strong>
          </p>
          <input type="email" className="ring-1 ring-gray-500 
            rounded-lg h-12 px-4 hover:bg-slate-100" 
            placeholder="Your email address" 
          />
          <p className="text-sm
            "><strong>Password</strong>
          </p>
          <input type="password" className="ring-1 ring-gray-500 
            rounded-lg h-12 px-4 hover:bg-slate-100" 
            placeholder="" 
          />
          <input type="submit" className="bg-blue-600 hover:bg-blue-700
            rounded-full text-white py-3 cursor-pointer font-medium" 
            value="Continue" 
          />
          <label className="text-center
            ">
            <a href="#" className="text-sm  
              text-sky-500 hover:text-sky-600">
              Privacy policy
            </a>
          </label>
        </form>
      </main>
		</>
	)
}

export default Signin