'use server'

import config from '@payload-config'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import { importMap } from './importMap.js'

// Wrap handleServerFunctions to make it an async server action
export async function serverFunction(args: any) {
  return handleServerFunctions({ ...args, config, importMap })
}
