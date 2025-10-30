import React from "react";
import { Helmet } from "react-helmet-async";
import { seoConfig } from "../../utils/seoConfig.jsx";

const PageMeta = ({ page }) => {
  const meta = seoConfig[page] || seoConfig.homepage;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default PageMeta;
