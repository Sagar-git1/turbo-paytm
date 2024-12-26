import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import db from "@repo/db/client";
import AddMoneyCard from "../../../components/AddMoneyCard";
import BalanceCard from "../../../components/BalanceCard";
import OnRampTransactions from "../../../components/OnRampTransactions";

async function getBalance() {
  const session = await getServerSession(authOptions);
  console.log(session);
  const balance = await db.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
  console.log("entered into getBalance");
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await db.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}
export default async function Home() {
  const balance = await getBalance();

  const txns = await getOnRampTransactions();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transactions
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoneyCard />
          {JSON.stringify(balance)}
        </div>
        <div>
          <BalanceCard amount={balance.amount || 0} locked={balance.locked} />
          <div className="pt-4">
            <OnRampTransactions transactions={txns} />
          </div>
        </div>
      </div>
    </div>
  );
}
