# Data Model

Schema reference.

## ERD

```mermaid
erDiagram
    TransactionCycle ||--o{ Product : has
    TransactionCycle ||--o{ App : has
    Stack ||--o{ Product : has
    Stack ||--o{ App : has
    Product ||--o{ ProductApp : contains
    App ||--o{ ProductApp : belongs_to
    App ||--o{ Repo : has
    App ||--o{ Backlog : has
    App ||--o{ Contact : has
    App ||--o{ Doc : has
    App ||--o{ GuildSme : has
    App ||--o{ RiskStory : has
    App ||--o{ BusinessOutcome : has
    App ||--o{ ServiceInstance : has

    TransactionCycle {
        string id PK
        string name
    }
    Stack {
        string id PK
        string name
    }
    Guild {
        string id PK
        string name
        string color
    }
    Product {
        string id PK
        string tc FK
        string stack FK
        string name
    }
    App {
        string id PK
        string tc FK
        string stack FK
        string productId FK
        string cmdbId
        string name
        string resCat
        string tier
    }
    ProductApp {
        string productId FK
        string appId FK
        date addedAt
    }
    Repo {
        string id PK
        string appId FK
        string repoPath
        string role
        bool isPrimary
    }
    Backlog {
        string id PK
        string appId FK
        string projectKey
        string purpose
        bool isPrimary
    }
    Contact {
        string id PK
        string appId FK
        string name
        string email
        string role
    }
    Doc {
        string id PK
        string appId FK
        string title
        string url
        string type
    }
    GuildSme {
        string id PK
        string appId FK
        string name
        string email
        string role
    }
    RiskStory {
        string id PK
        string appId FK
        string summary
        string status
    }
    BusinessOutcome {
        string id PK
        string appId FK
        string summary
        string status
        string fixRelease
    }
    ServiceInstance {
        string siId PK
        string appId FK
        string name
        string environment
        string status
    }
```

## Entities

| Entity | Description | Key Fields |
|--------|-------------|------------|
| `TransactionCycle` | Business domain grouping | `id`, `name` |
| `Stack` | Technology capability grouping | `id`, `name` |
| `Guild` | Governance domain (reference) | `id`, `name`, `color` |
| `Product` | Logical grouping of apps | `id`, `name`, `tc`, `stack` |
| `App` | Application in CMDB | `id`, `cmdbId`, `name`, `resCat`, `tier`, `tc`, `stack` |
| `ProductApp` | Product-App join table | `productId`, `appId`, `addedAt` |
| `Repo` | Git repository | `id`, `appId`, `repoPath`, `role`, `isPrimary` |
| `Backlog` | Jira project | `id`, `appId`, `projectKey`, `purpose`, `isPrimary` |
| `Contact` | App stakeholder | `id`, `appId`, `name`, `email`, `role` |
| `Doc` | Documentation link | `id`, `appId`, `title`, `url`, `type` |
| `GuildSme` | Guild subject matter expert | `id`, `appId`, `name`, `email`, `role` |
| `RiskStory` | Risk/security item | `id`, `appId`, `summary`, `status` |
| `BusinessOutcome` | Business objective | `id`, `appId`, `summary`, `status`, `fixRelease` |
| `ServiceInstance` | Deployment instance | `siId`, `appId`, `name`, `environment`, `status` |

## Enums

| Field | Values |
|-------|--------|
| `resCat` | `Critical` \| `High` \| `Medium` \| `Low` \| `Not_Significant` |
| `tier` | `Business Application` \| `Application Component` |
| `operationalStatus` | `Ceased` \| `Used in Production` |
| `Backlog.purpose` | `product` \| `ops` \| `security` |
| `Contact.role` | `product_owner` \| `tech_lead` \| `scrum_master` \| `support_lead` |
| `GuildSme.role` | `security` \| `data` \| `operations` \| `enterprise_architecture` |
| `Doc.type` | `Product Roadmap` \| `Architecture Vision` \| `runbook` \| `Service Vision` \| `Security Vision` \| `Test Strategy` |
| `RiskStory.status` | `Open` \| `In Progress` \| `Resolved` \| `Waived` |
| `BusinessOutcome.status` | `On Track` \| `At Risk` \| `Completed` \| `In Progress` \| `Engaged` |
| `ServiceInstance.environment` | `Prod` \| `DR` |
| `ServiceInstance.status` | `Operational` \| `Standby` \| `Maintenance` |

## Notes

> **Important:** Apps in a Product must be from the same SNOW family hierarchy (parent-child or siblings only).

- `ProductApp` is a many-to-many join: an App can belong to multiple Products
- `App.cmdbId` is the external CMDB identifier (e.g., `APP-1234`)
- `App.parent` references another App's cmdbId for hierarchy
- `Contact` and `GuildSme` share the same backend table (`stakeholders`) differentiated by `stakeholder_type`
- `Backlog.projectKey` maps to Jira project key
- `BusinessOutcome.portfolioEpv` and `navigatorId` are external system references
