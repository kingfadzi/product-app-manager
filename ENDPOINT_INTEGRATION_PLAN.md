# Lean Control + Lean-Web Endpoint Integration Plan

## Overview
This plan maps the React frontend (Lean Control) API calls to the Django backend (lean-web) endpoints, identifies gaps, and proposes changes that won't break the existing Django template frontend.

---

## 1. Endpoint Mapping

### Legend
- **Match** = Endpoint exists in lean-web (may need minor adjustments)
- **Partial** = Similar endpoint exists but needs modification
- **Gap** = No equivalent endpoint in lean-web

### Applications & Search

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 1 | `/api/apps` | GET | None | **Gap** |
| 2 | `/api/apps` | POST | None | **Gap** |
| 3 | `/api/apps/{id}` | GET | `/application/<app_id>/profile/` (HTML) | **Partial** |
| 4 | `/api/apps/{id}` | PUT | None | **Gap** |
| 5 | `/api/cmdb/search` | GET | `/api/search/applications/?q=` | **Match** |
| 6 | `/api/apps/{id}/service-instances` | GET | `/api/release/<app_id>/service-instances/` | **Match** |
| 7 | `/api/apps/{id}/available-repos` | GET | None | **Gap** |
| 8 | `/api/apps/{id}/available-jira` | GET | `/api/jira/projects/<app_id>/` | **Match** |

### Products

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 9 | `/api/products` | GET | `/portfolio/products/` (HTML) | **Partial** |
| 10 | `/api/products` | POST | None | **Gap** |
| 11 | `/api/products/{id}` | GET | `/portfolio/products/<id>/` (HTML) | **Partial** |
| 12 | `/api/products/{id}` | PUT | None | **Gap** |
| 13 | `/api/products/{id}` | DELETE | None | **Gap** |
| 14 | `/api/products/{id}/apps` | GET | None | **Gap** |
| 15 | `/api/products/{id}/apps/{appId}` | POST | None | **Gap** |
| 16 | `/api/products/{id}/apps/{appId}` | DELETE | None | **Gap** |

### Repositories

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 17 | `/api/apps/{id}/repos` | GET | None | **Gap** |
| 18 | `/api/apps/{id}/repos` | POST | None | **Gap** |
| 19 | `/api/repos/{id}` | PUT | None | **Gap** |
| 20 | `/api/repos/{id}` | DELETE | None | **Gap** |

### Backlogs (Jira Projects)

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 21 | `/api/apps/{id}/backlogs` | GET | `/api/jira/projects/<app_id>/` | **Match** |
| 22 | `/api/apps/{id}/backlogs` | POST | None | **Gap** |
| 23 | `/api/backlogs/{id}` | PUT | None | **Gap** |
| 24 | `/api/backlogs/{id}` | DELETE | None | **Gap** |
| 25 | `/api/backlogs/{key}/fix-versions` | GET | `/api/jira/project-versions/<key>/` | **Match** |

### Contacts/Stakeholders

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 26 | `/api/apps/{id}/contacts` | GET | `/api/app/<app_id>/stakeholders/` | **Match** |
| 27 | `/api/apps/{id}/contacts` | POST | `/api/app/<app_id>/stakeholders/` | **Match** |
| 28 | `/api/contacts/{id}` | PUT | `/api/app/<app_id>/stakeholders/<id>/` | **Match** |
| 29 | `/api/contacts/{id}` | DELETE | `/api/app/<app_id>/stakeholders/<id>/` | **Match** |

### Documentation

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 30 | `/api/apps/{id}/docs` | GET | None | **Gap** |
| 31 | `/api/apps/{id}/docs` | POST | None | **Gap** |
| 32 | `/api/docs/{id}` | PUT | None | **Gap** |
| 33 | `/api/docs/{id}` | DELETE | None | **Gap** |

### Risk Stories

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 34 | `/api/apps/{id}/risk-stories` | GET | `/api/work-items/<app_id>/` | **Partial** |
| 35 | `/api/apps/{id}/risk-stories` | POST | `/api/work-items/<app_id>/create/` | **Match** |
| 36 | `/api/risk-stories/{id}` | PUT | None | **Gap** |

