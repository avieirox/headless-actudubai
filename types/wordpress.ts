import { z } from "zod";

export const ImgSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().optional().nullable(),
  mediaDetails: z
    .object({ width: z.number().optional(), height: z.number().optional() })
    .optional()
    .nullable(),
});

export const TaxNodeSchema = z.object({ id: z.string(), name: z.string(), slug: z.string() });

export const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  excerpt: z.string().optional().nullable(),
  author: z
    .object({
      node: z
        .object({ name: z.string().optional().nullable(), avatar: z.object({ url: z.string().url().optional().nullable() }).optional().nullable() })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  featuredImage: z
    .object({ node: ImgSchema.nullable().optional() })
    .optional()
    .nullable(),
  categories: z.object({ nodes: z.array(TaxNodeSchema) }).optional(),
});

export const AllPostsResSchema = z.object({
  posts: z.object({ nodes: z.array(PostSchema) }),
});

export type Post = z.infer<typeof PostSchema>;
export type AllPostsRes = z.infer<typeof AllPostsResSchema>;
