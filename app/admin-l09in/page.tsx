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
    <div className="w-full h-screen bg-gradient-to-br from-[rgb(15,12,41)] from-0% via-[rgb(48,43,99)] via-50% to-[rgb(36,36,62)] to-100% relative overflow-hidden">
      <div className="absolute top-1/6 left-1/2 hidden md:block">
        <Image src={redBigWave} alt="Red Big Wave" className="w-[600px]" />
      </div>
      <div className="absolute top-150 left-160 hidden md:block">
        <Image src={blueCircle} alt="Blue Circle" className="w-[350px]" />
      </div>
      <div className="absolute -bottom-50 -left-50 overflow-hidden hidden md:block">
        <Image
          src={redBigWave}
          alt="Red Big Wave"
          className="w-[600px] opacity-50"
        />
      </div>
      <div className="absolute top-0 left-100 overflow-hidden hidden md:block">
        <Image src={topBlue} alt="Top Blue" className="" />
      </div>
      <div className="absolute bottom-0 right-0 hidden md:block">
        <Image src={bottomBlue} alt="Bottom Blue" className="" />
      </div>
      <div className="absolute top-1/3 left-145 hidden md:block">
        <Image src={lemonTwo} alt="Lemon Two" className="w-[250px]" />
      </div>
      <div className="absolute bottom-1/4 right-160 hidden md:block">
        <Image src={smallBlue} alt="Small Blue" className="w-[200px]" />
      </div>
      <AdminLoginForm />
    </div>
  );
};

export default Page;
