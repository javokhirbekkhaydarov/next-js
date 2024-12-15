import Image from "next/image";
import profilePic from "./assets/men.jpg";
import InfoCard from "@/app/components/InfoCard";
import Link from "next/link";
import VideoPage from "@/app/video/page";
export default function Home() {
  return (
    <div className="flex items-center justify-center h-dvh font-[family-name:var(--font-geist-sans)]">
      <VideoPage />
    </div>
  );
}
