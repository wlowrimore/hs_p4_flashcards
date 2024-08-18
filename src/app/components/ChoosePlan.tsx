import React from "react";

const ChoosePlan = () => {
  return (
    <main className="w-screen max-w-[80rem] min-h-screen mx-auto flex flex-col py-12 items-center">
      <h1 className="text-4xl flex justify-start w-[38rem] p-2 mb-4 font-bold uppercase">
        Choose Your plan
      </h1>
      <section className="flex flex-col gap-10">
        <div className="bg-blue-500 text-white p-6 rounded-2xl border border-white shadow shadow-neutral-700 min-w-[40rem] max-w-[40rem]">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold uppercase">Premium</h2>
              <h3 className="text-2xl font-semibold uppercase mb-2">
                $20.00/month
              </h3>
              <p className="text-lg uppercase">
                Generate up to 12 decks per month
              </p>
              <p className="text-lg uppercase">free storage for 1 year</p>
            </div>
            <button className="py-2 px-4 bg-yellow-400 hover:bg-yellow-500 transition duration-200 text-neutral-950 font-semibold border border-neutral-400 rounded uppercase">
              Purchase
            </button>
          </div>
        </div>

        <div className="bg-blue-400/60 p-6 rounded-2xl border border-white shadow shadow-neutral-700 min-w-[40rem] max-w-[40rem]">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold uppercase">Standard</h2>
              <h3 className="text-2xl font-semibold uppercase mb-2">
                $10.00/month
              </h3>
              <p className="text-lg uppercase">
                Generate up to 6 decks per month
              </p>
              <p className="text-lg uppercase">free storage for 2 months</p>
            </div>
            <button className="py-2 px-4 bg-yellow-400 hover:bg-yellow-500 transition duration-200 font-semibold border border-neutral-400 rounded uppercase">
              Purchase
            </button>
          </div>
        </div>
        <div className="bg-blue-200/60 p-6 rounded-2xl border border-white shadow shadow-neutral-700 min-w-[40rem] max-w-[40rem]">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-3xl font-semibold uppercase">Free trial</h2>
              <h3 className="text-2xl font-semibold uppercase mb-2">
                $0 for 30 days
              </h3>
              <p className="text-lg uppercase">Generate up to 3 decks</p>
              <p className="text-lg uppercase">free storage for 14 days</p>
            </div>
            <button className="py-2 px-4 bg-yellow-400 hover:bg-yellow-500 transition duration-200 font-semibold border border-neutral-400 rounded uppercase">
              Purchase
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChoosePlan;
