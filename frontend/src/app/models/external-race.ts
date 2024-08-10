import { SafeHtml, SafeResourceUrl, SafeUrl } from "@angular/platform-browser";

export interface Address {
    street: string;
    street2: string | null;
    city: string;
    state: string;
    zipcode: string;
    country_code: string;
  }
  
  export interface ExternalRace {
    race_id: number;
    name: string;
    last_date: string | null;
    last_end_date: string | null;
    next_date: string;
    next_end_date: string;
    is_draft_race: string;
    is_private_race: string;
    is_registration_open: string;
    created: string;
    last_modified: string;
    description: string;
    sanitized_description: string | SafeHtml 
    url: string;
    external_race_url: string | null;
    external_results_url: string | null;
    fb_page_id: string | null;
    fb_event_id: string | null;
    address: Address;
    timezone: string;
    logo_url: string;
    real_time_notifications_enabled: string;
  }
  
  export interface FeaturedRaceResponse {
    race: {
      race: ExternalRace;
    };
  }
  
  