import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled, { css } from 'styled-components';
import GitHubButton from 'github-buttons/dist/react';

import { Image, Text, Box, Flex, Link, Header, Grid } from '../components/core';
import Layout from '../components/layout';
import Nav from '../components/Nav';

const Section = ({ header, children, ...other }) => (
  <Box pt={3} pb={6} px={3} {...other}>
    <Header pl={3} my={3}>
      {header}
    </Header>
    {children}
  </Box>
);

const GridSection = ({ gridSize = 4, children, ...other }) => (
  <Section {...other}>
    <Grid p={3} gridGap={4} gridTemplateColumnsFill={gridSize}>
      {children}
    </Grid>
  </Section>
);

const GridItem = ({ url, banner, title, subhead }) => (
  <Text lineHeight={1.5}>
    <Link to={url}>
      {banner && <Image mb={2} fluid={banner.childImageSharp.fluid} />}
      <Text as="span">{title}</Text>
    </Link>
    <Text color={'gray.6'} fontSize={1} mt={1}>
      {subhead}
    </Text>
  </Text>
);

const GitHubGridItem = ({ url, github, title, subhead }) => (
  <Text lineHeight={1.5}>
    <Link to={url}>
      <Text as="span">{title}</Text>
    </Link>
    <Box mt={2}>
      <GitHubButton
        href={github}
        data-icon="octicon-star"
        data-show-count="true"
      >
        Star
      </GitHubButton>
    </Box>
    <Text color={'gray.6'} fontSize={1}>
      {subhead}
    </Text>
  </Text>
);

const IndexPage = ({ data }) => {
  const { blog, projects, experiments, page } = data;
  console.log('got data', data);
  console.log(page);
  return (
    <Layout hideNavTitle hideNav>
      <Helmet>
        <meta property="og:type" content="website" />
      </Helmet>
      <Flex minHeight="100vh" flexDirection="column">
        <Flex
          minHeight="80vh"
          py={50}
          alignItems="center"
          justifyContent="center"
        >
          <Box width={350} px={3}>
            <Header>Peter Beshai</Header>
            <p>
              I'm the Director of Engineering and Design at{' '}
              <Link to="https://cortico.ai">Cortico</Link> in Cambridge, MA.
            </p>
            <p>I make usable tools and visualizations with code.</p>
          </Box>
        </Flex>
        <Nav showTitle={false} hideHome />
        <GridSection id="writing" header="Writing" bg="gray.0" gridSize={4}>
          {blog &&
            blog.edges.map(({ node }) => {
              return (
                <GridItem
                  key={node.id}
                  url={node.frontmatter.url || node.fields.slug}
                  banner={node.frontmatter.banner}
                  title={node.frontmatter.title}
                  subhead={
                    <>
                      {node.frontmatter.date}
                      <Text color={'gray.6'} fontSize={1} display="inline">
                        {node.frontmatter.host &&
                          ` on ${node.frontmatter.host}`}
                      </Text>
                    </>
                  }
                />
              );
            })}
        </GridSection>

        <GridSection id="projects" header="Projects" bg="gray.1" gridSize={6}>
          {projects &&
            projects.edges.map(({ node }) => {
              return (
                <GridItem
                  key={node.id}
                  url={node.frontmatter.url || node.fields.slug}
                  banner={node.frontmatter.banner}
                  title={node.frontmatter.title}
                  subhead={
                    <>
                      {node.frontmatter.date}
                      <Text color={'gray.6'} fontSize={1} display="inline">
                        {node.frontmatter.company &&
                          ` at ${node.frontmatter.company}`}
                      </Text>
                    </>
                  }
                />
              );
            })}
        </GridSection>

        <GridSection
          id="experiments"
          header="Experiments"
          bg="gray.0"
          gridSize={3}
        >
          {experiments &&
            experiments.edges.map(({ node }) => {
              return (
                <GridItem
                  key={node.id}
                  url={node.frontmatter.url || node.fields.slug}
                  banner={node.frontmatter.banner}
                  title={node.frontmatter.title}
                  subhead={node.frontmatter.date}
                />
              );
            })}
        </GridSection>

        <GridSection
          id="open-source"
          header="Open Source"
          bg="gray.1"
          gridSize={3}
        >
          {page.frontmatter.open_source &&
            page.frontmatter.open_source.map(item => {
              return (
                <GitHubGridItem
                  key={item.url}
                  url={item.url}
                  github={item.github}
                  title={item.title}
                  subhead={item.description}
                />
              );
            })}
        </GridSection>
      </Flex>
    </Layout>
  );
};

export default IndexPage;

// need regex filter on blog to make sure we do not include README.md near demos
export const query = graphql`
  query {
    page: markdownRemark(frontmatter: { path: { eq: "/" } }) {
      fields {
        slug
      }
      frontmatter {
        open_source {
          url
          title
          description
          github
        }
      }
    }

    blog: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: {
        fileAbsolutePath: { regex: "//blog/(.*)/index.md/" }
        frontmatter: { layout: { ne: "demo" } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            layout
            title
            date(formatString: "MMMM D, YYYY")
            excerpt
            host
            url
            banner {
              childImageSharp {
                fluid(maxWidth: 540, maxHeight: 340, quality: 90) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }

    projects: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fileAbsolutePath: { regex: "//projects/(.*)/index.md/" } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            description
            date(formatString: "YYYY")
            company
            url
            banner {
              childImageSharp {
                fluid(maxWidth: 800, maxHeight: 400, quality: 90) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }

    experiments: allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { fileAbsolutePath: { regex: "//experiments/(.*)/index.md/" } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            description
            date(formatString: "MMMM YYYY")
            url
            banner {
              childImageSharp {
                fluid(maxWidth: 540, maxHeight: 340, quality: 90) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`;
