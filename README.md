# Product & App Manager

A React 16.x application for managing Products and their associated Applications.

## Features

- **Products**: Create, view, and manage products with a 3-step wizard
- **Apps**: View and edit application details, track governance and controls
- **Many-to-Many Relationships**: Link apps to multiple products
- **App Details Management**: Track repos, backlogs, contacts, and documentation
- **Risk & Governance**: Track risk stories, business outcomes, and guild engagements
- **Deployments**: Create releases with attestation workflow

## Tech Stack

- React 16.x
- React Router v5
- React Bootstrap (Bootstrap 4)
- Formik + Yup (form validation)
- MSW (Mock Service Worker) for API mocking
- React Context for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd product-app-manager

# Install dependencies
npm install --legacy-peer-deps
```

### Running the Application

#### Development Mode

```bash
npm start
```

The app will start at [http://localhost:3000](http://localhost:3000).

MSW (Mock Service Worker) will automatically intercept API requests and return mock data - no backend server required.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm run start:mock` | Start development server with MSW mocking enabled |
| `npm test` | Run test suite |

### Generating API Documentation

```bash
npx @redocly/cli build-docs docs/openapi.yaml --output docs/index.html
```

Open `docs/index.html` in a browser to view the API documentation.

## Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Sidebar, PageLayout
│   ├── products/     # Product-related components (AddAppModal)
│   ├── apps/         # App-related components (RepoList, BacklogList, etc.)
│   └── common/       # Shared components (CrudList, StepIndicator, etc.)
├── constants/        # Shared constants (badge colors, labels)
├── context/          # React Context for global state
├── hooks/            # Custom React hooks (useApps, useProducts, usePagination)
├── mocks/
│   ├── data/         # Mock JSON data files
│   └── handlers.js   # MSW request handlers
├── pages/            # Page components
├── services/         # API service layer
└── styles/           # CSS styles
```

## Data Model

See [DATAMODEL.md](DATAMODEL.md) for schema reference and ERD.