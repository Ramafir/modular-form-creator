import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BasicInfoPage } from '../features/resources/pages/BasicInfoPage'
import { ProjectDetailsPage } from '../features/resources/pages/ProjectDetailsPage'
import { ResourceDetailsPage } from '../features/resources/pages/ResourceDetailsPage'
import { ResourceLayout } from '../features/resources/pages/ResourceLayout'
import { ResourceOverviewPage } from '../features/resources/pages/ResourceOverviewPage'
import { ResourcesListPage } from '../features/resources/pages/ResourcesListPage'
import { resourcePaths } from '../features/resources/paths'
import { AppLayout } from './AppLayout'
import { NotFoundPage } from './NotFoundPage'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        // Pathless boundary keeps the app header visible when a page crashes.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <Navigate to={resourcePaths.list} replace /> },
          { path: 'resources', element: <ResourcesListPage /> },
          {
            path: 'resources/:resourceId',
            element: <ResourceLayout />,
            children: [
              { index: true, element: <ResourceOverviewPage /> },
              { path: 'details', element: <ResourceDetailsPage /> },
              { path: 'basic-info', element: <BasicInfoPage /> },
              { path: 'project-details', element: <ProjectDetailsPage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
