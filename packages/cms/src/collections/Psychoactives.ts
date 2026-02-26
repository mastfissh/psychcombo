import type { CollectionConfig } from 'payload'

export const Psychoactives: CollectionConfig = {
  slug: 'psychoactives',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'aka', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly version of the title (e.g., "lsd", "cannabis-species")',
      },
    },
    {
      name: 'aka',
      type: 'array',
      label: 'Also Known As (Aliases)',
      fields: [
        {
          name: 'alias',
          type: 'text',
        },
      ],
    },
    {
      name: 'family_members',
      type: 'array',
      label: 'Family Members',
      fields: [
        {
          name: 'member',
          type: 'text',
        },
      ],
    },
    {
      name: 'image_caption',
      type: 'text',
    },
    {
      name: 'image_location',
      type: 'text',
      admin: {
        description: 'Path to the image file',
      },
    },
    {
      name: 'duration_chart_title',
      type: 'text',
      defaultValue: 'Duration Chart',
    },
    {
      name: 'duration_chart',
      type: 'group',
      label: 'Duration Chart',
      fields: [
        {
          name: 'total',
          type: 'text',
          label: 'Total Duration',
        },
        {
          name: 'onset',
          type: 'text',
        },
        {
          name: 'coming_up',
          type: 'text',
          label: 'Coming Up',
        },
        {
          name: 'plateau',
          type: 'text',
        },
        {
          name: 'coming_down',
          type: 'text',
          label: 'Coming Down',
        },
        {
          name: 'after_effects',
          type: 'text',
          label: 'After Effects',
        },
      ],
    },
    {
      name: 'positive_effects',
      type: 'textarea',
      label: 'Positive Effects',
    },
    {
      name: 'negative_effects',
      type: 'textarea',
      label: 'Negative Effects',
    },
    {
      name: 'neutral_effects',
      type: 'textarea',
      label: 'Neutral Effects',
    },
    {
      name: 'dosage_table',
      type: 'group',
      label: 'Dosage Table',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Dosage Table',
        },
        {
          name: 'threshold',
          type: 'text',
        },
        {
          name: 'light',
          type: 'text',
        },
        {
          name: 'common',
          type: 'text',
        },
        {
          name: 'strong',
          type: 'text',
        },
        {
          name: 'heavy',
          type: 'text',
        },
      ],
    },
    {
      name: 'warnings',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Additional Content',
      admin: {
        description: 'Additional information about this psychoactive substance',
      },
    },
  ],
}
