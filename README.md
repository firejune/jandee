## Jandee

Jandee is a simple project that lets you embed a GitHub user's contribution calendar into any document.

### How to use This in Notion?

1. Create a new Embed block in your any document.
2. Set the Embed URL to `https://jandee.vercel.app/%USERNAME%` replacing `%USERNAME%` with your GitHub username.
3. Adjust the size of the embed accordingly.
4. Bask in its glory!

![glory](https://i.imgur.com/aU95o4N.png)

### How to change color mode

You can change the color using the `scheme` parameter. Values include `light` and `dark`. If the parameter is not used, it is automatically selected by the system.

```
https://jandee.vercel.app/%USERNAME%?scheme=dark
```

### Can I change the Time Zone?

Yes, You can set the specific Time Zone. If the Time Zone is not set, it operates as UTC+0.

```
https://jandee.vercel.app/%USERNAME%?tz=America/New_York
```

### How to customize chart style?

You can change the style of your graph. Supported properties include:

- `radius` - Adjusts the border-radius value of the rectangular elements of the graph. default = 2
- `margin` - Adjusts the margin value between the rectangular elements of the graph. default = 3
- `footer` - You can hide the meta information shown at the bottom of the graph. default = false
- `weeks` - You can hide the day information on the left side of the graph. default = false

```
https://jandee.vercel.app/%USERNAME%?radius=3&margin=2&footer=false&weeks=false
```

### How to export to PNG image

You can use Canvas with Embed method as an alternative. This Canvas can be saved as PNG images with transparency. However, depending on the system, the font shape or size may vary slightly.

```
https://jandee.vercel.app/%USERNAME%/canvas
```

### Credit

This project was inspired by the following project::

@bizarre's [notion-github-embed](https://github.com/bizarre/notion-github-embed) is easy embed GitHub contribution chart into any Notion document.

@sallar's [github-contributions-chart](https://github.com/sallar/github-contributions-chart) is used to fetch GitHub user contributions. <3

@sallar's [github-contributions-canvas](https://github.com/sallar/github-contributions-canvas) is drawing a heat-map of Github contributions on HTML Canvas
