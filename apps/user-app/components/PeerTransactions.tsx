"use client";

import { Card } from "@repo/ui/card";

export default function PeerTransactions({
  transfers,
}: {
  transfers: {
    time: Date;
    amount: number;
  }[];
}) {
  if (!transfers.length) {
    return (
      <Card title="Recent p2p transfers">
        <div className="text-center pb-8 pt-8">No Recent Transactions</div>
      </Card>
    );
  }
  return (
    <Card title="Recent Transactions">
      <div className="pt-2">
        {transfers.map((t) => (
          <div className="flex justify-between">
            <div>
              <div className="text-sm">Sent INR</div>
              <div className="text-slate-600 text-xs">
                {t.time.toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
