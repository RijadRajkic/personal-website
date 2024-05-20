import { CenterImage, PageWrapper, AboutMe } from "@/components";

export default function Home() {
 return (
  <PageWrapper className="justify-center items-center flex-row">
   <CenterImage />
   <AboutMe />
  </PageWrapper>
 );
}
