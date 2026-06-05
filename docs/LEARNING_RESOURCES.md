# Learning Resources

This workshop uses **React** for the frontend UI and **Material UI (MUI)** for styled components. If you're new to either of these, this guide provides quick links to the most relevant documentation and concepts you'll need.

---

## React Essentials

React is a JavaScript library for building user interfaces. You don't need to be a React expert for this workshop, but understanding these core concepts will help:

### Key Concepts

| Concept | What it is | Why it matters for this workshop |
|---|---|---|
| **Components** | Reusable pieces of UI (like building blocks) | Every page in the CRM is a component (Dashboard, CaseDetail, etc.) |
| **Props** | Data passed from a parent component to a child | Used to pass case data, handlers, and config between components |
| **State** | Data that changes over time within a component | Used for form inputs, loading states, selected filters |
| **Hooks** | Functions that let you use state and other React features | `useState`, `useEffect`, `useNavigate` are used throughout the codebase |
| **Event Handlers** | Functions that respond to user actions | Every button click, form submit, and input change uses these |

### Quick Links

| Resource | What you'll find |
|---|---|
| **[React Quick Start](https://react.dev/learn)** | Official tutorial — covers components, props, state, and events |
| **[Thinking in React](https://react.dev/learn/thinking-in-react)** | How to approach building a React UI from scratch |
| **[useState Hook](https://react.dev/reference/react/useState)** | How to store and update data that changes (form inputs, toggles, etc.) |
| **[useEffect Hook](https://react.dev/reference/react/useEffect)** | How to fetch data when a component loads |
| **[Handling Events](https://react.dev/learn/responding-to-events)** | How to respond to clicks, form submissions, and input changes |

### Common Patterns You'll See

**Fetching data when a page loads:**
```jsx
import { useState, useEffect } from 'react';

function Dashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      const data = await getAllCases();
      setCases(data.cases);
      setLoading(false);
    }
    fetchCases();
  }, []); // Empty array = run once when component mounts

  if (loading) return <div>Loading...</div>;
  return <div>{/* Display cases */}</div>;
}
```

**Handling form input:**
```jsx
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');

  function handleChange(e) {
    setEmail(e.target.value); // Update state as user types
  }

  function handleSubmit(e) {
    e.preventDefault(); // Stop page reload
    // Submit the form data
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Conditional rendering:**
```jsx
function CaseStatus({ status }) {
  if (status === 'closed') {
    return <span style={{ color: 'green' }}>Resolved</span>;
  }
  return <span style={{ color: 'orange' }}>In Progress</span>;
}
```

---

## Material UI (MUI) Essentials

Material UI is a React component library that provides pre-built, styled components following Google's Material Design guidelines. Instead of writing HTML `<div>` and `<button>` elements with custom CSS, you use MUI components like `<Box>` and `<Button>` that are already styled and accessible.

### Why MUI?

- **Pre-styled components** — buttons, cards, tables, dialogs already look professional
- **Responsive by default** — components adapt to different screen sizes
- **Accessibility built-in** — screen readers, keyboard navigation, ARIA labels
- **Theming** — consistent colors, spacing, and typography across the entire app

### Most Common Components in This Project

| Component | What it does | Where you'll see it |
|---|---|---|
| **[Box](https://mui.com/material-ui/react-box/)** | Layout container (like a `<div>` but with MUI styling) | Everywhere — wraps sections, creates spacing |
| **[Button](https://mui.com/material-ui/react-button/)** | Clickable button with variants (contained, outlined, text) | Forms, actions, navigation |
| **[TextField](https://mui.com/material-ui/react-text-field/)** | Text input with label, validation, error states | Login form, case submission, filters |
| **[Paper](https://mui.com/material-ui/react-paper/)** | Card-like container with shadow/elevation | Login box, case detail cards |
| **[Typography](https://mui.com/material-ui/react-typography/)** | Text with consistent styling (headings, body, captions) | Titles, descriptions, labels |
| **[Table](https://mui.com/material-ui/react-table/)** | Data table with rows and columns | Dashboard case list |
| **[Select](https://mui.com/material-ui/react-select/)** | Dropdown menu | Priority picker, status dropdown |
| **[Chip](https://mui.com/material-ui/react-chip/)** | Small badge/tag | Status badges, priority labels |
| **[Dialog](https://mui.com/material-ui/react-dialog/)** | Modal popup window | Confirmations, forms |
| **[Alert](https://mui.com/material-ui/react-alert/)** | Notification message (success, error, warning) | Login errors, success messages |

### The `sx` Prop

MUI components use the `sx` prop for styling — it's a shorthand for inline styles with access to the theme:

```jsx
<Box
  sx={{
    p: 2,              // padding: 2 * 8px = 16px (uses theme spacing)
    mb: 3,             // marginBottom: 3 * 8px = 24px
    bgcolor: 'primary.main',  // background color from theme
    borderRadius: 2,   // rounded corners
  }}
>
  Content here
</Box>
```

Common `sx` properties:

| Property | What it does | Example |
|---|---|---|
| `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr` | Padding (all, x-axis, y-axis, top, bottom, left, right) | `p: 2` (16px all sides) |
| `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr` | Margin (same as padding) | `mb: 3` (24px bottom margin) |
| `bgcolor` | Background color | `bgcolor: 'primary.main'` |
| `color` | Text color | `color: 'text.secondary'` |
| `display` | Display type | `display: 'flex'` |
| `flexDirection` | Flex direction | `flexDirection: 'column'` |
| `gap` | Gap between flex items | `gap: 2` |
| `width`, `height` | Size | `width: '100%'` |
| `borderRadius` | Rounded corners | `borderRadius: 2` |

### Quick Links

| Resource | What you'll find |
|---|---|
| **[MUI Components](https://mui.com/material-ui/all-components/)** | Full list of all available components |
| **[Button Examples](https://mui.com/material-ui/react-button/)** | Different button styles (contained, outlined, text, with icons) |
| **[TextField Examples](https://mui.com/material-ui/react-text-field/)** | Text inputs, validation, error states |
| **[Table Examples](https://mui.com/material-ui/react-table/)** | Data tables, sorting, pagination |
| **[Layout Guide](https://mui.com/material-ui/guides/responsive-ui/)** | How to build responsive layouts with Box, Grid, Stack |
| **[The sx prop](https://mui.com/system/getting-started/the-sx-prop/)** | Complete guide to styling MUI components |

### Example: Building a Simple Card

```jsx
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function CaseCard({ caseData }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {caseData.subject}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {caseData.description}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small">
          View Details
        </Button>
        <Button variant="outlined" size="small">
          Assign
        </Button>
      </Box>
    </Paper>
  );
}
```

---

## Other Technologies Used

### React Router

Used for navigation between pages (e.g. `/submit`, `/advisor/dashboard`, `/advisor/cases/123`).

| Hook | What it does | Example |
|---|---|---|
| **[useNavigate](https://reactrouter.com/en/main/hooks/use-navigate)** | Navigate to a different page programmatically | `navigate('/advisor/dashboard')` |
| **[useParams](https://reactrouter.com/en/main/hooks/use-params)** | Get URL parameters (like the case ID in `/cases/:id`) | `const { id } = useParams()` |

**[React Router Docs](https://reactrouter.com/en/main)**

### JavaScript / ES6 Features

If you're new to modern JavaScript, these features are used heavily:

- **Arrow functions** — `const add = (a, b) => a + b`
- **Destructuring** — `const { name, email } = user`
- **Spread operator** — `const newArray = [...oldArray, newItem]`
- **Async/await** — `const data = await fetch('/api/cases')`
- **Template literals** — `` `Hello ${name}` ``

**[MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)**

---

## Tips for This Workshop

1. **Start by reading existing code** — the Dashboard and CaseDetail components show most of the patterns you'll need
2. **Copy and adapt** — if you need a button, find an existing one and copy its MUI props
3. **Use the MUI docs** — search for a component name (e.g. "MUI Select") to see all available options
4. **Check the browser console** — React errors usually tell you exactly what's wrong and which file to check
5. **Ask your team** — someone else has probably just solved the same problem

---

## Still Stuck?

- Check the [Troubleshooting guide](TROUBLESHOOTING.md)
- Search the error message on [Stack Overflow](https://stackoverflow.com)

---

## Going Deeper (Optional)

If you finish early and want to learn more:

- **[React Dev Tools](https://react.dev/learn/react-developer-tools)** — Browser extension to inspect React component state
- **[MUI Theming](https://mui.com/material-ui/customization/theming/)** — How to customize colors, fonts, spacing
- **[React Forms](https://react.dev/reference/react-dom/components/input)** — Best practices for building forms
- **[JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)** — Understanding async code