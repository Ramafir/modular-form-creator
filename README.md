# Resources Management

Frontend for the modular resource workflow: create a resource, fill in its two modules
(Basic Info and Project Details), provision it, and keep editing it safely once it is
completed.

Built with React 19, TypeScript, React Router, TanStack Query, React Hook Form + Zod and
the provided styled-components design system.

## Quick start

### Full stack in Docker

```bash
docker compose up -d --build
```

| Service     | URL                        |
| ----------- | -------------------------- |
| Frontend    | http://localhost:8080      |
| Backend API | http://localhost:5001      |
| Swagger UI  | http://localhost:5001/docs |

### Local development

Requires Node.js 20.19+, 22.13+ or 24+.

```bash
docker compose up -d backend mongo
npm ci
npm run dev
```

Open http://localhost:5173. The backend accepts CORS requests only from this origin, so
the dev server fails fast instead of silently moving to another port. The API URL
defaults to `http://localhost:5001` and can be overridden with `VITE_API_URL` in
`.env.local` (see `.env.example`).

### Scripts

| Command                                   | Description                                        |
| ----------------------------------------- | -------------------------------------------------- |
| `npm run dev`                             | Dev server on port 5173                            |
| `npm run build`                           | Type check and production build                    |
| `npm run preview`                         | Serve the production build on port 5173            |
| `npm run lint`                            | ESLint                                             |
| `npm run typecheck`                       | TypeScript project check                           |
| `npm test`                                | Unit tests (Vitest)                                |
| `npm run format` / `npm run format:check` | Prettier for `src` (the design system is excluded) |
| `npm run storybook`                       | Design system Storybook                            |

## Pages

| Route                                    | Purpose                                                                                                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/resources`                             | Create, browse and delete resources; pagination, status filter, name search and sort order live in the URL |
| `/resources/:resourceId`                 | Overview: module cards, progress and provisioning                                                          |
| `/resources/:resourceId/basic-info`      | Basic Info form                                                                                            |
| `/resources/:resourceId/project-details` | Project Details form (locked for drafts until Basic Info is complete)                                      |
| `/resources/:resourceId/details`         | Read-only summary of both modules with their completion state                                              |

## Business rules

| Rule                                                                         | Implementation                                                                                                                                             |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A resource is created from a name that cannot change                         | `CreateResourceForm` validates the name like the backend does; Basic Info shows it as a locked field and always sends the current value                    |
| Draft modules are saved separately                                           | Each form sends its whole module with the module `PATCH` endpoint (`useModuleSubmit`)                                                                      |
| Project Details needs a complete Basic Info (drafts)                         | `isProjectDetailsLocked`: a locked card on the overview and a guard on the route                                                                           |
| Draft → completed only through provisioning, only with both modules complete | `ProvisioningPanel` is enabled only when `canProvision` is true, asks for confirmation and calls `PATCH /provisioning`                                     |
| A completed resource cannot be provisioned again                             | The action is not offered for completed resources                                                                                                          |
| Edits of completed resources stay in frontend state                          | Their forms stage edits in an in-memory store (`pending-changes/`) instead of calling the API                                                              |
| They are persisted only after an explicit submit, with a full update         | A banner opens a review drawer with a before/after diff; "Submit changes" sends one `PUT /api/resources/:id` with the full payload (`buildReplacePayload`) |
| Unsubmitted edits are lost on refresh or close                               | The store is React state only (no browser storage); `beforeunload` asks for confirmation first                                                             |

The rules are pure functions in `src/features/resources/model` and are covered by unit
tests. Completeness checks mirror the backend service, so the UI never offers an action
the API would reject.

## API usage

| Endpoint                                                     | Used by                                           |
| ------------------------------------------------------------ | ------------------------------------------------- |
| `GET /api/resources`                                         | List page (`page`, `status`, `name`, `sortOrder`) |
| `POST /api/resources`                                        | Create form                                       |
| `GET /api/resources/:id`                                     | Resource layout, shared by all resource pages     |
| `PATCH /api/resources/:id/basic-info` and `/project-details` | Module forms of draft resources                   |
| `PATCH /api/resources/:id/provisioning`                      | Provisioning                                      |
| `PUT /api/resources/:id`                                     | Submitting buffered edits of a completed resource |
| `DELETE /api/resources/:id`                                  | List page                                         |

## Architecture

```
src/
  app/                  app shell: providers, router, layout, error pages
  shared/               feature-agnostic code: HTTP client, UI building blocks, helpers
  features/resources/
    api/                endpoints, query options and mutations
    model/              types, business rules, validation schemas, edit buffer (unit tested)
    pending-changes/    in-memory store for edits of completed resources
    hooks/              URL state, form submission, current resource
    components/         feature UI
    pages/              route components
  design-system/        provided, unchanged
