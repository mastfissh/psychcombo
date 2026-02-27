import type { CollectionConfig } from 'payload'

export const Psychoactives: CollectionConfig = {
  slug: 'psychoactives',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'image_caption',
      type: 'text',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'aka',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'family_members',
      type: 'array',
      fields: [
        {
          name: 'member',
          type: 'text',
        },
      ],
    },
    {
      name: 'duration_chart_title',
      type: 'text',
      required: true,
    },
    {
      name: 'duration_chart',
      type: 'group',
      fields: [
        {
          name: 'total',
          type: 'text',
          required: true,
        },
        {
          name: 'onset',
          type: 'text',
          required: true,
        },
        {
          name: 'coming_up',
          type: 'text',
          required: true,
        },
        {
          name: 'plateau',
          type: 'text',
          required: true,
        },
        {
          name: 'coming_down',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'positive_effects',
      type: 'text',
    },
    {
      name: 'negative_effects',
      type: 'text',
    },
    {
      name: 'neutral_effects',
      type: 'text',
    },
    {
      name: 'dosage_table',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'threshold',
          type: 'text',
          required: true,
        },
        {
          name: 'light',
          type: 'text',
          required: true,
        },
        {
          name: 'common',
          type: 'text',
          required: true,
        },
        {
          name: 'strong',
          type: 'text',
          required: true,
        },
        {
          name: 'heavy',
          type: 'text',
          required: true,
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
      required: true,
    },
  ],
}
