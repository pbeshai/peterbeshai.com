import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ThemeProvider } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import GlobalStyle from '../utils/GlobalStyle';
import WebFont from 'webfontloader';
import { webFonts, theme } from '../utils/style';
import Nav from './Nav';
import Footer from './Footer';

import '../utils/prism-theme.css';

WebFont.load(webFonts);

const defaultDescription =
  'Peter Beshai makes usable tools and visualizations with code.';
const keywords =
  'data vis, visualization, creative coding, generative art, nba, basketball';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : 'https://peterbeshai.com';

const Layout = ({
  children,
  hideNavTitle,
  hideNav,
  pageTitle,
  description = defaultDescription,
  metaImage,
  slug = '',
}) => (
  <React.Fragment>
    <GlobalStyle />
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
            }
          }
        }
      `}
      render={data => {
        const baseTitle = data.site.siteMetadata.title;
        const fullTitle = pageTitle ? `${pageTitle} - ${baseTitle}` : baseTitle;

        return (
          <>
            <Helmet title={fullTitle}>
              <html lang="en" />
              <meta name="description" content={description} />
              <meta name="twitter:description" content={description} />
              <meta property="og:description" content={description} />
              <meta name="keywords" content={keywords} />
              <meta name="twitter:site" content="@pbesh" />
              <meta name="twitter:creator" content="@pbesh" />
              <meta
                property="og:title"
                content={pageTitle ? pageTitle : baseTitle}
              />
              <meta
                property="twitter:title"
                content={pageTitle ? pageTitle : baseTitle}
              />
              <meta property="og:url" content={`${baseUrl}${slug}`} />
              {metaImage && (
                <meta property="og:image" content={`${baseUrl}${metaImage}`} />
              )}
              {metaImage && (
                <meta name="twitter:image" content={`${baseUrl}${metaImage}`} />
              )}
            </Helmet>
            <ThemeProvider theme={theme}>
              <div>
                {!hideNav && <Nav showTitle={!hideNavTitle} />}
                {children}
                <Footer />
              </div>
            </ThemeProvider>
          </>
        );
      }}
    />
  </React.Fragment>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
