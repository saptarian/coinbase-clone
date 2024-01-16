import { Link } from 'react-router-dom'
import earn1 from '@/assets/earn-1.png'
import earn2 from '@/assets/earn-2.png'
import earn3 from '@/assets/earn-3.png'
import { AngleRight } from '@/components/Icons'


export function Earn() {
  return (
    <main className="grow flex flex-col lg:flex-row gap-3
      max-w-screen-xl mx-auto p-5 w-full">
      <div className="lg:grow">
        <section className="container-section divide-y">
          <h2 className="font-medium text-xl px-5 py-3">
            My earnings
          </h2>
          <div className="flex p-5 items-center">
            <span className="w-12 shrink-0 mr-4">
              <img src={earn1} className="" />
            </span>
            <div className="grow">
              <h3 className="font-medium">
                Learn about rewards
              </h3>
              <p className="text-gray-700">
                See how we calculate earnings
              </p>
            </div>
            <Link to="/rewards" className="w-fit p-3 ml-10 text-gray-600
              hover:text-blue-600">
              <AngleRight className="w-2 text-inherit" />
            </Link>
          </div>
        </section>
      </div>
      <div className="lg:w-[40%] shrink-0 space-y-3">
        <section className="container-section divide-y">
          <h2 className="font-medium text-xl px-5 py-3">
            More ways to earn crypto
          </h2>
          <div className="flex p-5 items-center">
            <span className="w-12 shrink-0 mr-4">
              <img src={earn2} className="" />
            </span>
            <div className="grow">
              <h3 className="font-medium">
                Learning rewards
              </h3>
              <p className="text-gray-700">
                Earn crypto rewards by learning
                and wathching videos
              </p>
            </div>
            <Link to="/rewards" className="w-fit p-3 ml-10 text-gray-600
              hover:text-blue-600">
              <AngleRight className="w-2 text-inherit" />
            </Link>
          </div>
        </section>
        <section className="container-section divide-y">
          <h2 className="font-medium text-xl px-5 py-3">
            Help
          </h2>
          <div className="flex p-5 items-center">
            <span className="w-12 shrink-0 mr-4">
              <img src={earn3} className="" />
            </span>
            <div className="grow">
              <h3 className="font-medium">
                Read our FAQ
              </h3>
            </div>
            <Link to="/rewards" className="w-fit p-3 ml-10 text-gray-600
              hover:text-blue-600">
              <AngleRight className="w-2 text-inherit" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
