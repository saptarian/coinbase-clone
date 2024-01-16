import Modal from '@/components/Modal'
import { AngleRight, Close } from '@/components/Icons'


export function LinkedAccounts() {
  return (
    <div className="p-5 flex justify-center items-center 
      mx-auto grow w-full h-full max-sm:py-20">
      <Modal isCenterScreen hideClose
        trigger={
          <button type="button" 
            className="primary-btn">
            Add a payment method
          </button>
        }>
        {({setOpen}) => (
          <AddPaymentMethodModal 
            onExit={() => setOpen(false)} 
          />
        )}
      </Modal>
    </div>
  )
}


const AddPaymentMethodModal = ({onExit}: {
  onExit: () => void
}) => {
  return (
    <div className="sm:container-section sm:w-fit sm:max-w-[450px] 
      mx-auto divide-y w-full bg-white h-full max-h-screen">
      <div className="flex justify-between px-5 py-5 sm:py-3">
        <h3 className="font-medium text-xl">
          Add payment method
        </h3>
        <button type="button" 
          onClick={onExit}
          className="text-gray-500 hover:text-red-600 p-1">
          <Close className="w-3 " />
        </button>
      </div>
      <div className="px-5 py-3 flex">
        <span className="">
          <img src="" alt="" className="" />
        </span>
        <div className="grow py-2">
          <h4 className="font-medium text-xl">
            Credit/Debit Card
          </h4>
          <h5 className="font-bold text-sm text-stone-500">
            Invest small amounts
          </h5>
          <p className="mt-3 leading-5 text-gray-600">
            Use any Visa or Mastercard to make small
            ivestments. Add a bank or wallet to sell.
          </p>
        </div>
        <button type="button" 
          className="w-fit shrink-0 text-gray-800 px-6 py-12
          hover:text-blue-600">
          <AngleRight className="w-2"/>
        </button>
      </div>
      <div className="px-5 py-3 flex">
        <span className="">
          <img src="" alt="" className="" />
        </span>
        <div className="grow py-2">
          <h4 className="font-medium text-xl">
            Bank Account
          </h4>
          <h5 className="font-bold text-sm text-green-600">
            Invest large amounts
          </h5>
          <p className="mt-3 leading-5 text-gray-600">
            Add any bank account that can make and accept SEPA
            payments. Once completed, you can instantly buy and sell.
          </p>
        </div>
        <button type="button" 
          className="w-fit shrink-0 text-gray-800 px-6 py-12
          hover:text-blue-600">
          <AngleRight className="w-2"/>
        </button>
      </div>
      <p className="w-full px-5 py-2 text-center text-sm">
        Learn about our buy/sell fees <a href="#" 
        className="underline hover:text-blue-600">here.</a>
      </p>
    </div>
  )
}
