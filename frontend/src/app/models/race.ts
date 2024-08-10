import { State } from './state';

export interface Race {
  id: number;
  user: number;  // Assuming this is the user ID
  city: string | null;
  state: State; 
  race_date: string | null;  // ISO date string
  race_name: string;
  race_notes: string | null;
  race_time: string | null;  // ISO duration string (e.g., "PT1H30M")
  race_images: string | null;  // URL of the image
}