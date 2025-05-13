export interface Chat {
  id: string;
  name: string;
  link: string;
  order: number;
  isActive: boolean;
}

export interface ChatResponse {
  data: Chat[];
} 