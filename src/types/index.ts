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
  characterId?: string;
}

export interface Speaker {
  avatarUrl: string | null;
  id: string;
  name: string;
  participantId: string;
  participantType: string;
}

export interface Message {
  id: string;
  content: string;
  created: number;
  mediaUrl: string | null;
  mediaMimetype: string | null;
  speakerId: string;
  participantId: string;
  participantType: string;
}

export interface Conversation {
  id: string;
  speakers: Speaker[];
  created: string;
  updated: string;
  messages: Message[];
}

export interface PromptAndResponse {
  prompt: string;
  response: string;
}
