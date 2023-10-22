import { Injectable, signal, WritableSignal } from '@angular/core';

import { Tag } from '../interfaces/tag.interface';

@Injectable({
    providedIn: 'root',
})
export class TagsService {

    public tags: WritableSignal<Tag[]> = signal([
        {
            'id': 1,
            'name': 'JavaScript',
            'notesCount': 9,
        },
        {
            'id': 2,
            'name': 'Python',
            'notesCount': 6,
        },
        {
            'id': 3,
            'name': 'HTML',
            'notesCount': 4,
        },
        {
            'id': 4,
            'name': 'CSS',
            'notesCount': 10,
        },
        {
            'id': 5,
            'name': 'Java',
            'notesCount': 7,
        },
        {
            'id': 6,
            'name': 'C++',
            'notesCount': 8,
        },
        {
            'id': 7,
            'name': 'PHP',
            'notesCount': 8,
        },
        {
            'id': 8,
            'name': 'Ruby',
            'notesCount': 8,
        },
        {
            'id': 9,
            'name': 'React',
            'notesCount': 7,
        },
        {
            'id': 10,
            'name': 'Angular',
            'notesCount': 4,
        },
        {
            'id': 11,
            'name': 'Vue.js',
            'notesCount': 7,
        },
        {
            'id': 12,
            'name': 'Node.js',
            'notesCount': 7,
        },
        {
            'id': 13,
            'name': 'TypeScript',
            'notesCount': 4,
        },
        {
            'id': 14,
            'name': 'Swift',
            'notesCount': 2,
        },
        {
            'id': 15,
            'name': 'C#',
            'notesCount': 10,
        },
        {
            'id': 16,
            'name': 'SQL',
            'notesCount': 6,
        },
        {
            'id': 17,
            'name': 'Git',
            'notesCount': 9,
        },
        {
            'id': 18,
            'name': 'Linux',
            'notesCount': 9,
        },
        {
            'id': 19,
            'name': 'Web Development',
            'notesCount': 2,
        },
        {
            'id': 20,
            'name': 'Mobile Development',
            'notesCount': 8,
        },
        {
            'id': 21,
            'name': 'Database',
            'notesCount': 9,
        },
        {
            'id': 22,
            'name': 'Algorithms',
            'notesCount': 8,
        },
        {
            'id': 23,
            'name': 'Data Structures',
            'notesCount': 2,
        },
        {
            'id': 24,
            'name': 'Frontend',
            'notesCount': 6,
        },
        {
            'id': 25,
            'name': 'Backend',
            'notesCount': 3,
        },
        {
            'id': 26,
            'name': 'Full Stack',
            'notesCount': 9,
        },
        {
            'id': 27,
            'name': 'Machine Learning',
            'notesCount': 4,
        },
        {
            'id': 28,
            'name': 'Artificial Intelligence',
            'notesCount': 9,
        },
        {
            'id': 29,
            'name': 'Cybersecurity',
            'notesCount': 7,
        },
        {
            'id': 30,
            'name': 'Cloud Computing',
            'notesCount': 6,
        },
        {
            'id': 31,
            'name': 'DevOps',
            'notesCount': 6,
        },
        {
            'id': 32,
            'name': 'UI/UX Design',
            'notesCount': 3,
        },
        {
            'id': 33,
            'name': 'IoT',
            'notesCount': 5,
        },
        {
            'id': 34,
            'name': 'Game Development',
            'notesCount': 9,
        },
        {
            'id': 35,
            'name': 'Testing',
            'notesCount': 1,
        },
        {
            'id': 36,
            'name': 'Version Control',
            'notesCount': 10,
        },
        {
            'id': 37,
            'name': 'Agile',
            'notesCount': 4,
        },
        {
            'id': 38,
            'name': 'Scrum',
            'notesCount': 5,
        },
        {
            'id': 39,
            'name': 'API',
            'notesCount': 7,
        },
        {
            'id': 40,
            'name': 'Docker',
            'notesCount': 8,
        },
        {
            'id': 41,
            'name': 'Kubernetes',
            'notesCount': 9,
        },
        {
            'id': 42,
            'name': 'Blockchain',
            'notesCount': 2,
        },
        {
            'id': 43,
            'name': 'Virtual Reality',
            'notesCount': 6,
        },
        {
            'id': 44,
            'name': 'Augmented Reality',
            'notesCount': 5,
        },
        {
            'id': 45,
            'name': 'Operating System',
            'notesCount': 4,
        },
        {
            'id': 46,
            'name': 'IDE',
            'notesCount': 10,
        },
        {
            'id': 47,
            'name': 'IDEA',
            'notesCount': 10,
        },
        {
            'id': 48,
            'name': 'Eclipse',
            'notesCount': 9,
        },
        {
            'id': 49,
            'name': 'Code Editor',
            'notesCount': 2,
        },
        {
            'id': 50,
            'name': 'Debugging',
            'notesCount': 4,
        },
        {
            'id': 51,
            'name': 'Code Quality',
            'notesCount': 5,
        },
    ]);
}
