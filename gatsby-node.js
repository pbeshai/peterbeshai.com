const fs = require('fs');
const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const readingTime = require('reading-time');

/**
 * Replace {{ page.foo }} with foo from frontmatter on Markdown nodes
 */
function replacePageReferences(node) {
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }

  let body = node.internal.content;
  const { frontmatter } = node;

  const regex = /{{\s*page\.(\w+)\s*}}/;
  let result;
  while ((result = body.match(regex))) {
    const [text, key] = result;
    body = body.replace(new RegExp(text, 'g'), frontmatter[key]);
  }

  node.internal.content = body;
}

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  const { frontmatter } = node;
  if (frontmatter) {
    if (!frontmatter.date) {
      // extract date from filename for blog posts
      if (node.fileAbsolutePath.indexOf('/blog/') !== -1) {
        // e.g. 2016-03-01-react-vega
        const blogDir = path.basename(path.dirname(node.fileAbsolutePath));
        const fileDate = blogDir.substring(0, 10);
        frontmatter.date = fileDate;

        // replace {{ page.foo }} with value from frontmatter
        replacePageReferences(node);
      }
    }
  }

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    // add in reading time
    const textWithoutCode = node.rawMarkdownBody
      .split('```')
      .filter((d, i) => i % 2 === 0)
      .join('\n');
    createNodeField({
      node,
      name: `readingTime`,
      value: readingTime(textWithoutCode),
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  // create pages from blog folder
  return Promise.all([
    createBlogPosts(graphql, createPage),
    createExperiments(graphql, createPage),
  ]);
};

function createBlogPosts(graphql, createPage) {
  return new Promise((resolve, reject) => {
    graphql(`
      {
        blog: allMarkdownRemark(
          filter: { fileAbsolutePath: { regex: "//blog/(.*)/index.md/" } }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                layout
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.blog.edges.forEach(({ node }) => {
        let component = path.resolve(`./src/templates/BlogPost.js`);
        if (node.frontmatter.layout === 'demo') {
          component = path.resolve(`./src/templates/Demo.js`);
        }

        createPage({
          path: node.fields.slug,
          component,
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        });
      });
      resolve();
    });
  });
}

function createExperiments(graphql, createPage) {
  return new Promise((resolve, reject) => {
    graphql(`
      {
        experiments: allMarkdownRemark(
          filter: {
            fileAbsolutePath: { regex: "//experiments/(.*)/index.md/" }
          }
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                url
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.experiments.edges.forEach(({ node }) => {
        // skip external experiments
        if (node.frontmatter.url) {
          return;
        }

        const component = path.resolve(`./src/templates/Demo.js`);

        createPage({
          path: node.fields.slug,
          component,
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        });
      });
      resolve();
    });
  });
}
