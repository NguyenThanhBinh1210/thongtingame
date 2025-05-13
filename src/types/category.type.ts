export interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentId?: string;
}

export interface CategoryCreate {
  name: string;
  level: number;
  parentId?: string;
}

export interface CategoryUpdate {
  name?: string;
  level?: number;
  parentId?: string;
} 