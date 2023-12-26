import { GoogleLinkMessage } from '../enums/google-link-message.enum';

export interface GoogleLinkResponse {
    message: GoogleLinkMessage;
    newEmail?: string;
}