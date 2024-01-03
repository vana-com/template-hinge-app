export interface Account {
  id: string;
  email: string;
  created: string;
  username: string;
  phoneNumber: string;
  isVerified: boolean;
  isDisabled: boolean;
  isSubscribed: boolean;
  meta: {};
  tags: [];
  profilePictureUrl: string;
}

export interface Conversation {
  id: string;
  speakers: string[];
  created: string;
  updated: string;
  //   messages: Message[];
}

export interface PromptAndResponse {
  prompt: string;
  response: string;
}
