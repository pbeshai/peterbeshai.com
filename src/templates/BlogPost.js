import React from 'react';
import { graphql } from 'gatsby';
import { DiscussionEmbed } from 'disqus-react';
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

const BlogPost = ({ data }) => {
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
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Box p={3} mx="auto" maxWidth={800}>
        <Header fontSize={4}>{post.frontmatter.title}</Header>
        <InlineList color={'gray.6'} listStyleType="none">
          <InlineListItem>{post.frontmatter.date}</InlineListItem>
          <InlineListItem>{post.fields.readingTime.text}</InlineListItem>
          {post.frontmatter.demo && (
            <InlineListItem>
              <Link to={post.frontmatter.demo}>Demo</Link>
            </InlineListItem>
          )}
          {post.frontmatter.github && (
            <InlineListItem>
              <Link to={post.frontmatter.github}>GitHub</Link>
            </InlineListItem>
          )}
        </InlineList>
        {renderAst(post.htmlAst)}
        <Box mt={6}>
          <DiscussionEmbed
            shortname={'peter-beshai'}
            config={{ identifier: post.id, title: post.frontmatter.title }}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default BlogPost;

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      frontmatter {
        title
        demo
        description
        github
        img {
          childImageSharp {
            fixed(width: 1200, height: 630, quality: 90) {
              ...GatsbyImageSharpFixed
            }
          }
        }

        date(formatString: "MMMM D, YYYY")
      }
      fields {
        slug
        readingTime {
          text
        }
      }
    }
  }
`;
