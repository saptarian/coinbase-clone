import assetImg from '@/assets/connection-issue.png'


export function NotReady() {
  return (
    <main className="grow bg-white">
      <div className="w-[25rem] mx-auto text-center">
        <div className="py-1">
          <img src={assetImg} 
            alt="connection issues" 
            className="mx-auto" 
          />
        </div>
        <h2 className="font-medium text-2xl py-5">
          The page is not available right now
        </h2>
        <p className="py-1 px-5">
          We're looking into it right now. 
          Plese try again later. 
          Your funds are safe.
        </p>
      </div>
    </main>
  )
}