```

### Decisions

- **TanStack Query for server state.** Every mutation responds with the full resource, so
  the cache is updated from the response instead of refetching. 4xx responses are not
  retried, and a rejected mutation refetches the resource because it may have changed in
  another tab.
- **React Hook Form + Zod for forms.** The schemas mirror the backend validators
  (patterns, length limits, allowed values). The API README does not list these rules,
  so they were taken from the backend code. Users see errors before a request is made.
- **React Context + reducer for the edit buffer.** It is client state that has to survive
  navigation inside the app but not a refresh, so it lives in memory above the router.
  A state library would add nothing here. The buffer is keyed by `_id`, because the
  backend reuses numeric `resourceId`s after the newest resource is deleted.
- **The URL as list state.** Page, filters and sort order survive refreshes, work with
  Back and can be shared. Invalid values fall back to defaults, so the API never gets a
  query it would reject.
- **A module registry** (`model/modules.ts`) drives the overview cards, progress and the
  details summary from one definition per module.
- **Design system components as provided.** For example, the locked `Input` for the
  resource name, the locked `Button` for Project Details, `CheckboxGroup` for team members
  and `Drawer` for the change review. A small app-level global style makes form controls
  inherit the page font, because the design-system textarea otherwise renders in
  monospace.
- **Docker.** A multi-stage build serves the app with nginx. nginx proxies `/api` to the
  backend inside the compose network, because the browser is not part of that network.
  The app therefore stays on one origin and the backend CORS settings stay untouched.

### Edge cases

- The backend uses the `name` filter as a raw regular expression (`?name=(` returns 500),
  so the client escapes it.
- The backend clamps out-of-range pages, for example after deleting the last item on the
  last page. The URL follows the page that was returned.
- Validation rules missing from the API README are mirrored: owner letters and spaces
  only, budget digits only, unique case-insensitive name. Duplicate names get a readable
  message.
- Module `PATCH` endpoints require the whole module, so a module counts as complete once
  it has been saved. Partial payloads are never sent.
- Non-canonical ids that the API accepts (Mongo ObjectId, leading zeros) redirect to the
  numeric id, so URLs and cache keys stay consistent.
- Budget is a digit string. It uses a numeric keyboard instead of `type="number"` and is
  formatted with BigInt, so long values keep every digit.
- Saving a module without real changes does not create pending changes, and team member
  order is ignored when comparing.
- Deleting a resource drops its buffered edits.

## Testing

`npm test` runs the unit tests: business rules, validation schemas, the edit buffer and
its diff, URL state parsing, API request building and HTTP error handling. The template's
Storybook Vitest project is kept as is; it needs Playwright browsers.

The main flows were also verified end to end against the real backend during development,
both locally and in Docker.

## Known limitations

- The API has no concurrency control, so submitting buffered edits overwrites changes
  made elsewhere in the meantime (last write wins).
- Buffered edits belong to a single browser tab, by design.
- Automated end-to-end tests (e.g. Playwright) would be the next step.
- The design-system `Drawer` close button has no accessible label. Design-system code
  is intentionally left unchanged.

Backend and design-system source code are not modified.
