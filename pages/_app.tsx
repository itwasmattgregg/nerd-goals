import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import NProgress from "nprogress";
import Router from "next/router";

import "../styles/global.css";
import "nprogress/nprogress.css";

NProgress.configure({
  minimum: 0.5,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
