import 'focus-visible/dist/focus-visible';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import '~/theme/nprogress.css'; //styles of nprogress

import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NextHead from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import env from '~/env';
import theme from '~/theme';
import Fonts from '~/theme/fonts';
import getLibrary from '~/utils/getLibrary';

function RouteBasedProviders({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const onStart = () => {
      NProgress.start();
    };

    const onError = () => {
      NProgress.done();
    };

    const onComplete = (url: string) => {
      NProgress.done();
      if (window.gtag && env.gaTrackingId) {
        window.gtag('config', env.gaTrackingId, {
          page_path: url,
        });
      }
    };

    NProgress.configure({ showSpinner: false });
    router.events.on('routeChangeStart', onStart);
    router.events.on('routeChangeComplete', onComplete);
    router.events.on('routeChangeError', onError);

    return () => {
      router.events.off('routeChangeStart', onStart);
      router.events.off('routeChangeComplete', onComplete);
      router.events.off('routeChangeError', onError);
    };
  }, [router.events]);

  return <>{children}</>;
}

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const { host } = env;
  const title = 'Credmark App';
  const description = '';
  // const img = `${host}/img/smart-pool.png`;

  return (
    <>
      <NextHead>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={host} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {/* <meta property="og:image" content={img} /> */}

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={host} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {/* <meta property="+twitter:image" content={img} /> */}
      </NextHead>
      <ChakraProvider resetCSS theme={theme}>
        <Fonts />
        <RouteBasedProviders>
          <Component {...pageProps} />
        </RouteBasedProviders>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
