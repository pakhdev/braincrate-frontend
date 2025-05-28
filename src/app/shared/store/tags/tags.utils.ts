import { Tag } from '../../../dashboard/interfaces/tag.interface';

export function findTag(list: Tag[], target: Tag): Tag | undefined {
    return list.find(tag => tag.id === target.id);
}

export function mergeTags(existingTags: Tag[], tagsToUpdate: Tag[]): Tag[] {
    tagsToUpdate.forEach((tag) => {
        const existingTag = findTag(existingTags, tag);
        existingTag
            ? existingTag.notesCount = tag.notesCount
            : existingTags.push(tag);
    });
    return existingTags.filter(tag => tag.notesCount > 0);
}
