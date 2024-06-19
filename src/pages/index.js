import Image from "next/image";
import { Inter } from "next/font/google";
import Planner from "./planner";
require("dotenv").config();

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main>
      <Planner/>
    </main>
  );
}
