import { getServerSession } from "next-auth";
import SendCard from "../../../components/SendCard";
import db from "@repo/db/client";
import { authOptions } from "../../lib/auth";
import PeerTransactions from "../../../components/PeerTransactions";
async function getp2pTransfers() {
  const session = await getServerSession(authOptions);
  const transfers = await db.p2pTransfer.findMany({
    where: {
      fromUserId: Number(session.user.id),
    },
  });
  return transfers.map((t) => ({
    time: t.timestamp,
    amount: t.amount,
  }));
}
export default async function Home() {
  const transfers = await getp2pTransfers();
  return (
    <div className="w-full flex justify-center">
      <SendCard />
      <div className="pt-4 pl-10">
        <PeerTransactions transfers={transfers} />
      </div>
    </div>
  );
}
