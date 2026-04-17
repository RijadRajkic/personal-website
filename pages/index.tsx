import { CenterImage, PageWrapper, AboutMe, Box } from "@/components";

export default function Home() {
 return (
  <PageWrapper className="justify-center items-center flex-row gap-16">
   <CenterImage />
   <AboutMe
    className="text-pretty text-lg text-text text w-80 cursor-default"
    text="As a full-stack web developer, I have extensive experience creating
          dynamic and responsive web applications using popular frameworks
          like React, Next.js and Express. I'm dedicated to delivering high-
          quality work with strong attention to detail and proficiency in
          teamwork"
   />
  </PageWrapper>
 );
}
