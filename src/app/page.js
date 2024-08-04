import Image from "next/image";
import SignOut from "@/components/SignOut";
import { getServerSession } from "next-auth";
import SubscribePlan from "@/components/SubscribePlan";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { createCustomer, hasSubscription } from "@/lib/stripe";
import ManageSubscription from "@/components/ManageSubscription";

const plans = [
  {
    priceID: "price_1Ph53QLA0cuh1rJi5PpBP7OC",
    price: "$9.99",
    description: "Starter Plan",
  },
  {
    priceID: "price_1PiEAGLA0cuh1rJi4lIXOEXx",
    price: "$14.99",
    description: "Pro Plan",
  },
];

export default async function Home() {
  await createCustomer(); // create stripe customer if not exists
  const session = await getServerSession(authOptions);
  const { hasSub, plan } = await hasSubscription(session?.user.email);

  return (
    <main className="max-w-2xl m-auto px-4 ">
      <div className="h-[100vh] flex flex-col justify-center">
        <div className="border p-6 rounded-xl">
            <Image
              className="rounded-full"
              src={session?.user.image}
              width={50}
              height={50}
            />
          <h1 className="text-center text-3xl">My Awsome Payment Page</h1>
          <p className="text-black/50 text-center">
            Please subscripe my project
          </p>
            {hasSub ? (
              <div className="flex justify-around w-full p-3 mt-6">
                <p className="text-xl my-auto">{plan.name}</p>
                <div className="flex gap-2">
                  <ManageSubscription />
                  <SignOut />
                </div>
              </div>
            ) : (
              plans.map((plan) => (
                <SubscribePlan
                  key={plan.priceID}
                  priceId={plan.priceID}
                  price={plan.price}
                  description={plan.description}
                />
              ))
            )}
          </div>
        </div>
    </main>
  );
}
