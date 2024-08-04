import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { generateCustomerPortalLink } from "@/lib/stripe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ManageSubscription() {
  const session = await getServerSession(authOptions);

  const customerPortalLink = await generateCustomerPortalLink(
    session?.user.email
  );

  return (
    <>
      <Link
        href={String(customerPortalLink)}
        className="bg-black text-white py-2 px-4 rounded-full"
      >
        Manage Subscription
      </Link>
    </>
  );
}
