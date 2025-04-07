import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-black">
      <div className=" w-full h-16 flex flex-row text-white justify-between px-6 py-4 ">
        <div className=" flex-row flex justify-center items-center gap-5">
            <div>
            <img className="w-10 h-10 rounded-full"
            src="https://imgs.search.brave.com/hG6s-b_fCSCadV7mTTMFF4HRGgcrlb4nzso15QkEVfk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEwLzgxLzUyLzM0/LzM2MF9GXzEwODE1/MjM0MjlfbGd4QWRL/SUtvWXRDYW9FRXlM/QWJRaWh5U20xUk1q/bDQuanBn"
            alt=""
          />

            </div>
            <span className="text-2xl font-bold">
                Private <span className="text-green-500 text-xl ">Chat</span>
            </span>
          
        </div>
        <div className="flex flex-row gap-5 mr-7 text-lg font-semibold text-white justify-center items-center">
          <Link href={"/"}>          <div className="bg-green-500 px-3 py-1 rounded-md">login</div>
          </Link>
          <Link href={"/Createaccount"}>
          <div className="bg-green-500 px-3 py-1  rounded-md">create Account</div>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
