import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { State } from './models/state';
import { Race } from './models/race';
import { WishlistItem } from './models/wishlist-item';
import { ExternalRace } from './models/external-race';


@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private baseUrl = 'http://localhost:8000/api/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const authToken = this.authService.getAuthToken() || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }

 
  // Add user-created race to list of completed races
  addRace(raceData: any): Observable<Race> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Race>(`${this.baseUrl}add-race/`, JSON.stringify(raceData), { headers });
  }


  getUserRaces(): Observable<Race[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Race[]>(`${this.baseUrl}user-races/`, { headers }).pipe(
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized:', error);
        }
        return throwError(error);
      })
    );
  } 

  // Get all states
  getStates(): Observable<State[]> {
    const authToken = this.authService.getAuthToken() || '';
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}` });

    return this.http.get<State[]>(`${this.baseUrl}states/`, { headers }).pipe(
      map(states => states.sort((a, b) => a.name.localeCompare(b.name))), // Sort by name
      catchError(error => {
        if (error.status === 401) {
          console.error('Unauthorized:', error);
        }
        return throwError(error);
      })
    );
  }

  // Delete a user-created race
  deleteRace(raceId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.baseUrl}delete-race/${raceId}/`, { headers }).pipe(
      catchError(error => {
        console.error('Error deleting race:', error);
        return throwError(error);
      })
    );
  }

  // Update a user-created race
  updateRace(id: number, raceData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('update race: ', id);
    console.log('race data:', raceData);
    return this.http.put(`${this.baseUrl}races/${id}/`, raceData, { headers });
  }

  // Add a race to wishlist 
addToWishlist(race: ExternalRace): Observable<any> {
  console.log('race to add (in service):', race);
  const addUrl = `${this.baseUrl}wishlist/add/`;

  // Format the dates correctly
  if (race.next_date) {
    race.next_date = new Date(race.next_date).toISOString().split('T')[0];
  }
  if (race.last_date) {
    race.last_date = new Date(race.last_date).toISOString().split('T')[0];
  }
  if (race.created) {
    race.created = new Date(race.created).toISOString();
  }
  if (race.last_modified) {
    race.last_modified = new Date(race.last_modified).toISOString();
  }
  
  return this.http.post<any>(addUrl, { addUrl, race });
}

// Get user's wishlist
getWishlist(): Observable<{ wishlist: WishlistItem[] }> {
  return this.http.get<{ wishlist: WishlistItem[] }>(`${this.baseUrl}wishlist/`);
}

// Remove a race from wishlist
removeFromWishlist(raceId: number): Observable<any> {
  const removeUrl = `${this.baseUrl}wishlist/${raceId}/remove/`;
  return this.http.delete<any>(removeUrl);
}  
  
  
}
