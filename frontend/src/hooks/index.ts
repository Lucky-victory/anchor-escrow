import { useCallback } from "react";
import { BN } from "@coral-xyz/anchor";
import { randomBytes } from "crypto";
import { useAnchorProgramContext } from "../providers/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useToast } from "@/components/ui/use-toast";

export const useMakeEscrow = () => {
  const { toast } = useToast();
  const { program, connection } = useAnchorProgramContext();

  const tokenProgramId = TOKEN_2022_PROGRAM_ID;
  const { publicKey } = useWallet();

  const makeEscrow = async (
    mintA: string,
    mintB: string,
    tradeAmount: number,
    receiveAmount: number
  ) => {
    if (!publicKey || !program || !connection) {
      toast({ title: "please connect your wallet", variant: "default" });
      return;
    }

    try {
      const seed = new BN(randomBytes(8));
      const makerAtaa = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        publicKey,
        false,
        tokenProgramId
      );

      const [escrowAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        escrowAccount,
        true,
        tokenProgramId
      );

      const mintAinfo = await getMint(connection, new PublicKey(mintA));
      const mintBinfo = await getMint(connection, new PublicKey(mintB));

      const deposit = new BN(tradeAmount * 10 ** mintAinfo.decimals);
      const receive = new BN(receiveAmount * 10 ** mintBinfo.decimals);

      const transactionSign = await program.methods
        .make(seed, deposit, receive)
        .accounts({
          maker: publicKey,
          mintA: new PublicKey(mintA),
          mintB: new PublicKey(mintB),
          makerAtaA: makerAtaa,
          tokenProgram: tokenProgramId,
          vault,
        })
        .rpc();
      toast({ title: "Your transaction was successful" });
      return transactionSign;
    } catch (error) {
      console.error("Error in makeEscrow:", error);
      toast({
        title: "Something went wrong..., please try again.",
        variant: "destructive",
      });
    }
  };

  return makeEscrow;
};
export const useRefundEscrow = () => {
  const { toast } = useToast();
  const { program, connection } = useAnchorProgramContext();

  const tokenProgramId = TOKEN_2022_PROGRAM_ID;
  const { publicKey } = useWallet();

  const refundEscrow = async (escrow: string) => {
    try {
      if (!publicKey || !program || !connection) {
        toast({ title: "Please connect your wallet" });
        return;
      }

      const escrowAccount = await program.account.escrow.fetch(
        new PublicKey(escrow)
      );

      const makerAtaa = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        publicKey,
        false,
        tokenProgramId
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        new PublicKey(escrow),
        true,
        tokenProgramId
      );

      const transactionSign = await program.methods
        .refund()
        .accountsPartial({
          makerAtaA: makerAtaa,
          tokenProgram: tokenProgramId,
          vault,
          escrow: new PublicKey(escrow),
          maker: new PublicKey(escrowAccount.maker),
          mintA: new PublicKey(escrowAccount.mintA),
        })
        .rpc();
      toast({ title: "Your Transaction was successful" });
      return transactionSign;
    } catch (error) {
      console.error("Error in refundEscrow:", error);
      toast({
        title: "Something went wrong...please try again",
        variant: "destructive",
      });
    }
  };

  return refundEscrow;
};

export const useTakeEscrow = () => {
  const { program, connection, publicKey, wallet } = useAnchorProgramContext();
  const tokenProgramId = TOKEN_2022_PROGRAM_ID;
  const { toast } = useToast();
  const takeEscrow = async (escrow: string) => {
    try {
      if (!publicKey || !program || !connection || !wallet) {
        toast({ title: "Please connect your wallet" });
        return;
      }

      const escrowAccount = await program.account.escrow.fetch(
        new PublicKey(escrow)
      );

      const takerAtaA = getAssociatedTokenAddressSync(
        escrowAccount.mintA,
        new PublicKey(publicKey),
        false,
        tokenProgramId
      );
      const takerAtaB = getAssociatedTokenAddressSync(
        escrowAccount.mintB,
        new PublicKey(publicKey),
        false,
        tokenProgramId
      );
      console.log("takerAtaa", takerAtaB.toString());
      console.log("takerAtab", takerAtaA.toString());
      const makerAtaB = getAssociatedTokenAddressSync(
        escrowAccount.mintB,
        escrowAccount.maker,
        false,
        tokenProgramId
      );
      const vault = getAssociatedTokenAddressSync(
        escrowAccount.mintA,
        new PublicKey(escrow),
        true,
        tokenProgramId
      );

      const transactionSign = await program.methods
        .take()
        .accountsPartial({
          escrow: new PublicKey(escrow),
          maker: escrowAccount.maker,
          makerAtaB,
          taker: new PublicKey(publicKey),
          takerAtaA,
          takerAtaB,
          vault,
          tokenProgram: tokenProgramId,
          mintA: escrowAccount.mintA,
          mintB: escrowAccount.mintB,
        })
        .rpc();

      toast({ title: "Your Transaction was successful" });
      return transactionSign;
    } catch (error) {
      console.error("Error in takeEscrow:", error);
      toast({
        title: "Something went wrong...please try again",
        variant: "destructive",
      });
    }
  };

  return takeEscrow;
};

export const useFetchEscrowAccounts = () => {
  const { program } = useAnchorProgramContext();

  const fetchEscrowAccounts = useCallback(async () => {
    if (!program) return [];
    try {
      const res = await program.account.escrow.all();
      return res;
    } catch (error) {
      console.error("Error fetching escrow accounts:", error);
      return [];
    }
  }, [program]);

  return fetchEscrowAccounts;
};
