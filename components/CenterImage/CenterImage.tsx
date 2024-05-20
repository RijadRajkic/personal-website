import Image from "next/image";

export const CenterImage = () => {
 return (
  <div className="flex w-fit h-fit items-center justify-center rounded-full animate-hoverPop hover:shadow-accent hover:shadow-2xl">
   <Image
    src="/images/pfp_v3.jpg"
    alt="Center Image"
    width={400}
    height={400}
    className="rounded-full w-[400px] h-[400px]"
   />
  </div>
 );
};
