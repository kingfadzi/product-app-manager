# Product & App Manager

A React 16.x MVP for managing Products and their associated Apps.

## Features

- **Products**: Create, view, and manage products
- **Apps**: View and edit application details
- **Many-to-Many Relationships**: Link apps to multiple products
- **App Details Management**: Track repos, backlogs, contacts, and documentation for each app
- **3-Step Product Creation Wizard**: Streamlined product creation flow

## Tech Stack

- React 16.x
- React Router v5
- React Bootstrap (Bootstrap 4)
- Formik + Yup (form validation)
- MSW (Mock Service Worker) for API mocking
- React Context for state management

## Getting Started

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm start
```

The app will start at [http://localhost:3000](http://localhost:3000).

MSW will automatically intercept API requests and return mock data.

## Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Sidebar, PageLayout
│   ├── products/     # Product-related components
│   ├── apps/         # App-related components
│   ├── wizard/       # Multi-step wizard components
│   └── common/       # Shared components
├── context/          # React Context for global state
├── hooks/            # Custom React hooks
├── mocks/            # MSW handlers and mock data
├── pages/            # Page components
└── services/         # API service layer
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage with search and metrics |
| `/stacks` | Stacks dashboard |
| `/products` | Product list |
| `/products/new` | Create product wizard |
| `/products/:id` | Product detail |
| `/apps` | All apps list |
| `/apps/:id` | App profile |
| `/apps/:id/edit` | Edit app |

## Data Model

- **Product**: Contains name, description, and creation date
- **App**: Application with CMDB ID, tier (gold/silver/bronze), status
- **ProductApp**: Join table linking products and apps
- **AppRepo**: Git repositories linked to an app
- **AppBacklog**: Project backlogs (Jira/etc.)
- **AppContact**: Key contacts (product owner, tech lead, etc.)
- **AppDoc**: Documentation links (roadmap, architecture, runbook)
