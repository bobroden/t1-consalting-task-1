import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthorizationModule } from './modules/authorization.module';
import { TasksModule } from './modules/tasks.module';
import { CategoryModule } from './modules/category.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ErrorComponent } from './components/error/error.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ListOfTasksComponent } from './components/list-of-tasks/list-of-tasks.component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { CategoryComponent } from './components/category/category.component';
import { ProfileComponent } from './components/profile/profile.component';

import { IsAuthGuard } from './guards/is-auth.guard';

import { backendProvider } from './interceptors/user.interceptor';

const appRoutes: Routes = [
  { path: 'auth', component: AuthorizationComponent },
  { path: 'tasks', component: ListOfTasksComponent, canActivate: [IsAuthGuard] },
  { path: 'categories', component: CategoryComponent, canActivate: [IsAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [IsAuthGuard] },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    AuthorizationModule,
    TasksModule,
    CategoryModule
  ],
  providers: [
    backendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }