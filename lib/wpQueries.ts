// Posts con Yoast y relaciones básicas
export const ALL_POSTS_QUERY = /* GraphQL */ `
  query AllPosts($first: Int = 100) {
    posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        slug
        date
        title
        excerpt
        author { node { name avatar { url } } }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        categories { nodes { id name slug } }
        tags { nodes { id name slug } }
        seo {
          title
          metaDesc
          opengraphType
          opengraphTitle
          opengraphDescription
          opengraphImage { mediaItemUrl }
        }
      }
    }
  }
`;

export const ALL_CATEGORIES_QUERY = /* GraphQL */ `
  query AllCategories($first:Int = 100) {
    categories(first:$first) { nodes { id name slug count } }
  }
`;

export const ALL_TAGS_QUERY = /* GraphQL */ `
  query AllTags($first:Int = 100) {
    tags(first:$first) { nodes { id name slug count } }
  }
`;

export const ALL_CATEGORY_SLUGS_QUERY = /* GraphQL */ `
  query AllCategorySlugs($first:Int = 1000) {
    categories(first:$first) { nodes { slug } }
  }
`;

export const POSTS_BY_CATEGORY_SLUG_QUERY = /* GraphQL */ `
  query PostsByCategory($slug: String!, $first: Int = 100) {
    posts(first: $first, where: { categoryName: $slug, orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        date
        title
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        categories { nodes { id name slug } }
        tags { nodes { id name slug } }
      }
    }
  }
`;

// Slugs de posts con categorías (para rutas /:category/:slug)
export const ALL_POSTS_WITH_CATEGORY_SLUGS = /* GraphQL */ `
  query AllPostsWithCategorySlugs($first: Int = 1000) {
    posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        categories { nodes { slug } }
      }
    }
  }
`;

// Detalle de categoría por slug (para nombre "bonito")
export const CATEGORY_BY_SLUG_QUERY = /* GraphQL */ `
  query CategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      slug
      name
      description
      count
    }
  }
`;

// Category with Yoast SEO fields (may not exist on all schemas)
export const CATEGORY_BY_SLUG_WITH_SEO_QUERY = /* GraphQL */ `
  query CategoryBySlugWithSeo($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      slug
      name
      description
      count
      seo {
        title
        metaDesc
        opengraphTitle
        opengraphDescription
      }
    }
  }
`;

// Variante sin campos SEO (para fallback cuando el esquema no los expone)
export const ALL_POSTS_QUERY_NO_SEO = /* GraphQL */ `
  query AllPostsNoSeo($first: Int = 100) {
    posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        slug
        date
        title
        excerpt
        author { node { name avatar { url } } }
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        categories { nodes { id name slug } }
        tags { nodes { id name slug } }
      }
    }
  }
`;

// Minimal variant (no SEO, no avatar) to survive schemas without `avatar`
export const ALL_POSTS_BARE_QUERY = /* GraphQL */ `
  query AllPostsBare($first: Int = 100) {
    posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
      nodes {
        id
        slug
        date
        title
        excerpt
        author { node { name } }
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        categories { nodes { id name slug } }
        tags { nodes { id name slug } }
      }
    }
  }
`;

// Slugs de todos los posts para SSG
export const ALL_POST_SLUGS_QUERY = /* GraphQL */ `
  query AllPostSlugs($first: Int = 1000) {
    posts(first: $first) {
      nodes { slug }
    }
  }
`;

// Post por slug con SEO (Yoast)
export const POST_BY_SLUG_QUERY = /* GraphQL */ `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails { width height }
        }
      }
      categories { nodes { id name slug } }
      tags { nodes { id name slug } }
      seo {
        title
        metaDesc
        opengraphType
        opengraphTitle
        opengraphDescription
        opengraphImage { mediaItemUrl }
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY_NO_SEO = /* GraphQL */ `
  query PostBySlugNoSeo($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails { width height }
        }
      }
      categories { nodes { id name slug } }
      tags { nodes { id name slug } }
    }
  }
`;

// Autores con posts publicados (para author-sitemap)
export const ALL_AUTHORS_QUERY = /* GraphQL */ `
  query AllAuthors($first: Int = 1000) {
    users(first: $first, where: { hasPublishedPosts: POST }) {
      nodes { slug }
    }
  }
`;

// Fetch SEO data for a URI (front page, pages, posts) when WPGraphQL exposes nodeByUri
export const SEO_BY_URI_QUERY = /* GraphQL */ `
  query SeoByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page { seo { title metaDesc opengraphTitle opengraphDescription opengraphImage { mediaItemUrl } } title }
      ... on Post { seo { title metaDesc opengraphTitle opengraphDescription opengraphImage { mediaItemUrl } } title }
      ... on Category { seo { title metaDesc opengraphTitle opengraphDescription } name }
    }
  }
`;
