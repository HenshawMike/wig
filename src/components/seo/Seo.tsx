import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
}

export const SEO = ({
  title = 'Domtornyluxe Hairmpire - Luxury extentions for Confident Women',
  description = 'Crown your confidence with handcrafted luxury wigs. Premium quality, customized comfort, and fast worldwide delivery.',
  type = 'website',
  image = '/og-image.jpg', // Update with your actual OG image path
  url = 'https://domtornyluxehairmpire.netlify.app',
  siteName = 'Domtornyluxe Hairmpire',
  twitterCard = 'summary_large_image',
  twitterSite = '@DomtornyluxeHairmpire',
  noIndex = false,
  canonicalUrl,
  keywords = ['luxury wigs', 'premium wigs', 'handcrafted wigs', 'natural hair wigs', 'custom wigs', 'women wigs']
}: SeoProps) => {
  const fullUrl = canonicalUrl ? new URL(canonicalUrl, url).toString() : url;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="author" content="Domtornyluxe Hairmpire" />
      <meta name="theme-color" content="#000000" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': siteName,
          'url': fullUrl,
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${fullUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
