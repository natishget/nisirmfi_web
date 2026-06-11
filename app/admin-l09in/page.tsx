"use client";

import AdminLoginForm from "@/components/ui/adminLoginForm";
import redBigWave from "@/../public/loginIcons/redBigWave.svg";
import blueCircle from "@/../public/loginIcons/blueCircle.svg";
import bottomBlue from "@/../public/loginIcons/bottomBlue.svg";
import topBlue from "@/../public/loginIcons/topBlue.svg";
import lemonTwo from "@/../public/loginIcons/lemonTwo.svg";
import smallBlue from "@/../public/loginIcons/smallBlue.svg";

import Image from "next/image";

const Page = () => {
  return (
    <div className="w-full h-screen ">
      <div className=" w-full h-full ">
        <Image
          src={blueCircle}
          alt="Top Blue"
          className="w-auto h-full mx-auto"
        />
      </div>
      <AdminLoginForm />
    </div>
  );
};

export default Page;
