import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const PORTAL_ROUTES: Routes = [
  {
    path: 'portal',
    loadChildren: () => import('../portal/portal.module').then(m => m.PortalModule)
  },
 
];
