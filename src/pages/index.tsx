import * as React from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import bookImage from './../images/book.jpeg';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main className="h-svh p-0 font-mono text-xs uppercase">
      <div className="grid h-full grid-cols-2 gap-4">
        <div className="grid h-full grid-cols-4 grid-rows-8 gap-1 p-24">
          <h1 className="col-span-4 row-span-2">A tribute to "Analog Algorithm"</h1>
          <div className="col-span-2 col-start-3 row-span-2">
            <a
              className="leading-9 underline underline-offset-8"
              href="https://www.analog-algorithm.com/"
            >
              Analog Algorithm
              <br />
              <span className="">978-3-03778-593-5</span>
            </a>
          </div>
          <ul className="col-span-2 col-start-1 row-start-5 list-none text-right">
            <li>
              <a className="underline underline-offset-8" href="/01">
                01 &nbsp; first steps
              </a>
            </li>
          </ul>
        </div>
        <div className="h-full">
          <img
            className="h-full object-cover"
            src={bookImage}
            alt="Foto of the Book 'Analog Algorithm'"
          />
        </div>
      </div>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;
