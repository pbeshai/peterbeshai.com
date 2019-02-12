module.exports = {
  siteMetadata: {
    title: 'Peter Beshai',
    author: 'Peter Beshai',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    `gatsby-plugin-catch-links`,
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
              linkImagesToOriginal: false,
              sizeByPixelDensity: true,
              quality: 80,
              backgroundColor: '#fff',
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {},
          },
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Peter Beshai',
        short_name: 'pbesh',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {},
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-55938435-1`,
      },
    },
    // {
    //   resolve: `gatsby-source-github-api`,
    //   options: {
    //     token: process.env.GITHUB_TOKEN,
    //     graphQLQuery: `
    //     {
    //       user(login: "antonmedv") {
    //         pinnedRepositories(first: 6) {
    //           nodes {
    //             name
    //             description
    //             url
    //             stargazers {
    //               totalCount
    //             }
    //             languages(first: 1) {
    //               nodes {
    //                 name
    //                 color
    //               }
    //             }
    //             isArchived
    //           }
    //         }
    //         repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false, affiliations: OWNER) {
    //           nodes {
    //             name
    //             description
    //             url
    //             stargazers {
    //               totalCount
    //             }
    //             languages(first: 1) {
    //               nodes {
    //                 name
    //                 color
    //               }
    //             }
    //             isArchived
    //           }
    //         }
    //       }
    //     }
    //     `,
    //   }
    // },
  ],
};
