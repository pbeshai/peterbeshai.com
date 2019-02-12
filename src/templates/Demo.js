import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';

import renderAst from '../utils/renderAst';
import Layout from '../components/layout';
import {
  Box,
  Link,
  Header,
  InlineList,
  InlineListItem,
} from '../components/core';

const jsLibs = {
  d3v4: 'https://d3js.org/d3.v4.min.js',
  d3v5: 'https://d3js.org/d3.v5.min.js',
};

class Demo extends React.Component {
  scriptRef = React.createRef();

  componentDidMount() {
    // start loading scripts
    this.loadScripts();
  }

  componentDidUpdate(prevProps) {
    if (this.prevProps !== this.props) {
      this.loadScripts();
    }
  }

  getScripts() {
    const { data } = this.props;
    const post = data.markdownRemark;

    let scripts = [];
    if (post.frontmatter.js_libs) {
      scripts = scripts.concat(
        post.frontmatter.js_libs.map(libId => jsLibs[libId])
      );
    }

    if (post.frontmatter.scripts) {
      scripts = scripts.concat(
        post.frontmatter.scripts.map(script => script.publicURL)
      );
    }

    return scripts;
  }

  loadScripts() {
    const allScripts = this.getScripts();
    let promise = Promise.resolve();
    this.scriptRef.current.innerHTML = '';
    if (!this.scriptRef.current) {
    }

    const loader = src => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = () => {
          resolve(src);
        };
        script.onload = () => {
          resolve(src);
        };

        // Fire the loading
        if (!this.scriptRef.current) {
          reject(src);
        } else {
          this.scriptRef.current.appendChild(script);
        }
      });
    };

    // make them load in order
    for (const src of allScripts) {
      promise = promise.then(() => loader(src));
    }
  }

  render() {
    const { data } = this.props;
    const post = data.markdownRemark;

    return (
      <Layout
        pageTitle={post.frontmatter.title}
        description={post.frontmatter.description}
        metaImage={
          post.frontmatter.img && post.frontmatter.img.childImageSharp.fixed.src
        }
        slug={post.fields.slug}
      >
        <Helmet>
          <meta property="og:type" content="article" />
        </Helmet>
        <div ref={this.scriptRef} />
        <Box p={3} mx="auto" maxWidth={post.frontmatter.max_width || 800}>
          <Header fontSize={4}>{post.frontmatter.title}</Header>
          <InlineList color={'gray.6'} listStyleType="none">
            {post.frontmatter.blog && (
              <InlineListItem>
                <Link to={post.frontmatter.blog}>Blog Post</Link>
              </InlineListItem>
            )}
            {post.frontmatter.github && (
              <InlineListItem>
                <Link to={post.frontmatter.github}>GitHub</Link>
              </InlineListItem>
            )}
          </InlineList>
          {renderAst(post.htmlAst)}
        </Box>
      </Layout>
    );
  }
}

export default Demo;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
        blog
        description
        github
        max_width
        js_libs
        scripts {
          publicURL
        }
        img {
          childImageSharp {
            fixed(width: 1200, height: 630, quality: 90) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
      fields {
        slug
      }
    }
  }
`;
