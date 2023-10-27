## Notion Github Embed

This is a simple project that lets you embed a GitHub user's contribution chart in a Notion document.

### How to use this?

1. Create a new Embed block in your Notion doc.
2. Set the Embed URL to `https://jandee.vercel.app/%USERNAME%` replacing %USERNAME% with your GitHub username.
3. Adjust the size of the embed accordingly.
4. Bask in its glory!

![glory](https://i.imgur.com/aU95o4N.png)

#### How to change color mode

You can change the color using the `scheme` parameter. Values include `light` and `dark`.

```
https://jandee.vercel.app/%USERNAME%?scheme=dark
```

#### Known caveats

1. ~~Not responsive (looks kinda bad on mobile)~~
2. Notion doesn't expose the user loading the embed's color scheme so cannot dynamically create a dark scheme version of the chart.

#### Credit

@sallar's [github-contributions-chart](https://github.com/sallar/github-contributions-chart) is used to fetch GitHub user contributions. <3
