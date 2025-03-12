export interface User {
  id: string;
  email: string;
  name: string;
  photo?: string | null;
  roles?: string[];
}
