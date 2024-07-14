import { ReactNode } from "react";
import AnchorProgramProvider from "./anchor";
import WalletProviders from "./wallet";
import { Toaster } from "@/components/ui/toaster";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />

      <WalletProviders>
        <AnchorProgramProvider>{children}</AnchorProgramProvider>
      </WalletProviders>
    </>
  );
}
