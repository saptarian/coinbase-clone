export default function BuySellPanel() {
return(
<>
  <div className="flex">
    <button className="basis-1/3 border-t-2
    py-2 border-blue-600">Buy</button>
    <button className="basis-1/3 border-x
    py-2 border-b">Sell</button>
    <button className="basis-1/3
    py-2 border-b">Convert</button>
  </div>
  <div className="text-center px-5 py-5 space-y-3">
    <h3 className="font-medium">Verify info</h3>
    <p className="text-gray-700 leading-4 pb-5">
      To continue, please finish setting up 
      your account.
    </p>
    <button className="primary-btn-sm
    ">Verify info</button>
  </div>
</>
)
}
