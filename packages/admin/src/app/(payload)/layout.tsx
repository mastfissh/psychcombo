/* eslint-disable */
import React from 'react'

import '@payloadcms/next/css'
import './custom.css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <html>
    <body>
      {children}
    </body>
  </html>
)

export default Layout
