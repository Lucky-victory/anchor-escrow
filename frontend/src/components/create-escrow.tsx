"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "./ui/button";
import { ComboboxDemo as Combobox } from "./ui/combobox";

export const CreateEscrow = () => {
  const [mintA, setMintA] = useState("");
  const [mintB, setMintB] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [escrowPDA, setEscrowPDA] = useState("");
  const handleCreateEscrow = async () => {
    // In a real app, this would call the createEscrow function
    console.log("Creating escrow...");
    setEscrowPDA("simulated-escrow-pda");
  };
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Create Escrow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mintA">Mint A</Label>
            <Input
              id="mintA"
              // value={mintA}
              // onChange={(e) => setMintA(e.target.value)}
              placeholder="Mint A Address"
            />
          </div>
          <div>
            <Label htmlFor="mintB">Mint B</Label>
            <Input
              id="mintB"
              // value={mintB}
              // onChange={(e) => setMintB(e.target.value)}
              placeholder="Mint B Address"
            />
          </div>
          <div>
            <Label htmlFor="depositAmount">Deposit Amount</Label>
            <div className="flex items-center">
              <Combobox></Combobox>
              <Input
                id="depositAmount"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount to deposit"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="receiveAmount">Receive Amount</Label>
            <Input
              id="receiveAmount"
              value={receiveAmount}
              onChange={(e) => setReceiveAmount(e.target.value)}
              placeholder="Amount to receive"
            />
          </div>
        </div>
        <Button
          className="mt-4"
          //  onClick={handleCreateEscrow}
        >
          Create Escrow
        </Button>
      </CardContent>
    </Card>
  );
};
