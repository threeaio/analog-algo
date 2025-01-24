import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const Page01: React.FC<PageProps> = () => {
  return (
    <main className="p-24 font-sans">
      <a href="/01">01</a>
    </main>
  )
}

export default Page01

export const Head: HeadFC = () => <title>Page 01</title>
