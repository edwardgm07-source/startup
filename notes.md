# CS 260 Notes

This file represents what I have learned about web programming.
- Git tracks file versions locally, while GitHub stores and shares repositories online.

**I love web programming**

- [My startup](https://startup.edwardgm260.click)
- [My Simon](https://simon.edwardgm260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

- AWS EC2 provides a virtual server where I can deploy my website.
- A domain and subdomains can point users to applications hosted on the server.
- The deployment script copies my website files to the server using SSH.

## HTML

- Semantic elements such as `header`, `nav`, `main`, `section`, and `footer` organize a webpage.
- The `a` element creates links between pages.
- Forms use elements such as `form`, `label`, `input`, and `button`.
- Tables use `table`, `thead`, `tbody`, `tr`, `th`, and `td`.
- The `img` element displays images, and its `alt` attribute describes the image.
- HTML provides the structure of an application before CSS and JavaScript are added.

## CSS

- CSS controls the visual appearance and layout of a webpage.
- The cascade determines which style is applied when multiple rules affect the same element.
- Element, class, ID, and pseudo-class selectors target different parts of a webpage.
- CSS variables make it easier to reuse colors and other design values.
- Flexbox is useful for arranging items in rows or columns.
- CSS Grid is useful for creating layouts with multiple rows and columns.
- Media queries allow a website to adjust to different screen sizes.
- The box model includes content, padding, border, and margin.
- Bootstrap provides reusable components and utility classes.
- Responsive design helps prevent elements from overflowing on smaller screens.

## React

- React applications are built from reusable components.
- JSX allows HTML-like markup to be written inside JavaScript.
- React Router displays different components based on the current URL.
- `BrowserRouter`, `Routes`, and `Route` define application navigation.
- `NavLink` creates navigation links and identifies the active route.
- The `useState` hook stores values that can change while the application runs.
- Vite provides a development server and creates the production build.
- Files placed in the `public` directory can be referenced from the root URL.
- A React application uses one `index.html` file while the router displays different views.

## React Part 2

- `useState` stores values that change while the application is running.
- `useEffect` runs code after a component renders and can simulate asynchronous services.
- An effect should return a cleanup function when it creates a timer or subscription.
- `useRef` can preserve a value between renders without causing another render.
- `localStorage` can save user sessions, statistics, and match history in the browser.
- Mock data can represent future database, WebSocket, and third-party service functionality.
- React props allow components to share user information and event handlers.