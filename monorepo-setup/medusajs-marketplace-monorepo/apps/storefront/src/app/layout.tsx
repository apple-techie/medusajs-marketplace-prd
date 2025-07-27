import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import { TwentyFirstToolbar } from "@21st-extension/toolbar-next"
import { ReactPlugin } from "@21st-extension/react"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <TwentyFirstToolbar
          config={{
            plugins: [ReactPlugin],
          }}
        />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
