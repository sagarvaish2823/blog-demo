import { cn } from "@/lib/utils";
import { Metadata } from "next/types";
import Posts from "./_components/post";

export const metadata: Metadata = {
  title: "Demo Blog",
};

export default async function BlogPage() {
  return (
    <section className="relative">
      <TopGradient />
      <section className="relative z-20 py-16 mx-6 md:mx-20 lg:mx-20 lg-2k:mx-auto lg-2k:max-w-[60vw] lg-4k:max-w-[30vw]">
        <section className="flex justify-center gap-2">
          <h1
            className={cn(
              "text-4xl font-semibold tracking-tighter lg:text-7xl",
              "inline-block bg-gradient-to-r from-[#524e2d] to-[#252418] bg-clip-text text-transparent"
            )}
          >
            Insights by <br />
            Meditative Folks
          </h1>
          {/* <Image
            src={BlogImg}
            alt="blog header image"
            height={100}
            width={150}
          /> */}
        </section>
        {/* <section className="pb-4 pt-[4rem]">
          <Categories />
        </section> */}
        <section className="pt-8">
          <Posts />
        </section>
      </section>
    </section>
  );
}

type GradientProps = {
  gradient?: string;
};

const TopGradient = ({ gradient }: GradientProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 z-10 h-full w-[98.5vw] opacity-20",
        !gradient
          ? "bg-gradient-to-br from-[#fff282] from-[20%] via-transparent"
          : gradient
      )}
    />
  );
};
