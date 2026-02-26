import type { CollectionConfig } from 'payload'

export const Combos: CollectionConfig = {
  slug: 'combos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'drug1', 'drug2', 'updatedAt'],
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
      admin: {
        description: 'URL-friendly combo identifier (e.g., "lsd_mdma")',
      },
    },
    {
      name: 'drug1',
      type: 'text',
      required: true,
      label: 'Drug 1',
      index: true,
      admin: {
        description: 'First psychoactive substance in the combination',
      },
    },
    {
      name: 'drug2',
      type: 'text',
      required: true,
      label: 'Drug 2',
      index: true,
      admin: {
        description: 'Second psychoactive substance in the combination',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Information about this combination including reports and research',
      },
    },
  ],
}
