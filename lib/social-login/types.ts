export interface SocialProfile {
  email: string;
  providerId: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface SocialLoginError {
  provider: string;
  message: string;
}
