import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { AllNotesPageComponent } from './pages/all-notes-page/all-notes-page.component';
import { ReviewNotesPageComponent } from './pages/review-notes-page/review-notes-page.component';
import { NewNotePageComponent } from './pages/new-note-page/new-note-page.component';

const routes: Routes = [{
    path: '',
    component: DashboardLayoutComponent,
    children: [
        { path: 'all', component: AllNotesPageComponent },
        { path: 'for-review', component: ReviewNotesPageComponent },
        { path: 'create-note', component: NewNotePageComponent },
        { path: '', redirectTo: 'all', pathMatch: 'full' },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule {
}
