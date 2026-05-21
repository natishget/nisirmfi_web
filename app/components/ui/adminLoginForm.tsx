"use client";

import React, { useEffect } from "react";
import redBigWave from "@/../public/loginIcons/redBigWave.svg";
import blueCircle from "@/../public/loginIcons/blueCircle.svg";
import bottomBlue from "@/../public/loginIcons/bottomBlue.svg";
import topBlue from "@/../public/loginIcons/topBlue.svg";
import lemonTwo from "@/../public/loginIcons/lemonTwo.svg";
import smallBlue from "@/../public/loginIcons/smallBlue.svg";
import Loading from "@/../public/loginIcons/loading.png";

import Image from "next/image";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";

// type LoginFormData = z.infer<typeof loginAdminSchema>;

const AdminLoginForm = () => {
  //   const { user, loading, initialized } = useSelector(
  //     (state: RootState) => state.api,
  //   );

  //   const router = useRouter();
  //   const dispatch = useDispatch<AppDispatch>();
  //   const [isLoading, setIsLoading] = React.useState(false);
  //   const [error, setError] = React.useState<string | null>(null);

  //   if (initialized && user) {
  //     router.push("/users");
  //   }

  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<LoginFormData>({
  //     resolver: zodResolver(loginAdminSchema),
  //   });

  const onSubmit = async () => {
    //     setIsLoading(true);
    //     try {
    //       const response = await dispatch(adminLoginAsync(data)).unwrap();
    //       console.log("Admin login successful:", response);
    //       router.push("/users");
    //     } catch (error: any) {
    //       setError(error);
    //     } finally {
    //       setIsLoading(false);
    //     }
  };
  if (true) {
    return (
      

        <form
          //   onSubmit={}
          className="text-white pt-10 pb-10 md:px-18 px-4 border-2 border-gray-300 rounded-4xl md:w-[550px] md:h-[550px] w-[90%] h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="font-semibold text-xl mb-3">Maker</h3>
          <h1 className="font-semibold text-3xl mb-5">Login</h1>
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="username" className="">
              Username
            </label>
            <input
              type="text"
              //   {...register("username")}
              placeholder="Username"
              className="bg-white p-2 rounded-lg placeholder:text-gray-500 placeholder:italic text-gray-800"
            />
            {/* <p className="text-red-500">{errors.username?.message}</p> */}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              //   {...register("password")}
              placeholder="********"
              className="bg-white p-2 rounded-lg placeholder:text-gray-500 placeholder:italic text-gray-800"
            />
            {/* <p className="text-red-500">{errors.password?.message}</p> */}
          </div>

          <button className="text-xs">Forget password?</button>
          <br />

          <button className="w-full bg-red-800 py-2 mt-10  flex items-center justify-center tracking-wide">
            {/* {isLoading ? (
              <Image src={Loading} alt="" className="animate-spin w-5 " />
            ) : (
              "Sign In"
            )} */}
            Sign In
          </button>
          {/* <p className="text-red-500 text-center mt-2">{error}</p> */}
        </form>
      
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-[rgb(15,12,41)] from-0% via-[rgb(48,43,99)] via-50% to-[rgb(36,36,62)] to-100%">
      <Image src={Loading} alt="Loading" className="animate-spin w-10" />
    </div>
  );
};

export default AdminLoginForm;
