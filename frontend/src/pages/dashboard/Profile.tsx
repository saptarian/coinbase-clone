import * as React from 'react'

import logo from '$/assets/logo-coinbase.svg'
import { getProfile } from 'lib/auth'
import { setUserProfile, getUserProfile } from 'lib/storage'


function Profile() {
  const [state, setState] = React.useState({error: null, status: ''})
  const [profile, setProfile] = React.useState<unknown | null>(null)

  function onChange(e){
    return null
  }

  function onSubmit(e){
    return null
  }
  
  React.useEffect(() => {
    const fetchResource = async () => {
      setState({status: 'loading'})
      try {
        let data = await getProfile()
        setUserProfile(data.data)
        setProfile(data.data)
        setState({status: 'success'})
      } catch (error) {
        setState({error, status: 'error'})
      } 
    }

    setProfile(getUserProfile())
    if (!profile)
      fetchResource()
  }, [])


  return (
  <>
  <div className="lg:flex">
    <aside className="xl:w-[270px] border-r
     hidden lg:block">
      <div className="flex flex-col gap-5 p-6
       font-medium text-gray-700">
        <div className="hidden lg:block">
          <a href="#" className="xl:hidden">
            <div className="rounded-full w-8 h-8 
              border-[7px] border-blue-600">
            </div>
          </a>
          <div className="xl:flex items-center gap-2
          hidden">
            <a href="">                  
              <img src={logo} alt="" width="100px" 
              />
            </a>
            <h1>ACCOUNT</h1>
          </div>
        </div>
        <div className="py-8 space-y-6">
          <a href="#" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-300 rounded-full
            "></div>
            <h2 className="hidden xl:block">Profile</h2>
          </a>
          <a href="#" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-300 rounded-full
            "></div>
            <h2 className="hidden xl:block">Transactions</h2>
          </a>
        </div>
      </div>
    </aside>

    <div className="w-full">
      <header>
        <nav className="flex justify-between p-4 items-center
          ">
          <div className="w-24">
            <a href="#" className="lg:hidden">
              <img src={logo} alt="" width="120px" />            
            </a>
          </div>
          <div className="w-24 flex justify-center">
            <h1 className="text-lg">Profile</h1>
          </div>
          <div className="w-24 flex justify-end">
            <div className="w-9 h-9 bg-slate-100 rounded-full 
              ring-1 ring-gray-300 flex flex-col space-y-1
              items-center justify-center cursor-pointer">
              <div className="bg-gray-500 w-4 h-[2px]"></div>
              <div className="bg-gray-500 w-4 h-[2px]"></div>
              <div className="bg-gray-500 w-4 h-[2px]"></div>
            </div>
          </div>
        </nav>
        <hr />
      </header>

      <main className="px-5 my-1 space-y-6">
        <section className="flex flex-col py-5">
          <div className="mx-auto flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-500 
            rounded-full pt-1"><p className="
            text-white text-5xl font-bold text-center 
            w-full">J</p></div>
            <img src="" alt="" />
            <h2 className="mt-6 text-3xl
            ">{profile?.user?.diplay_name}</h2>
            <p className="font-medium text-gray-500
            text-lg">{profile?.user?.email}</p>
          </div>
          <div className="mx-auto mt-4">
            <button className="secondary-btn-sm">Edit profile photo
            </button>
          </div>
        </section>

        <section className="ring-1 ring-gray-300 
          mx-auto rounded-lg max-w-3xl">
          <h2 className="border-b  p-5 
            text-xl">Contact info</h2>
          <div>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Display name</h3>
                <input type="text" name="displayName"
                  className="input-simple"
                  onChange={onChange}
                  value={profile?.user?.diplay_name}
                />
              </div>
              <SaveButton />
            </form>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Email address</h3>
                <input type="text" disabled 
                  className="input-simple"
                  name="currentEmail"
                  onChange={onChange}
                  value={profile?.user?.email}
                />
                <input type="text" name="newEmail" 
                  className="input-simple"
                  placeholder="Email address"
                />
              </div>
              <SaveButton />
            </form>
          </div>
        </section>

        <section className="ring-1 ring-gray-300 
          mx-auto rounded-lg max-w-3xl">
          <h2 className="border-b  p-5 
            text-xl">Personal info</h2>
          <div>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <h3>Legal name</h3>
              <p>
                Changing your legal name 
                requires updating your ID document.
                <a href="#" className="link"> Change!</a>
              </p>
              <input type="text" disabled
                className="input-simple"
                name="fullName"
                onChange={onChange}
                value={
                  `${profile?.user?.first_name} ${profile?.user?.last_name}`
                }
              />
            </form>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Date of birth</h3>
                <input type="date" 
                  className="input-simple"
                  name="dateOfBirth"
                  onChange={onChange}
                  value={profile?.identity?.date_of_birth}
                />
              </div>
              <SaveButton />
            </form>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Address</h3>
                <input type="text" 
                  className="input-simple"
                  name="streetAddress"
                  onChange={onChange}
                  placeholder="Street address"
                  value={profile?.address?.street}
                />
              </div>
              <div className="flex gap-4">
                <input type="text" 
                  className="input-simple"
                  name="unitAddress"
                  onChange={onChange}
                  placeholder="Unit# "
                  value={profile?.address?.unit}
                />
                <input type="text" 
                  className="input-simple"
                  name="cityAddress"
                  onChange={onChange}
                  placeholder="City "
                  value={profile?.address?.city}
                />
              </div>
              <div className="flex gap-4">
                <input type="text" 
                  className="input-simple"
                  name="postalAddress"
                  onChange={onChange}
                  placeholder="Postal code"
                  value={profile?.address?.postal_code}
                />
                <input type="text" 
                  className="input-simple"
                  name="countryAddress"
                  onChange={onChange}
                  placeholder="Country"
                  value={profile?.address?.country}
                />
              </div>
              <SaveButton />
            </form>
          </div>
        </section>

        <section className="ring-1 ring-gray-300 
          mx-auto rounded-lg max-w-3xl">
          <h2 className="border-b  p-5 
            text-xl">Preferences</h2>
          <div>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Timezone</h3>
                <select name="timezonePrefer" className="input-simple">
                  <option value="GMT+1" 
                  >(GMT+01:00) Paris</option>
                  <option value="GMT+0" 
                  >(GMT+00:00) UTC</option>
                </select>
              </div>
              <SaveButton />
            </form>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <div className="space-y-3">
                <h3>Currency</h3>
                <select name="currency" className="input-simple">
                  <option value="EUR" 
                  >Euro (EUR)</option>
                  <option value="USD" 
                  >US Dollar (USD)</option>
                </select>
              </div>
              <SaveButton />
            </form>
          </div>
        </section>

        <section className="ring-1 ring-gray-300 
          mx-auto rounded-lg max-w-3xl">
          <h2 className="border-b  p-5 
            text-xl">Close account</h2>
          <div>
            <form onSubmit={onSubmit} className="border-b 
               p-5 flex flex-col gap-6">
              <p>
                Closing your account can’t be undone. 
                Please make sure your account balance 
                is $0.00 before you begin.
              </p>
              <input type="submit" value="Close account" 
                className="danger-btn" />
            </form>
          </div>
        </section>

        <div className="rounded-md max-w-3xl mx-auto
        ring-4 ring-gray-200">
          <div className="relative p-5">
            <h2 className="text-center 
            ">Discard changes</h2>
            <div className="absolute right-5
            text-gray-600 top-5 font-medium">X</div>
          </div>
          <hr />
          <div className="p-5">
            <p>You have unsaved changes that
            will be lost by editing this information. 
            Are you sure you want to continue without saving?
            </p>
            <div className="flex gap-4 w-full py-5
              flex-wrap">
              <div className="md:w-[220px] w-full">
                <button className="secondary-btn">Cancel</button>
              </div>
              <div className="grow">
                <button className="primary-btn">Continue without saving</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

  </div>


  <main className="p-5 my-1 flex flex-col gap-6
  lg:flex-row">
    <div className="lg:basis-2/3 w-full max-w-3xl mx-auto">
      <div className="ring-1 ring-gray-300 p-5
      rounded-lg flex flex-col gap-2">
        <h2 className="text-lg font-medium
        ">Transactions</h2>
        <p className="text-gray-700
        ">Download all your Coinbase.com 
        account activities</p>
        <div className="px-5 py-5 flex justify-between
        font-medium">
          <p className="text-gray-500
          ">Last 30 days</p>
          <div className="flex gap-4 text-blue-600">
            <a href="#" className="link">PDF</a>
            <a href="#" className="link">CSV</a>
          </div>
        </div>
      </div>
    </div>

    <div className="lg:basis-1/3">
      <section className="ring-1 ring-gray-300 
        mx-auto rounded-lg max-w-3xl">
        <h2 className="border-b  p-5 
          text-xl">Generate custom statement</h2>
        <div>
          <form className="border-b 
             p-5 flex flex-col gap-6">
            <div className="space-y-3">
              <h3>Asset</h3>
              <select name="transactionAsset" className="input-simple">
                <option value="any">All assets</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div className="space-y-3">
              <h3>Transaction type</h3>
              <select name="transactionType" className="input-simple">
                <option value="any">All assets</option>
                <option value="crypto">Crypto</option>
              </select>
            </div>
            <div className="space-y-3">
              <h3>Date</h3>
              <select name="transactionDate" className="input-simple">
                <option value="any">All time</option>
                <option value="crypto">7 days</option>
              </select>
            </div>
            <div className="space-y-3">
              <h3>Format</h3>
              <div className="flex gap-6">
                <div className="flex gap-1">
                  <input type="radio" value="pdf" 
                  name="format" id="pdf" />
                  <label htmlFor="pdf">
                  PDF</label>
                </div>
                <div className="flex gap-1">
                  <input type="radio" value="csv" 
                  name="format" id="csv" />
                  <label htmlFor="csv">
                  CSV</label>
                </div>
              </div>
            </div>
            <input type="submit" value="Generate" 
            className="primary-btn" />
          </form>
        </div>
      </section>
    </div>
  </main>

  </>
  )
}

const SaveButton = () => (
  <div className="flex justify-end">
    <input type="submit" value="Save" 
      className="primary-btn" />
  </div>
)

export default { element: <Profile />}
