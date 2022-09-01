import { Routes, RouterModule } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const MAINPAGE_ROUTES: Routes = [
     {
        path: 'mainpage',
        loadChildren: () => import('../mainpage/mainpage.module').then(m => m.MainpageModule)
    }
];
