import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { RaceApiService } from '../race-api.service';
import { RaceService } from '../race.service';
import { FeaturedRaceService } from '../shared/featured-race.service';
import { ExternalRace } from '../models/external-race';
import { State } from '../models/state';
import { RaceDetailsDialogComponent } from '../race-details-dialog/race-details-dialog.component';

@Component({
  selector: 'app-find-race',
  templateUrl: './find-race.component.html',
  styleUrls: ['./find-race.component.css']
})
export class FindRaceComponent implements OnInit {
  races: ExternalRace[] = [];
  displayedRaces: ExternalRace[] = [];
  featuredRace: ExternalRace | null = null;
  featuredRaceLogo: SafeUrl | null = null;

  states: State[] = []; 

  months: { name: string; value: string }[] = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];

  distances: { name: string; minDistance: number; maxDistance: number }[] = [
    { name: '5k', minDistance: 5, maxDistance: 5 },
    { name: '10k', minDistance: 10, maxDistance: 10 },
    { name: 'Half Marathon', minDistance: 21.1, maxDistance: 21.1 },
    { name: 'Marathon', minDistance: 42.2, maxDistance: 42.2 },
    { name: '50k', minDistance: 50, maxDistance: 50 }
  ];

  selectedStatesControl = new FormControl([]);
  selectedMonthsControl = new FormControl([]);
  selectedDistancesControl = new FormControl([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private raceApiService: RaceApiService,
    private raceService: RaceService,
    private featuredRaceService: FeaturedRaceService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.raceService.getStates().subscribe(states => this.states = states);
    this.getFeaturedRace();
  }


  getFeaturedRace(): void {
    this.featuredRaceService.getFeaturedRace().subscribe((data: ExternalRace | null) => {
      if (data) {
        this.featuredRace = data;
        this.featuredRaceLogo = this.extractUrl(data.logo_url);
      }
    });
  }

  extractUrl(safeUrl: any): string {
    
    return typeof safeUrl === 'string' ? safeUrl : safeUrl.changingThisBreaksApplicationSecurity;
  }

  searchRaces(): void {
    const selectedStates = this.selectedStatesControl.value?.map((state: State) => state.abbreviation) || [];
    const selectedMonths = this.selectedMonthsControl.value || [];
    const selectedDistances = this.selectedDistancesControl.value || [];
  
    const minDistance = selectedDistances.length > 0
      ? Math.min(...selectedDistances.map((d: { minDistance: number }) => d.minDistance))
      : 0;
    const maxDistance = selectedDistances.length > 0
      ? Math.max(...selectedDistances.map((d: { maxDistance: number }) => d.maxDistance))
      : 50;
  
    this.raceApiService.searchRaces(selectedStates, selectedMonths, minDistance, maxDistance).subscribe(
      (data: { race: ExternalRace }[]) => {
        this.races = data.map(item => ({
          ...item.race,
          sanitized_description: this.sanitizeHtml(item.race.description),
          external_race_url: item.race.external_race_url,
          logo_url: item.race.logo_url // Keep as string
          
        }));
        this.updateDisplayedRaces();
      },
      (error) => {
        console.error('Error fetching races:', error);
      }
    );
  }

  updateDisplayedRaces(): void {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      const endIndex = startIndex + this.paginator.pageSize;
      this.displayedRaces = this.races.slice(startIndex, endIndex);
      console.log('Displayed races updated:', this.displayedRaces);
    }
  }

  onPageChange(event: PageEvent): void {
    this.updateDisplayedRaces();
  }

  viewDetails(race: ExternalRace): void {
    this.dialog.open(RaceDetailsDialogComponent, {
      width: '600px',
      data: race
    });
  }

  addToWishlist(race: ExternalRace): void {
    this.raceService.addToWishlist(race).subscribe(
      (response) => {
        console.log('Race added to wishlist:', response);
      },
      (error) => {
        console.error('Error adding race to wishlist:', error);
      }
    );
  }

  

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}








