# Frontend Saturnalia

A React application built with Vite, TypeScript, featuring Material-UI components for a modern UI.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

## Installation

1. Create a new Vite React TypeScript project:

   ```bash
   npm create vite@latest frontend-saturnalia -- --template react-ts
   cd frontend-saturnalia
   ```

2. Install the base dependencies:

   ```bash
   npm install
   ```

3. Install additional dependencies:

   ```bash
   npm install @emotion/react @emotion/styled @mui/material @mui/icons-material axios lucide-react react-hook-form
   ```

4. Set up environment variables:

   Create a `.env` file in the root directory with the following content:

   ```
   VITE_API_BASE_URL=http://localhost:3000/api/
   ENVIRONMENT=development
   DEBUG=true
   VITE_PINTEREST_API_KEY=your_pinterest_api_key_here
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Build

To build the project for production:

```bash
npm run build
```

## Preview

To preview the production build:

```bash
npm run preview
```

## Linting

To run ESLint:

```bash
npm run lint
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Material-UI
- Axios
- React Hook Form
- Lucide React
