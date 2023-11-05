export interface AuthResponse {
    user: {
        id: number;
        email: string;
        token: string;
    },
    error: string;
}