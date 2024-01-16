export function Transactions() {
  return (
    <div className="py-5 px-10 my-1 flex flex-col gap-6 lg:flex-row">
      <div className="grow">
        <div className="ring-1 ring-gray-300 p-5
          rounded-lg flex flex-col gap-2">
          <h2 className="text-lg font-medium ">Transactions</h2>
          <p className="text-gray-700 ">Download all your Coinbase.com account activities</p>
          <div className="px-5 py-5 flex justify-between font-medium">
            <p className="text-gray-500">Last 30 days</p>
            <div className="flex gap-4 text-blue-600">
              <button disabled className="link">PDF</button>
              <button disabled className="link">CSV</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-[300px] shrink-0">
        <section className="ring-1 ring-gray-300 mx-auto rounded-lg max-w-3xl">
          <h2 className="border-b p-5 text-xl">Generate custom statement</h2>
          <div>
            <form className="p-5 flex flex-col gap-6">
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
                  <div className="flex gap-1 items-center">
                    <input type="radio" value="pdf" name="format" id="pdf" />
                    <label htmlFor="pdf">PDF</label>
                  </div>
                  <div className="flex gap-1 items-center">
                    <input type="radio" value="csv" name="format" id="csv" />
                    <label htmlFor="csv">CSV</label>
                  </div>
                </div>
              </div>
              <button type="submit" disabled
                className="primary-btn">
                Generate
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
