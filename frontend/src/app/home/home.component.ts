import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RaceService } from '../race.service';
import { RaceApiService } from '../race-api.service';
import { FeaturedRaceService } from '../shared/featured-race.service';
import { State } from '../models/state';
import { Race } from '../models/race';
import { ExternalRace } from '../models/external-race';
import { FeaturedRaceResponse } from '../models/external-race';
import { AddRaceDialogComponent } from '../add-race-dialog/add-race-dialog.component';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import * as d3 from 'd3';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

type Region = 'northeast' | 'midwest' | 'south' | 'west';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  states: State[] = [];
  featuredRace: any;
  featuredRaceLogo: SafeUrl | null = null;
  userRaces: Race[] = [];
  racedStates: string[] = [];
  statesCompleted: number = 0;
  pr: string | null = null;
  averagePace: string | null = null;

  regionPercentages: { [key in Region]: number } = {
    northeast: 0,
    midwest: 0,
    south: 0,
    west: 0
  };

  totalStatesByRegion = {
    northeast: 11,
    midwest: 12,
    south: 14,
    west: 13
  };

  @ViewChild('statesContainer') private statesContainer!: ElementRef;
  @ViewChild('usMap') private usMapElement!: ElementRef;

  constructor(
    private raceService: RaceService,
    private raceApiService: RaceApiService,
    private featuredRaceService: FeaturedRaceService,
    private datePipe: DatePipe,
    public dialog: MatDialog, 
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.loadStatesAndRaces();
    
  }

  //ngAfterViewInit(): void {
    //this.renderUsMap();
  //}

  loadStatesAndRaces(): void {
    this.raceService.getStates().subscribe(
      states => {
        this.states = states;
        this.raceService.getUserRaces().subscribe(
          races => {
            this.userRaces = races;
            console.log('api response for user races:', races);
            this.racedStates = this.userRaces.map(race => race.state.name);
            console.log('userRaces inside load:', this.userRaces);
            this.statesCompleted = this.racedStates.length;
            this.renderUsMap();
            this.getFeaturedRace();
            this.calculateRegionPercentages();
            this.createProgressChart();
            this.computeStats();
          },
          (error: HttpErrorResponse) => {
            console.error('Error loading user races:', error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading states:', error.message);
      }
    );
  }
  
  
  getFeaturedRace(): void {
    if (this.states.length === 0) {
      return; // Exit early if states are not yet available
    }
  
    console.log('this.states.length:', this.states.length);
    const randomState = this.states[Math.floor(Math.random() * this.states.length)].abbreviation;
    console.log('Random state selected:', randomState);
  
    this.raceApiService.getFeaturedRace(randomState).subscribe(
      (data: FeaturedRaceResponse) => {
        if (data && data.race && data.race.race) {
          const raceData = data.race.race;
          this.featuredRace = {
            race_id: raceData.race_id,
            name: raceData.name,
            last_date: raceData.last_date,
            last_end_date: raceData.last_end_date,
            next_date: raceData.next_date,
            next_end_date: raceData.next_end_date,
            is_draft_race: raceData.is_draft_race === "T",
            is_private_race: raceData.is_private_race === "T",
            is_registration_open: raceData.is_registration_open === "T",
            created: raceData.created,
            last_modified: raceData.last_modified,
            description: raceData.description,
            sanitized_description: this.sanitizeHtml(raceData.description),
            url: raceData.url,
            external_race_url: raceData.external_race_url,
            external_results_url: raceData.external_results_url,
            fb_page_id: raceData.fb_page_id,
            fb_event_id: raceData.fb_event_id,
            address: {
              street: raceData.address.street || '',
              street2: raceData.address.street2 || '',
              city: raceData.address.city || '',
              state: raceData.address.state || '',
              zipcode: raceData.address.zipcode || '',
              country_code: raceData.address.country_code || ''
            },
            timezone: raceData.timezone,
            logo_url: this.sanitizeUrl(raceData.logo_url) as string,
            real_time_notifications_enabled: raceData.real_time_notifications_enabled === "T"
          };
          // Set the featured race in the shared service to be used in other components
          this.featuredRaceLogo = this.extractUrl(this.featuredRace.logo_url);
          this.featuredRaceService.setFeaturedRace(this.featuredRace);
          console.log('Featured race:', this.featuredRace);
        } else {
          console.error('Invalid data structure:', data);
        }
      },
      (error) => {
        console.error('Error fetching featured race:', error);
      }
    );
  } 

  extractUrl(safeUrl: any): string {
    // Extract the actual URL from the nested SafeUrl object
    return typeof safeUrl === 'string' ? safeUrl : safeUrl.changingThisBreaksApplicationSecurity;
  }
  

  calculateRegionPercentages(): void {
    const regionNames: (keyof typeof this.totalStatesByRegion)[] = ["northeast", "midwest", "south", "west"];
    
    regionNames.forEach(region => {
      const totalStates = this.totalStatesByRegion[region];
      const racedStatesInRegion = this.userRaces.filter(race => race.state.region.toLowerCase() === region).length;
  
      //console.log(`Region: ${region}`);
      //console.log(`Total States: ${totalStates}`);
      //console.log(`Raced States in Region: ${racedStatesInRegion}`);
  
      // Calculate percentage
      if (totalStates > 0) {
        this.regionPercentages[region] = (racedStatesInRegion / totalStates) * 100;
      } else {
        this.regionPercentages[region] = 0; // Handle case where totalStates is 0
      }
  
      console.log(`Percentage: ${this.regionPercentages[region]}`);
    });
  }

  
  // US state map
  renderUsMap(): void {
    console.log('rendering map');
    console.log('current raced states:', this.racedStates);
    const svg = d3.select(this.usMapElement.nativeElement);
  
    // Clear previous SVG elements
    svg.selectAll('*').remove();
  
    // Load the US states GeoJSON data
    d3.json('/assets/us-states.json').then((us: any) => {
      // Initialize D3 projection and path generator
      const projection = d3.geoAlbersUsa();
      const pathGenerator = d3.geoPath().projection(projection);
  
      // Append SVG to a container element
      svg.selectAll('path')
        .data(us.features)
        .enter().append('path')
        .attr('d', (d: any) => pathGenerator(d as d3.GeoPermissibleObjects)) // Ensure the function is called here
        .attr('fill', (d: any) => {
          const stateName = d.properties.NAME;
          if (this.racedStates.includes(stateName)) {
            return 'steelblue'; // Color for raced states
          } else {
            return 'lightgray'; // Default color for non-raced states
          }
        })
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .raise()
            .transition()
            .duration(200)
            .attr('transform', function(d) {
              const centroid = pathGenerator.centroid(d as d3.GeoPermissibleObjects);
              return `translate(${centroid[0]},${centroid[1]}) scale(1.2) translate(${-centroid[0]},${-centroid[1]})`;
            })
            .attr('stroke-width', 1.5);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('transform', 'translate(0,0) scale(1) translate(0,0)')
            .attr('stroke-width', 0.5);
        });
    }).catch(error => {
      console.error('Error loading US map data:', error);
    });
  }
  
  createProgressChart(): void {
    const svg = d3.select('#progress-chart');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const radius = Math.min(width, height) / 2;
  
    // Define the arc generator
    const arc = d3.arc()
      .innerRadius((d: any) => d.innerRadius)
      .outerRadius((d: any) => d.outerRadius);
  
    // Background arc for the full circle
    const backgroundArc = (innerRadius: number, outerRadius: number) => arc({
      innerRadius,
      outerRadius,
      startAngle: 0,
      endAngle: 2 * Math.PI
    });
  
    // Foreground arc for the progress
    const foregroundArc = (innerRadius: number, outerRadius: number, percentage: number) => arc({
      innerRadius,
      outerRadius,
      startAngle: 0,
      endAngle: (percentage / 100) * 2 * Math.PI
    });
  
    const ringWidth = 10; // Set the ring width
    const gap = 5; // Set the gap between rings
  
    const chartData = [
      { label: 'Northeast', percentage: this.regionPercentages.northeast, color: '#ff0000' },
      { label: 'Midwest', percentage: this.regionPercentages.midwest, color: '#009900' },
      { label: 'South', percentage: this.regionPercentages.south, color: '#0000ff' },
      { label: 'West', percentage: this.regionPercentages.west, color: '#ffcc00' },
    ];
  
    svg.selectAll('*').remove(); // Clear previous chart elements
  
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    // Draw background arcs
    chartData.forEach((d, i) => {
      const innerRadius = radius - ((i + 1) * (ringWidth + gap));
      const outerRadius = innerRadius + ringWidth;
  
      g.append('path')
        .attr('class', 'background-arc')
        .attr('d', backgroundArc(innerRadius, outerRadius))
        .attr('fill', '#e0e0e0'); // Gray color for background arcs
  
      g.append('path')
        .attr('class', 'foreground-arc')
        .attr('d', foregroundArc(innerRadius, outerRadius, d.percentage))
        .attr('fill', d.color);
  
    });
  }

  convertTimeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  }

  convertSecondsToTime(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  computeStats(): void {
    const validRaceTimes = this.userRaces
    .map(race => race.race_time)
    .filter((time: string | null): time is string => time !== null && time !== "00:00:00");
    console.log('validRaceTimes:', validRaceTimes);

    if (validRaceTimes.length > 0) {
      const raceTimesInSeconds = validRaceTimes.map(time => this.convertTimeToSeconds(time));
      const minTimeInSeconds = Math.min(...raceTimesInSeconds);
      const avgTimeInSeconds = raceTimesInSeconds.reduce((sum, time) => sum + time, 0) / raceTimesInSeconds.length;

      this.pr = this.convertSecondsToTime(minTimeInSeconds);
      this.averagePace = this.convertSecondsToTime(avgTimeInSeconds);
    }
  }
  
  
  
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sanitizeUrl(url: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }


}

