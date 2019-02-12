import React from 'react';
import { graphql } from 'gatsby';

import {
  Box,
  Text,
  Link,
  Header,
  InlineList,
  InlineListItem,
} from '../components/core';

const Footer = () => {
  return (
    <Box px={3} py={5} mx="auto">
      <Text textAlign={'center'}>
        <InlineList>
          <InlineListItem>
            <Link to="mailto:peter.beshai@gmail.com">
              peter.beshai@gmail.com
            </Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="https://twitter.com/pbesh">Twitter</Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="https://www.linkedin.com/in/pbeshai">LinkedIn</Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="https://github.com/pbeshai">GitHub</Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="https://instagram.com/pbeshasketch">Instagram</Link>
          </InlineListItem>
        </InlineList>
      </Text>
    </Box>
  );
};

export default Footer;
