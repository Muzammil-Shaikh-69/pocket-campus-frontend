## Frontend (React + Vite + TailwindCSS)

### Prerequisites
- Node.js 18+

### Environment variables (`.env`)
Create `frontend/.env` with:
```
VITE_API_URL=http://localhost:5001
```

### Install & run
```bash
cd frontend
npm install
npm run dev
```

Vite will print a local URL, typically `http://localhost:5173`.

### Project structure
```
src/
  components/
    Navbar.jsx
    TaskForm.jsx
    TaskList.jsx
    Charts.jsx
  pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    Tasks.jsx
    Reports.jsx
  lib/
    api.js   # axios instance with bearer token
    auth.js  # token helpers
  App.jsx
  main.jsx
  index.css  # Tailwind entry
```

### Styling
- Tailwind v3 is configured via `postcss.config.js` and `tailwind.config.js`
- The design includes gradient headers, cards, badges, and charts

### Routing & Auth
- React Router protects private routes via a simple `<PrivateRoute>` wrapper in `App.jsx`
- JWT is stored in `localStorage` (`lib/auth.js`), added to requests via an axios interceptor (`lib/api.js`)

### Reports
- Uses `chart.js` and `react-chartjs-2` to render a doughnut chart of completed vs pending tasks

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