### Business Outcomes

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 37 | `/api/apps/{id}/outcomes` | GET | `/api/jira/version-bos/<key>/<ver>/` | **Partial** |
| 38 | `/api/outcomes/{id}/engagement` | GET | None | **Gap** |
| 39 | `/api/outcomes/{id}/engagement` | PUT | None | **Gap** |

### Guilds & Deployments

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 40 | `/api/guilds` | GET | `/api/controls/<app_id>/<guild>/<status>/` | **Partial** |
| 41 | `/api/apps/{id}/guild-assignments` | GET | None | **Gap** |
| 42 | `/api/deployment-environments` | GET | `/api/release/<app_id>/service-instances/` | **Partial** |
| 43 | `/api/deployments` | POST | `/api/release/<release_id>/deploy/` | **Partial** |

### Reference Data

| # | Lean Control Endpoint | Method | Lean-Web Equivalent | Status |
|---|----------------------|--------|---------------------|--------|
| 44 | `/api/lines-of-business` | GET | None | **Gap** |

---

## 2. Gap Analysis Summary

### Fully Matched (9 endpoints)
These work as-is or need only URL remapping in Lean Control:
- CMDB Search
- Service Instances
- Available Jira Projects
- Jira Project Versions
- Stakeholders CRUD (4 endpoints)
- Create Work Item/Story

### Partial Match - Need JSON API (6 endpoints)
These exist as HTML views but need JSON API equivalents:
- App Profile (GET single app)
- Products list
- Product detail
- Work Items (different response format)
- Business Outcomes (need aggregation)
- Deployment environments

### Gaps - New Endpoints Required (29 endpoints)

#### Priority 1: Core App Management
| Endpoint | Purpose |
|----------|---------|
| `GET /api/apps` | List all apps with filtering |
| `POST /api/apps` | Create new app |
| `GET /api/apps/{id}` | Get app details as JSON |
| `PUT /api/apps/{id}` | Update app |

#### Priority 2: Product Management
| Endpoint | Purpose |
|----------|---------|
| `GET /api/products` | List products as JSON |
| `POST /api/products` | Create product |
| `GET /api/products/{id}` | Get product as JSON |
| `PUT /api/products/{id}` | Update product |
| `DELETE /api/products/{id}` | Delete product |
| `GET /api/products/{id}/apps` | Get apps in product |
| `POST /api/products/{id}/apps/{appId}` | Add app to product |
| `DELETE /api/products/{id}/apps/{appId}` | Remove app from product |

#### Priority 3: Repository Management
| Endpoint | Purpose |
|----------|---------|
| `GET /api/apps/{id}/repos` | List repos for app |
| `POST /api/apps/{id}/repos` | Add repo to app |
| `PUT /api/repos/{id}` | Update repo |
| `DELETE /api/repos/{id}` | Delete repo |
| `GET /api/apps/{id}/available-repos` | Search available repos (GitLab/GitHub) |

#### Priority 4: Documentation Management
| Endpoint | Purpose |
|----------|---------|
| `GET /api/apps/{id}/docs` | List docs for app |
| `POST /api/apps/{id}/docs` | Add doc link |
| `PUT /api/docs/{id}` | Update doc |
| `DELETE /api/docs/{id}` | Delete doc |

#### Priority 5: Guild Engagement
| Endpoint | Purpose |
|----------|---------|
| `GET /api/guilds` | List all guilds |
| `GET /api/apps/{id}/guild-assignments` | Get guild assignments for app |
| `GET /api/outcomes/{id}/engagement` | Get engagement data |
| `PUT /api/outcomes/{id}/engagement` | Update engagement |

#### Priority 6: Reference Data
| Endpoint | Purpose |
|----------|---------|
| `GET /api/lines-of-business` | List lines of business |

---

## 3. Proposed Changes to Lean-Web

### Principle: Non-Breaking Changes
All changes will be **additive only**:
- New API endpoints under `/api/v2/` namespace
- Existing HTML views remain untouched
- Existing `/api/` endpoints remain unchanged
- New models extend existing ones without migrations that alter existing columns

### Phase 1: URL Remapping in Lean Control (No backend changes)

