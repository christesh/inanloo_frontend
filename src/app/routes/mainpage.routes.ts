import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../mainpage/home/home.component';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const MAINPAGE_ROUTES: Routes = [
    
     {
        path: 'home',
        loadChildren: () => import('../mainpage/mainpage.module').then(m => m.MainpageModule)
    },
    
];

