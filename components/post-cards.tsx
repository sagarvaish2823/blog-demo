import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "./ui/badge";

type Blog_Item = {
  date: string;
  excerpt: string | undefined;
  slug: string;
  title: string;
  featuredImage: {
    node: {
      mediaDetails: {
        file: string;
        sizes: Array<{
          sourceUrl: string;
          width: string;
          height: string;
        }>;
      };
      altText: string;
    };
  };
  commnentCount: string | null;
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
};

export default function PostCards({
  title,
  excerpt = "Read about this exciting blog.",
  categories,
  date,
  featuredImage,
  slug,
}: Blog_Item) {
  const blogImg = featuredImage
    ? featuredImage.node.mediaDetails.sizes[0].sourceUrl
    : "https://supabase.hushupidda.com/storage/v1/object/public/upload-test/1729576799834_banner.png";

  const blogImgAlt = featuredImage
    ? featuredImage.node.altText
    : "ecoorbit blog image";

  const formattedDate = format(date, "dd MMM yyyy");

  return (
    <Link
      href={`/${slug}`}
      className="group relative row-span-4 grid grid-rows-subgrid overflow-hidden rounded-lg border bg-white px-4 py-4 shadow hover:shadow-lg hover:shadow-yellow-200"
    >
      <div className="relative h-[10rem] w-full overflow-hidden rounded-xl">
        <Image
          src={blogImg}
          alt={blogImgAlt}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          className="rounded-xl object-cover transition-all duration-200 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2">
          <Badge
            variant={"default"}
            className="text-nowrap bg-blue-400 transition-colors group-hover:bg-emerald-300 group-hover:text-black"
            // className="bg-purple-500 text-white"
          >
            {categories.nodes[0].name}
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="line-clamp-2 text-pretty text-lg font-[500]">{title}</h3>
      </div>
      <div
        className="line-clamp-3 w-full text-pretty text-secondary_text_color"
        dangerouslySetInnerHTML={{ __html: excerpt }}
      />
      <div className="flex items-center gap-2 pb-4 text-secondary_text_color">
        <div>
          <Badge
            variant={"secondary"}
            className="text-nowrap bg-emerald-300 transition-colors group-hover:bg-blue-400 group-hover:text-white"
          >
            {formattedDate}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
