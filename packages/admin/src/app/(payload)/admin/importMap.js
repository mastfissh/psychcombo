import { CollectionCards } from '@payloadcms/next/rsc'

export const importMap = {
  '@payloadcms/next/rsc#CollectionCards': CollectionCards,
  '@payload-config': () => import('@payload-config'),
}
