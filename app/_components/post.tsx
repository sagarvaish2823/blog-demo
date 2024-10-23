import PostCards from "@/components/post-cards";
import client from "@/config/apollo-client";
import { gql } from "@apollo/client";
import { unstable_cache } from "next/cache";

const GET_ITEMS_QUERY = gql`
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

export type Blog_Item = {
  date: string;
  excerpt: string;
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

const fetchPosts = async () => {
  const { data } = await client.query({
    query: GET_ITEMS_QUERY,
  });

  return data;
};

const getCachedPosts = unstable_cache(async () => fetchPosts(), ["posts"]);

export default async function Posts() {
  const data = await getCachedPosts();

  const allPosts = data.posts.nodes as Blog_Item[];

  return (
    <div>
      <section>
        <div className="mt-16 space-y-2">
          <h2 className="text-center text-3xl font-semibold">Read Blogs</h2>
        </div>
        <div className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {allPosts.map((post) => (
              <PostCards key={post.slug} {...post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
