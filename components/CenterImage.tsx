import Image from "next/image";

export const CenterImage = () => {
 return (
  <div className=" absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-8 border-[#1d6174] flex items-center justify-center rounded-full">
   <Image src="/pfp_v3.jpg" alt="Center Image" width={400} height={400} className="rounded-full w-[400px] h-[400px]" />
  </div>
 );
};
