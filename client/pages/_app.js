import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";
import Footer from "../components/footer";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <Header currentUser={currentUser} />
        <div className="container">
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
      <Footer />
    </>
  );
};

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
