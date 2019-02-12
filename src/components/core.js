/**
 * Initially from rebass
 * https://github.com/rebassjs/rebass/blob/master/src/index.js
 */
import React from 'react';
import styled, { css } from 'styled-components';
import Img from 'gatsby-image';
import { Link as GatsbyLink } from 'gatsby';

import {
  space,
  display,
  color,
  width,
  height,
  flex,
  order,
  alignSelf,
  justifySelf,
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  fontSize,
  fontFamily,
  fontWeight,
  textAlign,
  textStyle,
  lineHeight,
  letterSpacing,
  borders,
  borderColor,
  borderRadius,
  buttonStyle,
  boxShadow,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  opacity,
  variant,
  minHeight,
  maxWidth,
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea,
  style,
} from 'styled-system';

const themed = key => props => props.theme[key];

export const Box = styled('div')(
  space,
  display,
  width,
  fontSize,
  fontFamily,
  color,
  flex,
  order,
  alignSelf,
  justifySelf,
  minHeight,
  maxWidth,
  gridColumn,
  gridRow,
  gridArea,
  themed('Box')
);

Box.propTypes = {
  ...space.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes,
  ...color.propTypes,
  ...flex.propTypes,
  ...order.propTypes,
  ...alignSelf.propTypes,
  ...gridColumn.propTypes,
  ...gridRow.propTypes,
  ...gridArea.propTypes,
};

export const Flex = styled(Box)(
  {
    display: 'flex',
  },
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  themed('Flex')
);

Flex.propTypes = {
  ...flexWrap.propTypes,
  ...flexDirection.propTypes,
  ...alignItems.propTypes,
  ...justifyContent.propTypes,
};

export const Text = styled(Box)(
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
  textStyle,
  themed('Text')
);

Text.propTypes = {
  ...fontFamily.propTypes,
  ...fontWeight.propTypes,
  ...textAlign.propTypes,
  ...lineHeight.propTypes,
  ...letterSpacing.propTypes,
  ...textStyle.propTypes,
};

export const Header = styled(Text)(themed('Header'));

Header.defaultProps = {
  as: 'h2',
  m: 0,
  fontSize: 3,
  fontWeight: 'bold',
  fontFamily: 'header',
  textStyle: 'caps',
};

export const StyledLink = styled(Text)(
  themed('Link'),
  css`
    color: ${props => props.theme.colors.gray[7]};
    border-bottom: 2px solid ${props => props.theme.colors.gray[2]};
    text-decoration: none;
    background: transparent;
    transition: 0.2s background linear, 0.2s border-color linear;

    &:hover {
      color: ${props => props.theme.colors.gray[8]};
      background: ${props => props.theme.colors.cyan[0]};
      border-color: ${props => props.theme.colors.cyan[2]};
    }
  `
);

StyledLink.defaultProps = {
  as: 'a',
};

// Since DOM elements <a> cannot receive activeClassName,
// destructure the prop here and pass it only to GatsbyLink
export const Link = ({ children, to, activeClassName, ...other }) => {
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to);

  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <StyledLink
        as={GatsbyLink}
        to={to}
        activeClassName={activeClassName}
        {...other}
      >
        {children}
      </StyledLink>
    );
  }
  return (
    <StyledLink href={to} {...other}>
      {children}
    </StyledLink>
  );
};

export const Button = styled(Box)(
  {
    appearance: 'none',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: 'inherit',
    textDecoration: 'none',
  },
  fontWeight,
  borders,
  borderColor,
  borderRadius,
  buttonStyle,
  themed('Button')
);

Button.propTypes = {
  ...fontWeight.propTypes,
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...borderRadius.propTypes,
  ...buttonStyle.propTypes,
};

Button.defaultProps = {
  as: 'button',
  fontSize: 'inherit',
  fontWeight: 'bold',
  m: 0,
  px: 3,
  py: 2,
  color: 'white',
  bg: 'blue',
  border: 0,
  borderRadius: 4,
};

export const Image = styled(Box)(
  {
    maxWidth: '100%',
    height: 'auto',
  },
  height,
  borderRadius,
  themed('Image')
);

Image.propTypes = {
  ...height.propTypes,
  ...borderRadius.propTypes,
};

Image.defaultProps = {
  as: Img,
  m: 0,
};

const cards = variant({ key: 'cards' });

export const Card = styled(Box)(
  borders,
  borderColor,
  borderRadius,
  boxShadow,
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  opacity,
  cards,
  themed('Card')
);

Card.propTypes = {
  ...borders.propTypes,
  ...borderColor.propTypes,
  ...borderRadius.propTypes,
  ...boxShadow.propTypes,
  ...backgroundImage.propTypes,
  ...backgroundSize.propTypes,
  ...backgroundPosition.propTypes,
  ...backgroundRepeat.propTypes,
  ...opacity.propTypes,
  ...cards.propTypes,
};

const gridTemplateColumnsFill = style({
  // React prop name
  prop: 'gridTemplateColumnsFill',
  // The corresponding CSS property (defaults to prop argument)
  cssProperty: 'gridTemplateColumns',
  // key for theme values
  key: 'gridColumnSizes',
  // accessor function for transforming the value
  transformValue: n =>
    `repeat(auto-fill, minmax(${Number.isNaN(n) ? n : `${n}px`}, 1fr))`,
  // add a fallback scale object or array, if theme is not present
  scale: [0, 120, 180, 240, 300, 360, 420, 480, 540, 600],
});

export const Grid = styled(Box)(
  {
    display: 'grid',
  },
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridTemplateColumnsFill,
  themed('Grid')
);

Grid.defaultProps = {
  gridGap: 3,
};

Grid.propTypes = {
  ...gridGap.propTypes,
  ...gridColumnGap.propTypes,
  ...gridRowGap.propTypes,
  ...gridAutoFlow.propTypes,
  ...gridAutoColumns.propTypes,
  ...gridAutoRows.propTypes,
  ...gridTemplateColumns.propTypes,
  ...gridTemplateRows.propTypes,
  ...gridTemplateAreas.propTypes,
};

export const List = styled(Box)`
  list-style-type: ${props => props.listStyleType};
`;
List.defaultProps = {
  as: 'ul',
};

export const ListItem = props => <Box as="li" {...props} />;

export const InlineList = styled(List)`
  list-style-type: none;
  padding-left: 0;
`;

export const InlineListItem = styled(Text)`
  display: inline-block;
  &:last-child {
    margin-right: 0;
  }
  &::before {
    content: '•';
    color: ${props => props.theme.colors.gray[3]};
    margin-right: ${props => props.theme.space[props.mr]}px;
  }
  &:first-child::before {
    content: '';
    margin-right: 0;
  }
`;

InlineListItem.defaultProps = {
  as: 'li',
  mr: 3,
};
