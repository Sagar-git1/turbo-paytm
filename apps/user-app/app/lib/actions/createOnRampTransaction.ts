"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";
export async function createOnRampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  if (!userId) {
    return {
      message: "Unauthenticated request",
    };
  }
  const token = (Math.random() * 1000).toString();
  await db.onRampTransaction.create({
    data: {
      provider,
      status: "pending",
      startTime: new Date(),
      token,
      userId: Number(userId),
      amount: amount * 100,
    },
  });
  return {
    message: "transaction onramp created",
  };
}
