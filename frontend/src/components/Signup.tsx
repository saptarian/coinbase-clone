import coinbaseLogo from '../assets/logo-coinbase.svg'
import signupImg from '../assets/bitcoinAndOtherCrypto-0.svg'

function Signup() {

  return (
    <>
      <header className="flex items-center py-6 
        px-4 relative">
        <a href="/" className="">
          <img src={coinbaseLogo} alt="coinbase logo" width="100"
            className="" />
        </a>
        <button className="bg-blue-600 rounded-full text-white 
          font-medium px-8 py-2 max-md:hover:bg-blue-700 
          text-sm absolute right-4 lg:bg-inherit
          lg:text-black">
        <a href="#">Sign In</a></button>
      </header>
      <hr className="hidden lg:block" />
      <main className="max-w-xs mx-auto md:max-w-md relative
        lg:flex lg:max-w-4xl lg:gap-0 my-6 lg:my-12
        lg:space-x-40">
        <section className="lg:w-1/2
          ">
          <div className="">
            <h1 className="text-4xl">Create an account</h1>
          </div>
          <div className="my-4 flex flex-col gap-5
            mt-40 lg:mt-4">
            <p>Be sure to enter your legal name as it 
              appears on your government-issued ID.</p>
            <p className="text-sm">Required fields have an asterisk: *</p>
            <form action="">
              <div className="lg:flex lg:gap-4">
                <div className="">
                  <p className="font-medium text-sm">
                    Legal first name*
                  </p>
                  <input type="text" id="firtName" name="firtName" 
                    className="ring-1 ring-gray-500 rounded-lg
                    w-full h-12 my-2 px-4 hover:bg-slate-100" 
                    placeholder="Legal first name"
                  />
                </div>
                <div className="">
                  <p className="font-medium text-sm">
                    Legal last name*
                  </p>
                  <input type="text" id="lastName" name="lastName" 
                    className="ring-1 ring-gray-500 rounded-lg
                    w-full h-12 my-2 px-4 hover:bg-slate-100" 
                    placeholder="Legal last name"
                    />
                </div>
              </div>
              <p className="font-medium text-sm">
                Email*
              </p>
              <input type="email" id="email" name="email" 
                className="ring-1 ring-gray-500 rounded-lg
                w-full h-12 my-2 px-4 hover:bg-slate-100" 
                placeholder="Email"
                />
              <p className="font-medium text-sm">
                Password*
              </p>
              <input type="password" id="password" name="password" 
                className="ring-1 ring-gray-500 rounded-lg
                w-full h-12 my-2 px-4 hover:bg-slate-100" 
                placeholder="Minimum 8 characters"
                />
              <div className="grid grid-cols-12 gap-2 my-4">
                <input type="checkbox" name="policy" 
                  id="policy" className="col-span-1
                    cursor-pointer" />
                <p className="col-span-11 text-xs">
                  I certify that I am 18 years of age or older, 
                  I agree to the <a 
                    className="text-sky-500 hover:text-sky-600"
                    href="#">User Agreement</a>, 
                  and I have read the <a 
                    className="text-sky-500 hover:text-sky-600"
                    href="#">Privacy Policy</a>.
                </p>
              </div>
              <input className="bg-blue-600 rounded-full w-full
                text-white justify-center cursor-pointer mb-4
                font-medium px-8 py-4 hover:bg-blue-700"
                type="submit" value="Create free account" />
            </form>
          </div>
        </section>
        <section className="flex lg:block absolute lg:w-1/3
          lg:space-y-10 top-16 lg:relative lg:top-0
          lg:items-center">

          <article className="">
            <h2 className="text-sm mb-4 font-medium
              lg:text-[2.5rem]/10 lg:text-center lg:font-normal">
              Do more with crypto, only on Coinbase
            </h2>
            <p className="text-sm leading-5 lg:px-4">
              Set up your account and verify your 
              photo ID to get started on trading crypto.</p>
          </article>
          <div className="shrink-0">
            <img src={signupImg} alt="" className="
              max-h-24 w-full lg:max-h-48" />
          </div>
        </section>
      </main>
    </>
  )
}

export default Signup
