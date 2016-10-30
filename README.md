# Peter Beshai

This is a [Jekyll](http://github.com/mojombo/jekyll) powered site and blog.

### Notes

* I use prismjs for highlighting code since at the time, Rouge 2.0 was not used by GitHub pages. This meant that ES6 highlighting was not available. To activate prism, either write `<pre><code class="language-js">...</code></pre>` or add `{: .language-js}` to the end of a code block, e.g. (ignoring the backslashes):

```
\```js
const foo = 'bar';
\```
{: .language-js}
```