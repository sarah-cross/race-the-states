export interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country_code: string;
}

export interface WishlistItem {
  race_id: number;
  name: string;  // Updated to match ExternalRace
  next_date: string;  // Updated to match ExternalRace (next_date)
  address: Address;
  logo_url: string;
  description: string;
  url: string;  // Updated to match ExternalRace
  external_race_url: string | null;
  added_at: string; // DateTime format received from Django (ISO 8601 string)
}

