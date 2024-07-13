import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className={styles.main}>
      <Button className="rounded-full">Hello</Button>
    </main>
  );
}
