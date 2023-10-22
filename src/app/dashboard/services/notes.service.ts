import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';

@Injectable({
    providedIn: 'root',
})
export class NotesService {

    public notes: Note[] = [
        {
            'id': 1,
            'title': 'Test',
            'content': 'You can identify heavy computations with Angular DevTools’ profiler. In the performance timeline, click a bar to preview a particular change detection cycle. This displays a bar chart, which shows how long the framework spent in change detection for each component. When you click a component, you can preview how long Angular spent evaluating its template and lifecycle hooks.',
            'difficulty': 0,
            'reviewsLeft': 5,
            'nextReviewAt': null,
            'reviewedAt': null,
            'createdAt': '2023-10-19T19:58:22.000Z',
            'tags': [
                {
                    'id': 1,
                    'name': 'U1T1',
                    'notesCount': 4,
                },
                {
                    'id': 2,
                    'name': 'U1T2',
                    'notesCount': 2,
                },
                {
                    'id': 3,
                    'name': 'U1T3',
                    'notesCount': 3,
                },
            ],
        },
        {
            'id': 2,
            'title': 'Test',
            'content': 'Change detection is the process through which Angular checks to see whether your application state has changed, and if any DOM needs to be updated. At a high level, Angular walks your components from top to bottom, looking for changes. Angular runs its change detection mechanism periodically so that changes to the data model are reflected in an application’s view. Change detection can be triggered either manually or through an asynchronous event (for example, a user interaction or an XMLHttpRequest completion).',
            'difficulty': 0,
            'reviewsLeft': 5,
            'nextReviewAt': null,
            'reviewedAt': null,
            'createdAt': '2023-10-19T19:58:22.000Z',
            'tags': [
                {
                    'id': 1,
                    'name': 'U1T1',
                    'notesCount': 4,
                },
                {
                    'id': 3,
                    'name': 'U1T3',
                    'notesCount': 3,
                },
            ],
        },
        {
            'id': 3,
            'title': 'Test',
            'content': 'Change detection is the process',
            'difficulty': 0,
            'reviewsLeft': 5,
            'nextReviewAt': null,
            'reviewedAt': null,
            'createdAt': '2023-10-19T19:58:22.000Z',
            'tags': [
                {
                    'id': 1,
                    'name': 'U1T1',
                    'notesCount': 4,
                },
                {
                    'id': 3,
                    'name': 'U1T3',
                    'notesCount': 3,
                },
            ],
        },
    ];

}
