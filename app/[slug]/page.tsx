import { format } from "date-fns";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import { Fragment } from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

import { cn, getLargestImage } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { gql } from "@apollo/client";
import client from "@/config/apollo-client";
import { Blog_Item } from "../_components/post";
import { unstable_cache } from "next/cache";

const GET_ITEMS_QUERY = gql`
  query getSinglePost($id: ID!) {
    post(id: $id, idType: SLUG) {
      id
      content(format: RENDERED)
      date
      excerpt(format: RENDERED)
      modified
      slug
      title(format: RENDERED)
      featuredImage {
        node {
          mediaDetails {
            sizes {
              sourceUrl
              width
              height
            }
          }
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      commentCount
    }
  }
`;

type SinglePost = {
  id: string;
  content: string | undefined;
  date: string;
  excerpt: string | undefined;
  modified: string;
  slug: string;
  title: string;
  featuredImage: {
    node: {
      mediaDetails: {
        sizes: Array<{
          sourceUrl: string;
          width: string;
          height: string;
        }>;
      };
      altText: string;
    };
  };
  categories: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  commentCount: string | null;
};

const GET_POSTS_QUERY = gql`
  query getAllPosts {
    posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        date
        excerpt(format: RENDERED)
        slug
        title
        featuredImage {
          node {
            mediaDetails {
              file
              sizes {
                sourceUrl
                width
                height
              }
            }
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        commentCount
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export async function generateStaticParams() {
  const { data } = await client.query({
    query: GET_POSTS_QUERY,
  });

  const allPosts = data.posts.nodes as Blog_Item[];

  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

const fetchPost = async ({ slug }: { slug: string }) => {
  const { data } = await client.query({
    query: GET_ITEMS_QUERY,
    variables: {
      id: slug,
    },
  });

  return data;
};

const getCachedcategories = unstable_cache(
  async ({ slug }) => fetchPost({ slug }),
  ["posts"]
);

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCachedcategories({ slug });

  if (!data) {
    return notFound();
  }
  const post = data.post as SinglePost;

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const data = await getCachedcategories({ slug });

  if (!data) {
    return notFound();
  }
  const post = data.post as SinglePost;

  if (!post.featuredImage) {
    return (
      <SinglePostComponent
        altText={"Eco orbit blog post"}
        content={post.content ? post.content : "No Content"}
        excerpt={post.excerpt ? post.excerpt : ""}
        sourceUrl={process.env.EXTRA_IMAGE!}
        title={post.title}
        modified={post.modified}
      />
    );
  }
  const sizes = post.featuredImage.node.mediaDetails.sizes;
  const largestImage = getLargestImage(sizes);

  return (
    <Fragment>
      <section className="flex grid-cols-[1.4fr,0.6fr] flex-col gap-4 lg:grid">
        <div>
          <SinglePostComponent
            altText={post.featuredImage.node.altText}
            content={post.content ? post.content : "No Content"}
            excerpt={post.excerpt ? post.excerpt : "No excerpt"}
            sourceUrl={
              largestImage.sourceUrl
                ? largestImage.sourceUrl
                : process.env.EXTRA_IMAGE!
            }
            title={post.title}
            modified={post.modified}
          />
        </div>
        <div className="relative mx-auto">
          <div
            className={cn(
              "top-[7.5rem] mb-8 w-[20rem] rounded-xl bg-[#ffe291] p-6 shadow-md lg:sticky"
              // "bg-gradient-to-br from-green-200 via-transparent",
            )}
          >
            <p className="text-2xl font-semibold">Need an audit?</p>
            <div className="relative mt-8 h-[15rem] w-full">
              {/* <Image
                src={FreewayImg}
                alt="freeway"
                fill
                className="rounded-2xl"
              /> */}
            </div>
            <div className="flex items-center justify-center gap-2 pt-4">
              <Link href={"/enquiry"}>
                <Button size={"sm"}>Enquire now</Button>
              </Link>
              <Link href={"/services"}>
                <Button size={"sm"}>Our Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

interface SinglePostProps {
  title: string;
  excerpt: string;
  sourceUrl: string | StaticImageData;
  altText: string;
  content: string;
  modified: string;
}

function SinglePostComponent({
  altText,
  content,
  excerpt,
  sourceUrl,
  title,
  modified,
}: SinglePostProps) {
  const formattedModifiedDate = format(modified, "dd MMM yyyy");
  return (
    <section className="mt-8 pb-[8rem] pt-6 mx-6 md:mx-20 lg:mx-20 lg-2k:mx-auto lg-2k:max-w-[60vw] lg-4k:max-w-[30vw]">
      <div className="relative h-[30rem] w-full">
        <Image
          src={sourceUrl}
          alt={altText}
          fill
          className="rounded-xl object-cover shadow-md"
        />
      </div>

      <div className="my-4">
        <Separator />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 py-2 text-secondary_text_color">
            <div>{formattedModifiedDate}</div>
            {/* <div className="flex items-center gap-2">
              <MessageCircle className="size-6" />
              <p>{commentCount ? commentCount : 0}</p>
            </div> */}
          </div>
          <div className="flex items-center gap-4 py-2 text-secondary_text_color">
            <Link target="_blank" href={"#"}>
              <FaFacebook className="size-6 transition-colors hover:fill-blue-700" />
            </Link>
            <Link target="_blank" href={"#"}>
              <RiInstagramFill className="size-6 transition-colors hover:fill-[#E1306C]" />
            </Link>
            <Link target="_blank" href={"#"}>
              <FaLinkedin className="size-6 transition-colors hover:fill-[#0077B5]" />
            </Link>
          </div>
        </div>
        <Separator />
      </div>
      <div className="pt-8">
        <h1 className="text-left text-5xl font-[600] leading-[3.5rem]">
          {title}
        </h1>
        <div
          className="pt-2 text-left text-2xl text-secondary_text_color"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
      </div>
      <div
        className="prose mt-6 lg:prose-lg prose-img:scale-90 prose-img:rounded-2xl"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