Update Lean Control to use existing lean-web endpoints:

```javascript
// src/services/api.js changes
const ENDPOINT_MAP = {
  // Search
  'cmdb/search': '/api/search/applications/',

  // Service Instances
  'apps/{id}/service-instances': '/api/release/{id}/service-instances/',

  // Jira/Backlogs
  'apps/{id}/backlogs': '/api/jira/projects/{id}/',
  'backlogs/{key}/fix-versions': '/api/jira/project-versions/{key}/',
  'apps/{id}/available-jira': '/api/jira/projects/{id}/',

  // Stakeholders/Contacts
  'apps/{id}/contacts': '/api/app/{id}/stakeholders/',
  'contacts/{id}': '/api/app/{appId}/stakeholders/{id}/',

  // Work Items
  'apps/{id}/risk-stories': '/api/work-items/{id}/',
};
```

### Phase 2: New Django API Endpoints

#### File: `services/api/urls.py` (new)
```python
from django.urls import path
from . import views

urlpatterns = [
    # Apps
    path('v2/apps/', views.AppListCreateView.as_view()),
    path('v2/apps/<str:app_id>/', views.AppDetailView.as_view()),

    # Products
    path('v2/products/', views.ProductListCreateView.as_view()),
    path('v2/products/<int:pk>/', views.ProductDetailView.as_view()),
    path('v2/products/<int:pk>/apps/', views.ProductAppsView.as_view()),
    path('v2/products/<int:pk>/apps/<str:app_id>/', views.ProductAppDetailView.as_view()),

    # Repos
    path('v2/apps/<str:app_id>/repos/', views.AppReposView.as_view()),
    path('v2/apps/<str:app_id>/available-repos/', views.AvailableReposView.as_view()),
    path('v2/repos/<int:pk>/', views.RepoDetailView.as_view()),

    # Docs
    path('v2/apps/<str:app_id>/docs/', views.AppDocsView.as_view()),
    path('v2/docs/<int:pk>/', views.DocDetailView.as_view()),

    # Guilds
    path('v2/guilds/', views.GuildListView.as_view()),
    path('v2/apps/<str:app_id>/guild-assignments/', views.GuildAssignmentsView.as_view()),
    path('v2/outcomes/<str:outcome_id>/engagement/', views.OutcomeEngagementView.as_view()),

    # Reference
    path('v2/lines-of-business/', views.LinesOfBusinessView.as_view()),
]
```

#### New Models (extend existing schema)

