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

const Nav = ({ showTitle, hideHome }) => {
  return (
    <Box p={3} mx="auto" maxWidth={800}>
      <Text textAlign={'center'}>
        {showTitle && <Header>Peter Beshai</Header>}
        <InlineList>
          {!hideHome && (
            <InlineListItem>
              <Link to="/" activeClassName="active">
                Home
              </Link>
            </InlineListItem>
          )}
          <InlineListItem>
            <Link to="/#writing" activeClassName="active">
              Writing
            </Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="/#projects" activeClassName="active">
              Projects
            </Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="/#experiments" activeClassName="active">
              Experiments
            </Link>
          </InlineListItem>
          <InlineListItem>
            <Link to="/#open-source" activeClassName="active">
              Open Source
            </Link>
          </InlineListItem>
        </InlineList>
      </Text>
    </Box>
  );
};

export default Nav;
