import { Helmet } from "react-helmet-async";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | HeavyDriver</title>
        <meta
          name="description"
          content="The page you’re looking for doesn’t exist or may have been moved. Return to HeavyDriver and continue driving smart and safe."
        />
        <meta property="og:title" content="404 — Page Not Found | HeavyDriver" />
        <meta
          property="og:description"
          content="Oops! The page you're looking for couldn't be found. Head back to HeavyDriver and continue your journey."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex flex-col items-center justify-center py-50 text-yellow-400">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-xl mb-6">Oops! The page you’re looking for doesn’t exist.</p>
        <a
          href="/"
          className="p-button p-button-warning font-semibold text-black px-6 py-3 rounded-lg"
        >
          Go Back Home
        </a>
      </div>
    </>
  );
};

export default NotFound;
