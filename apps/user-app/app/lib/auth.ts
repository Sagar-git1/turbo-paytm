import CredentialsProvider from "next-auth/providers/credentials";
import db from "@repo/db/client";
import bcrypt from "bcrypt";
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phonenumber",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials: any) {
        console.log("entered");
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        try {
          const existingUser = await db.user.findFirst({
            where: {
              number: credentials.phone,
            },
          });
          if (existingUser) {
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              existingUser.password
            );
            if (passwordValidation) {
              return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                email: existingUser.email,
              };
            }
            return null;
          }
          const user = await db.user.create({
            data: {
              number: credentials.phone,
              password: hashedPassword,
              balance: {
                create: {
                  amount: 0,
                  locked: 0,
                },
              },
            },
          });
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };
        } catch (error) {
          console.error(error);
        }
        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      console.log(token);
      session.user.id = token.sub;
      console.log(session);
      return session;
    },
  },
};
