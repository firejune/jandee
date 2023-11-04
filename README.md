## Notion Github Embed

This is a simple project that lets you embed a GitHub user's contribution chart in a Notion document.

### How to use this?

1. Create a new Embed block in your Notion doc.
2. Set the Embed URL to `https://jandee.vercel.app/%USERNAME%` replacing %USERNAME% with your GitHub username.
3. Adjust the size of the embed accordingly.
4. Bask in its glory!

![glory](https://i.imgur.com/aU95o4N.png)

#### How to change color mode

You can change the color using the `scheme` parameter. Values include `light` and `dark`. If the parameter is not used, it is automatically selected by the system.

```
https://jandee.vercel.app/%USERNAME%?scheme=dark
```

#### Drawing using canvas

Basically, charts are created using SVG. You can use Canvas as an alternative. The difference from the SVG version is that it shows the total count and not the day of the week.

```
https://jandee.vercel.app/%USERNAME%/canvas
```

#### Credit

This project was inspired by the following project::

@bizarre's [notion-github-embed](https://github.com/bizarre/notion-github-embed) is easy embed GitHub contribution chart into any Notion document.

@sallar's [github-contributions-chart](https://github.com/sallar/github-contributions-chart) is used to fetch GitHub user contributions. <3

@sallar's [github-contributions-canvas](https://github.com/sallar/github-contributions-canvas) is drawing a heat-map of Github contributions on HTML Canvas
