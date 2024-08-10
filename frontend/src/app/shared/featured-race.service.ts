import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExternalRace } from '../models/external-race'; // Adjust import path as necessary

@Injectable({
  providedIn: 'root'
})
export class FeaturedRaceService {
  private featuredRaceSubject = new BehaviorSubject<ExternalRace | null>(null);
  featuredRace$: Observable<ExternalRace | null> = this.featuredRaceSubject.asObservable();

  setFeaturedRace(race: ExternalRace): void {
    this.featuredRaceSubject.next(race);
  }

  getFeaturedRace(): Observable<ExternalRace | null> {
    return this.featuredRace$;
  }
}


