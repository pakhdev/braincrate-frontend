import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { HeaderNavigationComponent } from './components/header-navigation/header-navigation.component';
import { LeftMenuComponent } from './components/panel/left-menu/left-menu.component';
import { TagPickerComponent } from './components/panel/tag-picker/tag-picker.component';
import { NoteManagementComponent } from './components/panel/note-management/note-management.component';
import { AccountManagementComponent } from './components/panel/account-management/account-management.component';
import { SearchNotesFormComponent } from './components/panel/search-notes-form/search-notes-form.component';
import { ViewNoteComponent } from './components/note/view-note/view-note.component';
import { EditNoteComponent } from './components/note/edit-note/edit-note.component';
import { RemoveConfirmationComponent } from './components/note/remove-confirmation/remove-confirmation.component';
import { ReviewOptionsComponent } from './components/note/review-options/review-options.component';
import { AllNotesPageComponent } from './pages/all-notes-page/all-notes-page.component';
import { ReviewNotesPageComponent } from './pages/review-notes-page/review-notes-page.component';
import { NewNotePageComponent } from './pages/new-note-page/new-note-page.component';
import { ViewToolbarComponent } from './components/note/view-toolbar/view-toolbar.component';

@NgModule({
    declarations: [
        DashboardLayoutComponent,
        HeaderNavigationComponent,
        LeftMenuComponent,
        TagPickerComponent,
        NoteManagementComponent,
        AccountManagementComponent,
        SearchNotesFormComponent,
        ViewNoteComponent,
        EditNoteComponent,
        RemoveConfirmationComponent,
        ReviewOptionsComponent,
        AllNotesPageComponent,
        ReviewNotesPageComponent,
        NewNotePageComponent,
        ViewToolbarComponent,
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
    ],
})
export class DashboardModule {
}
