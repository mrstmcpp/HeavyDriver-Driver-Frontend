import { Helmet } from "react-helmet-async";
import PageMeta from "./common/PageMeta";

const NotFound = () => {
  return (
    <>
      <PageMeta page={"notFound"} />

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
