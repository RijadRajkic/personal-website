import { useRouter } from "next/router";

import { ScreenWrapper, CenterImage, OuterComponent } from "@/components";

export default function Home() {
 const router = useRouter();

 return (
  <ScreenWrapper>
   <div className="flex flex-col w-full h-full gap-3">
    <OuterComponent corner="top-left" link="tbd" label="TBD" />
    <OuterComponent corner="bottom-left" link="resume" label="Resume" />
   </div>
   <div>
    <CenterImage />
   </div>
   <div className="flex flex-col w-full h-full gap-3">
    <OuterComponent corner="top-right" link="https://www.linkedin.com/in/rijad-rajkić-46b555164/" label="LinkedIn" />
    <OuterComponent corner="bottom-right" link="https://github.com/RijadRajkic" label="GitHub" />
   </div>
  </ScreenWrapper>
 );
}
