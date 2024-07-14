import React, { createContext, useState, useEffect, useContext } from "react";
import {
  useConnection,
  useAnchorWallet,
  type AnchorWallet,
  type ConnectionContextState,
} from "@solana/wallet-adapter-react";
import { AnchorEscrow } from "../types/anchor";
import idl from "../../data/idl.json";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";

interface AnchorProgramContextType {
  program: Program<AnchorEscrow> | null;
  connection: any;
  wallet?: AnchorWallet;
  publicKey: any;
}

const AnchorProgramContext = createContext<
  AnchorProgramContextType | undefined
>(undefined);

export default function AnchorProgramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const [program, setProgram] = useState<Program<AnchorEscrow> | null>(null);

  useEffect(() => {
    if (wallet && connection) {
      const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
      });
      const newProgram = new Program(idl as AnchorEscrow, provider);
      setProgram(newProgram);
    } else {
      setProgram(null);
    }
  }, [wallet, connection]);

  const publicKey = wallet?.publicKey?.toString() || null;

  return (
    <AnchorProgramContext.Provider
      value={{ program, connection, wallet, publicKey }}
    >
      {children}
    </AnchorProgramContext.Provider>
  );
}

export const useAnchorProgramContext = () => {
  const context = useContext(AnchorProgramContext);
  if (context === undefined) {
    throw new Error(
      "useAnchorProgramContext must be used within an AnchorProgramProvider"
    );
  }
  return context;
};
