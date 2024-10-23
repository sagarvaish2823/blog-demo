import Link from "next/link";

import { Button } from "@/components/ui/button";
import { gql } from "@apollo/client";
import client from "@/config/apollo-client";
import { unstable_cache } from "next/cache";

const GET_ITEMS_QUERY = gql`
  query getAllCategories {
    categories(first: 100) {
      nodes {
        count
        description
        id
        name
        slug
      }
    }
  }
`;

export type blog_category = {
  id: string;
  name: string;
  slug: string;
  count: string | null;
  description: string | null;
};

const fetchcategories = async () => {
  const { data } = await client.query({
    query: GET_ITEMS_QUERY,
  });

  return data;
};

const getCachedcategories = unstable_cache(
  async () => fetchcategories(),
  ["posts"]
);

export default async function Categories() {
  const data = await getCachedcategories();

  if (!data) {
    return <div>Problem loading categories.</div>;
  }

  const categories = data.categories.nodes as blog_category[];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link key={"all"} href={`/blog`}>
        <Button className="rounded-2xl">
          <p>All</p>
        </Button>
      </Link>
      {categories.map(({ count, name, slug }) =>
        count ? (
          <Link key={slug} href={`/topic/${slug}`}>
            <Button className="rounded-2xl">{name}</Button>
          </Link>
        ) : null
      )}
    </div>
  );
}
