import Image from "next/image";
import profilePic from "./assets/men.jpg";
import InfoCard from "@/app/components/InfoCard";
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Hello Next
      <Image
        src={profilePic}
        alt="Picture of the author"
        width={200}
        draggable={false}
        style={{
          objectFit: "cover",
          borderRadius: "50%",
          minHeight: "200px",
        }}
        placeholder="blur"
      />
        <InfoCard />
    </div>
  );
}
