import { Tag } from '../../../dashboard/interfaces/tag.interface';

export interface TagsState {
    list: Tag[];
    isLoading: boolean;
}
