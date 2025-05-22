import { Tag } from '../../../dashboard/interfaces/tag.interface';

export interface TagsState {
    tags: Tag[];
    isLoading: boolean;
}
