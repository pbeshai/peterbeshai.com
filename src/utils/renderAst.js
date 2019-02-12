import React from 'react';
import rehypeReact from 'rehype-react';

import { Image, Link, Header, Text, List, ListItem } from '../components/core';

const H2 = props => (
  <Header textStyle="contentHeader" mt={5} mb={3} fontSize={4} {...props} />
);
const H3 = props => (
  <Header textStyle="contentHeader" mt={5} mb={3} fontSize={3} {...props} />
);
const H4 = props => (
  <Header textStyle="contentHeader" mt={5} mb={3} fontSize={2} {...props} />
);
const P = props => <Text mt={3} mb={4} {...props} />;

const Ul = props => <List mt={0} mb={4} {...props} />;
const Ol = props => <List mt={0} mb={4} as="ol" {...props} />;
const Li = props => <ListItem mb={3} {...props} />;
const Img = props => <Image display="block" as="img" mx="auto" {...props} />;

export const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
    a: Link,
    h2: H2,
    h3: H3,
    h4: H4,
    p: P,
    ul: Ul,
    li: Li,
    ol: Ol,
    img: Img,
  },
}).Compiler;

export default renderAst;
