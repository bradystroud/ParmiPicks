import { Analytics } from "@vercel/analytics/next";
import "../styles.css";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
};

export default App;
