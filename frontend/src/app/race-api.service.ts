import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExternalRace, FeaturedRaceResponse } from './models/external-race';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RaceApiService {
  private apiUrl = 'http://localhost:3000/api/'; // Adjust URL as per your backend
  private cachedData: Record<string, any[]> = {};

  constructor(private http: HttpClient) {}

  // Search races with multiple parameters as filters (states, month, distance)
  searchRaces(states: string[], months: string[], minDistance: number, maxDistance: number): Observable<{ race: ExternalRace }[]> {
    let params = new HttpParams();
    
    if (states && states.length > 0) {
      params = params.set('state', states.join(','));
    }
    if (months && months.length > 0) {
      params = params.set('month', months.join(','));
    }
    if (minDistance !== undefined) {
      params = params.set('min_distance', minDistance.toString());
    }
    if (maxDistance !== undefined) {
      params = params.set('max_distance', maxDistance.toString());
    }

    return this.http.get<{ race: ExternalRace }[]>(`${this.apiUrl}find-races/`, { params }).pipe(
      tap(data => {
        console.log('Fetched races:', data);
      }),
      catchError(error => {
        console.error('Error fetching races:', error);
        throw error;
      })
    );
  }

  // Get featured race
  getFeaturedRace(state: string): Observable<FeaturedRaceResponse> {
    return this.http.get<FeaturedRaceResponse>(`${this.apiUrl}featured-race?state=${state}`);
  }


  findRaces(name: string): Observable<{ race: ExternalRace }[]> {
    let params = new HttpParams().set('name', name);

    return this.http.get<{ race: ExternalRace }[]>(`${this.apiUrl}search-races/`, { params }).pipe(
      tap(data => {
        console.log('Fetched races:', data);
      }),
      catchError(error => {
        console.error('Error fetching races:', error);
        throw error;
      })
    );
  }
}








