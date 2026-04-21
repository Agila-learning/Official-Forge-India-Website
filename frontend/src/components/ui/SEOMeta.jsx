import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEOMeta — drop into any page for complete SEO + Open Graph coverage.
 *
 * Usage:
 *   <SEOMeta
 *     title="Job Consultancy in Chennai | Forge India Connect"
 *     description="Top job placement agency in Chennai & Krishnagiri..."
 *     keywords="job consultancy chennai, banking jobs, IT placement"
 *     canonical="https://forgeindiaconnect.com/jobs"
 *     image="https://forgeindiaconnect.com/og-default.jpg"
 *   />
 */
const SEOMeta = ({
  title = 'Forge India Connect | Job Consulting, Business Services & Placement',
  description = 'Forge India Connect (FIC) is a leading job consultancy and business services platform in Chennai, Krishnagiri & Bangalore. We offer job placement, digital marketing, web development, insurance, and home services across South India.',
  keywords = 'job consultancy chennai, banking job placement, IT jobs south india, HR consultancy freshers, job placement krishnagiri, digital marketing services, website development chennai, business services india, forge india connect',
  canonical,
  image = 'https://forgeindiaconnect.com/og-default.jpg',
  type = 'website',
  noIndex = false,
}) => {
  const siteUrl = 'https://forgeindiaconnect.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Forge India Connect" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo / Local SEO */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai, Tamil Nadu, India" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#312e81" />
    </Helmet>
  );
};

export default SEOMeta;
