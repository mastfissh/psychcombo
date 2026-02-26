import type { CollectionConfig } from 'payload'

export const Risks: CollectionConfig = {
  slug: 'risks',
  admin: {
    useAsTitle: 'combo',
    defaultColumns: ['drug1', 'drug2', 'risk_level', 'confidence'],
  },
  fields: [
    {
      name: 'drug1',
      type: 'text',
      required: true,
      index: true,
      label: 'Drug 1',
    },
    {
      name: 'drug2',
      type: 'text',
      required: true,
      index: true,
      label: 'Drug 2',
    },
    {
      name: 'combo',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Computed field: drug1_drug2 (alphabetically sorted)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.drug1 && data?.drug2) {
              const drugs = [data.drug1, data.drug2].sort()
              return `${drugs[0]}_${drugs[1]}`
            }
            return data?.combo
          },
        ],
      },
    },
    {
      name: 'risk_level',
      type: 'select',
      required: true,
      options: [
        { label: 'Significant Risk (SR)', value: 'SR' },
        { label: 'Greater Risk (GR)', value: 'GR' },
        { label: 'Minor Risk (MR)', value: 'MR' },
        { label: 'Low Risk Synergy (LRS)', value: 'LRS' },
        { label: 'Low Risk Decrease (LRD)', value: 'LRD' },
        { label: 'Low Risk (LR)', value: 'LR' },
        { label: 'No Data (ND)', value: 'ND' },
      ],
      index: true,
    },
    {
      name: 'confidence',
      type: 'select',
      options: [
        { label: 'High Confidence (HC)', value: 'HC' },
        { label: 'Medium Confidence (MC)', value: 'MC' },
        { label: 'Low Confidence (LC)', value: 'LC' },
        { label: 'No Confidence (NC)', value: 'NC' },
      ],
    },
  ],
}
