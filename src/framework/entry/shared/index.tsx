// the utilities that use by both client and server

import type React from 'react'

export const RSC_POSTFIX = '.rsc'
export const HTML_POSTFIX = '.html'

export const endWithRscPostfix = new RegExp(`${RSC_POSTFIX}$`)
export const endWithHtmlPostfix = new RegExp(`${HTML_POSTFIX}$`)

export type RscPayload = {
  root: React.ReactNode
}