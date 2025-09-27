export type FormAttribute = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone';
  initialValue?: string | number;
};