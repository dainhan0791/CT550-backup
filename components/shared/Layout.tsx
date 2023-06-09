import Head from 'next/head';
import React from 'react';

import Header from './Header';

const Layout = ({ children, title, details }: { children: React.ReactNode; title: string; details?: boolean }) => {
  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/logo.jpg" />
        <title>{title}</title>
      </Head>
      <main>
        {!details && <Header title={title} />}
        {children}
      </main>
    </>
  );
};

export default Layout;
