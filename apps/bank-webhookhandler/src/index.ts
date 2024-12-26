import express from "express";
import db from "@repo/db/client";
const app = express();

interface PaymentInformation {
  token: string;
  userId: string;
  amount: string;
}
app.use(express.json());
app.post("/hdfcwebhook", async (req, res) => {
  const requestBody: PaymentInformation = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };
  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(requestBody.userId),
        },
        data: {
          amount: {
            increment: Number(requestBody.amount),
          },
        },
      }),
    ]);
    await db.onRampTransaction.updateMany({
      where: {
        token: requestBody.token,
      },
      data: {
        status: "success",
      },
    });
    res.json({
      message: "Captured",
    });
  } catch (error) {
    console.error(error);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003);
