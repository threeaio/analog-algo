import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main className="p-24 font-sans">
      <a href="/01">01</a><br />
     Hallo
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
