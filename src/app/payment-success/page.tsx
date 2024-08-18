const PaymentSuccess = ({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) => {
  return (
    <main className="w-full flex flex-col py-40 max-w-[80rem] h-screen mx-auto text-neutral-800 text-center">
      <div className="max-w-[30rem] mx-auto border-4 border-white/70 bg-zinc-100/20 rounded-full py-36 px-24">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You have successfully sent</h2>
        <div className="bg-white/90 p-2 rounded-md text-blue-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
