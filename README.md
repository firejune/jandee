## Notion Github Embed

This is a simple project that lets you embed a GitHub user's contribution chart in a Notion document.

### How to use this?

1. Create a new Embed block in your Notion doc.
2. Set the Embed URL to `https://jandee.vercel.app/%USERNAME%` replacing `%USERNAME%` with your GitHub username.
3. Adjust the size of the embed accordingly.
4. Bask in its glory!

![glory](https://i.imgur.com/aU95o4N.png)

#### How to change color mode

You can change the color using the `scheme` parameter. Values include `light` and `dark`. If the parameter is not used, it is automatically selected by the system.

```
https://jandee.vercel.app/%USERNAME%?scheme=dark
```

#### How to change time zone

You can set the timezone.

```
https://jandee.vercel.app/%USERNAME%?tz=America/New_York
```

#### How to change style

You can change the style of your graph. Supported properties include:

- `redias` - Adjusts the border-redius value of the rectangular elements of the graph. default = 2
- `margin` - Adjusts the margin value between the rectangular elements of the graph. default = 3
- `footer` - You can hide the meta information shown at the bottom of the graph. default = false
- `weeks` - You can hide the day information on the left side of the graph. default = false

```
https://jandee.vercel.app/%USERNAME%?redias=3&margin=2&footer=false&weeks=false
```

#### How to export to PNG image

Basically, charts are created using SVG image. You can use PNG as an alternative. However, PNG images may have slightly different fonts.

```
https://jandee.vercel.app/%USERNAME%/canvas
```

#### Credit

This project was inspired by the following project::

@bizarre's [notion-github-embed](https://github.com/bizarre/notion-github-embed) is easy embed GitHub contribution chart into any Notion document.

@sallar's [github-contributions-chart](https://github.com/sallar/github-contributions-chart) is used to fetch GitHub user contributions. <3

@sallar's [github-contributions-canvas](https://github.com/sallar/github-contributions-canvas) is drawing a heat-map of Github contributions on HTML Canvas
