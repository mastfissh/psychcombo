import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const psychoactivesCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/psychoactives" }),
  schema: ({ image }) => z.object({
    title: z.string(),
    image_caption: z.string().optional(),
    image_location: image(),
    aka: z.array(z.string()).optional(),
    family_members: z.array(z.string()).optional(),
    duration_chart_title: z.string(),
    duration_chart: z.object({
      total: z.string(),
      onset: z.string(),
      coming_up: z.string(),
      plateau: z.string(),
      coming_down: z.string(),
    }),
    positive_effects: z.string(),
    negative_effects: z.string(),
    neutral_effects: z.string(),
    dosage_table: z.object({
      title: z.string(),
      threshold: z.string(),
      light: z.string(),
      common: z.string(),
      strong: z.string(),
      heavy: z.string(),
    }),
    warnings: z.string().optional()
  })
});

const combosCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/combos" }),
  schema: () => z.object({
    title: z.string(),
  })
});

export const collections = {
  psychoactives: psychoactivesCollection,
  combos: combosCollection
};
