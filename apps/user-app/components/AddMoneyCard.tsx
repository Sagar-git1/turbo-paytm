"use client";

import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Select from "@repo/ui/select";
import TextInput from "@repo/ui/textInput";
import { useState } from "react";
import { createOnRampTransaction } from "../app/lib/actions/createOnRampTransaction";

const supportedBanks = [
  { name: "HDFC Bank", redirectUrl: "https://netbanking.hdfcbank.com" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com" },
];
export default function AddMoneyCard() {
  const [redirectUrl, setRedirectUrl] = useState(
    supportedBanks[0]?.redirectUrl
  );
  const [provider, setProvider] = useState(supportedBanks[0]?.name || "");
  const [amount, setAmount] = useState(0);
  return (
    <Card title="Add Money">
      <div className="w-full">
        <TextInput
          label="Amount"
          placeholder="Amount"
          onChange={(value) => {
            setAmount(Number(value));
          }}
        />
      </div>
      <div className="py-4 text-left">Bank</div>
      <Select
        onSelect={(value) => {
          setRedirectUrl(
            supportedBanks.find((x) => x.name == value) ? redirectUrl : ""
          );
          setProvider(supportedBanks.find((x) => x.name === value)?.name || "");
        }}
        options={supportedBanks.map((x) => ({
          key: x.name,
          value: x.name,
        }))}
      />
      <div className="flex justify-center pt-4 ">
        <Button
          onClick={async () => {
            await createOnRampTransaction(amount, provider);
            window.location.href = redirectUrl || "";
          }}
        >
          Add Money
        </Button>
      </div>
    </Card>
  );
}