```python
# services/models/product.py
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    line_of_business = models.ForeignKey('LineOfBusiness', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProductApp(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_apps')
    app_id = models.CharField(max_length=50)  # CMDB correlation ID
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['product', 'app_id']

# services/models/repository.py
class Repository(models.Model):
    app_id = models.CharField(max_length=50)
    repo_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    url = models.URLField()
    platform = models.CharField(max_length=50)  # gitlab, github, bitbucket
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# services/models/documentation.py
class Documentation(models.Model):
    app_id = models.CharField(max_length=50)
    doc_type = models.CharField(max_length=50)  # confluence, runbook, architecture, etc.
    url = models.URLField()
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# services/models/guild.py
class Guild(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

class GuildAssignment(models.Model):
    app_id = models.CharField(max_length=50)
    guild = models.ForeignKey(Guild, on_delete=models.CASCADE)
    sme_name = models.CharField(max_length=255)
    sme_email = models.EmailField()
    status = models.CharField(max_length=50)  # active, pending, completed

class OutcomeEngagement(models.Model):
    outcome_id = models.CharField(max_length=50, unique=True)
    product_delta_doc = models.URLField(blank=True)
    architecture_delta_doc = models.URLField(blank=True)
    service_vision_delta_doc = models.URLField(blank=True)
    questionnaire = models.JSONField(default=dict)
    selected_guilds = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Phase 3: Response Format Alignment

Lean Control expects specific response formats. Create serializers that match:

```python
# Example: App list response
{
    "id": "APP001",
    "cmdbId": "APP001",
    "name": "My Application",
    "description": "...",
    "tier": "Tier 1",
    "lineOfBusiness": "Retail Banking",
    "productId": 1,
    "productName": "Product A"
}
```

---

## 4. Implementation Order

### Sprint 1: URL Remapping (Lean Control only)
1. Update `api.js` to map to existing lean-web endpoints
2. Test CMDB search, stakeholders, Jira projects
3. Handle response format differences in frontend

### Sprint 2: Core Models (Lean-Web)
1. Add Product, ProductApp models
2. Add Repository, Documentation models
3. Run migrations
4. Add `/api/v2/` URL namespace

### Sprint 3: Product & App APIs (Lean-Web)
1. Implement Product CRUD endpoints
2. Implement Product-App association endpoints
3. Implement App JSON detail endpoint

### Sprint 4: Repo & Docs APIs (Lean-Web)
1. Implement Repository CRUD endpoints
2. Implement available-repos (GitLab/GitHub integration)
3. Implement Documentation CRUD endpoints

### Sprint 5: Guild Engagement (Lean-Web)
1. Add Guild, GuildAssignment, OutcomeEngagement models
2. Implement guild endpoints
3. Implement outcome engagement endpoints

### Sprint 6: Integration Testing
1. Full end-to-end testing with Lean Control
2. Verify existing lean-web frontend still works
3. Performance testing

---

## 5. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing lean-web frontend | Use `/api/v2/` namespace, don't modify existing endpoints |
| Database migration issues | Use nullable fields, don't alter existing tables |
| Authentication mismatch | Lean Control will use same session auth as lean-web |
| CORS issues | Configure Django CORS for local development |
| Response format mismatch | Create dedicated serializers for Lean Control |

---

## 6. Files to Create/Modify

### Lean-Web (New Files)
```
services/
├── api/
│   ├── __init__.py
│   ├── urls.py          # New v2 API routes
│   ├── views.py         # New API views
│   └── serializers.py   # Response formatters
├── models/
│   ├── product.py       # Product, ProductApp
│   ├── repository.py    # Repository
│   ├── documentation.py # Documentation
│   └── guild.py         # Guild, GuildAssignment, OutcomeEngagement
```

### Lean-Web (Modified Files)
```
config/urls.py           # Include new api/ URLs
config/settings.py       # Add CORS, new apps
```

### Lean Control (Modified Files)
```
src/services/api.js      # Update endpoint URLs
src/context/AppContext.js # Handle response format differences
```

---

## Approval Checklist

- [x] Phase 1: URL remapping approach approved
- [x] Phase 2: New models schema approved
- [x] Phase 3: API endpoint structure approved
- [x] Sprint order approved
- [x] Ready to begin implementation

---

## Implementation Status

### Completed

#### Phase 1: Lean Control API Remapping
- Updated `src/services/api.js` with:
  - `USE_LEAN_WEB` flag for toggling between mock and real endpoints
  - Response transformers for normalizing lean-web responses
  - Endpoint mappings to existing lean-web APIs where available
  - v2 endpoint paths for new APIs
- Updated `AddAppWizardContext.js` to use API service
- Updated `BusinessOutcomeModal.js` to use API service

#### Phase 2: Lean-Web Database Schema
- Created `/migrations/schema/031_lean_control_support.sql`:
  - `app_documentation` - Documentation links per app
  - `app_repositories` - Source code repo associations
  - `guilds` - Reference table with seed data
  - `outcome_engagements` - Guild engagement tracking
  - `lines_of_business` - Reference table with seed data
  - `product_apps` - Product-app associations

#### Phase 3: Lean-Web v2 API
- Created `/services/api_v2/` module:
  - `__init__.py` - Module init
  - `repos.py` - Database access layer (28 functions)
  - `views.py` - JSON API views (16 view classes)
  - `urls.py` - URL patterns for all v2 endpoints
- Added v2 API include to `/services/urls.py`

### Remaining Steps

1. **Run database migration** in lean-web:
   ```bash
   psql -d leanweb -f migrations/schema/031_lean_control_support.sql
   ```

2. **Test the integration**:
   - Start lean-web Django server
   - Configure Lean Control to proxy to lean-web
   - Test each endpoint category

3. **Implement GitLab/GitHub integration** for `available-repos` endpoint (currently returns empty list)
