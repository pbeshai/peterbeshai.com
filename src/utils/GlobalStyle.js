import { createGlobalStyle } from 'styled-components';
import { theme } from './style';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #___gatsby {
    background-color: #fff;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    color: #000;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: ${theme.fonts.body};
    line-height: 1.7;
    font-size: ${theme.fontSizes[2]}px;
  }
  * {
    box-sizing: border-box;
  }
  #___gatsby > div {
    height: 100%;
  }
  img.full-width-image {
    width: 100%;
  }
  a {
    color: #495057;
  }
`;

export default GlobalStyle;
