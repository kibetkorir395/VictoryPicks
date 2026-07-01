import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '': {
    title: 'VICTORY PICKS — Expert Football Predictions & VIP Tips',
    description:
      'Get expert football tips, accurate match predictions, VIP picks, live scores and the latest betting odds. Stay updated with fixtures and results from top leagues worldwide.',
    type: 'website',
  },
  subscribe: {
    title: 'Subscribe — VIP Football Predictions | VICTORY PICKS',
    description:
      'Subscribe to VICTORY PICKS for VIP football predictions, expert analysis and live updates. Choose daily, weekly or monthly plans. Pay securely in KES or NGN.',
    type: 'product',
  },
  about: {
    title: 'About VICTORY PICKS — Football Predictions & Expert Analysis',
    description:
      'Learn about VICTORY PICKS — your destination for accurate football predictions, expert analysis, live scores and real-time updates across major leagues and competitions.',
    type: 'website',
  },
  login: {
    title: 'Sign In | VICTORY PICKS',
    description: 'Sign in to your VICTORY PICKS account to access VIP football predictions and expert analysis.',
    type: 'website',
  },
  register: {
    title: 'Create Account | VICTORY PICKS',
    description: 'Register for a VICTORY PICKS account to start receiving expert football predictions and VIP tips.',
    type: 'website',
  },
};

const DEFAULT_META = {
  title: 'VICTORY PICKS — Expert Football Predictions & VIP Tips',
  description:
    'Get expert football tips, accurate match predictions, VIP picks, live scores and the latest betting odds from top leagues worldwide.',
  type: 'website',
};

export default function AppHelmet({ title }) {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const meta = PAGE_META[path] || DEFAULT_META;
  const fullTitle = title ? `${title} | VICTORY PICKS` : meta.title;
  const canonicalUrl = `${window.location.origin}${location.pathname}`;
  const logoUrl = `${window.location.origin}/logo512.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content="VICTORY PICKS" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={logoUrl} />
      <meta property="og:image:secure_url" content={logoUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@flashviptips_ke" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={logoUrl} />

      <link rel="alternate" href={canonicalUrl} hreflang="en" />
    </Helmet>
  );
}
