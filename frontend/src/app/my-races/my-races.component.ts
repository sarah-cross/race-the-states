import { Component, OnInit } from '@angular/core';
import { RaceService } from '../race.service';
import { Race } from '../models/race';
import { AddRaceDialogComponent } from '../add-race-dialog/add-race-dialog.component';
import { EditRaceDialogComponent } from '../edit-race-dialog/edit-race-dialog.component';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'app-my-races',
  templateUrl: './my-races.component.html',
  styleUrls: ['./my-races.component.css']
})
export class MyRacesComponent implements OnInit {

  userRaces: Race[] = [];
  regions: any[] = [
    { name: 'Northeast', races: [], statesCompleted: 0, totalStates: 9 },
    { name: 'Midwest', races: [], statesCompleted: 0, totalStates: 12 },
    { name: 'South', races: [], statesCompleted: 0, totalStates: 17 },
    { name: 'West', races: [], statesCompleted: 0, totalStates: 12 }
  ];
  numStatesRacedIn: number = 0;
  totalProgress: number = 0;

  

  constructor(
    private raceService: RaceService,
    public dialog: MatDialog, 
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getRaces();
  }

  getRaces(): void {
    this.raceService.getUserRaces().subscribe(
      (data: Race[]) => {
        this.userRaces = data;
        console.log('User races:', this.userRaces);
        this.organizeRacesByRegion();
        this.calculateProgress();
 
      },
      (error: any) => {
        console.error('Error loading user races:', error);
      }
    );
  }

  organizeRacesByRegion(): void {
    this.regions.forEach(region => {
      region.races = this.userRaces.filter(race => race.state.region === region.name);
      region.statesCompleted = new Set(region.races.map((race: { state: { name: any; }; }) => race.state.name)).size;
      console.log(`Races for region ${region.name}:`, region.races); 
    });
    
  }

  calculateProgress(): void {
    const statesRacedIn = new Set(this.userRaces.map(race => race.state.name));
    this.numStatesRacedIn = statesRacedIn.size;
    this.totalProgress = (this.numStatesRacedIn / 50) * 100;
  }
 /*
  openAddRaceDialog(): void {
    const dialogRef = this.dialog.open(AddRaceDialogComponent, {
      width: '600px',
      data: {} // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result, e.g., refresh the race list
        console.log('New race added:', result);
      }
    });
  } */


  addRace(): void {
    const dialogRef = this.dialog.open(AddRaceDialogComponent, {
      width: '500px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const raceData = {
          race_name: result.raceName,
          city: result.city,
          state: result.state.id,
          race_date: this.datePipe.transform(result.date, 'yyyy-MM-dd'),
          race_time: result.time,
          race_notes: result.notes,
          // race_images: result.files // Remove this if you're not dealing with files
        };
        console.log('race data to be added:', raceData);
        this.raceService.addRace(raceData).subscribe(
          (response) => {
            console.log('Race added successfully:', response);
            this.getRaces();  // Reload user races to reflect the new addition
          },
          (error) => {
            console.error('Error adding race:', error);
          }
        );
      }
    });
  }
  /* 
  addRace(stateId: number): void {
    const dialogRef = this.dialog.open(AddRaceDialogComponent, {
      width: '300px',
      data: { stateId }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const raceData = {
          race_name: result.raceName,
          state: stateId,
          race_date: this.datePipe.transform(result.date, 'yyyy-MM-dd'),
          race_time: result.time,
          race_notes: result.notes,
          // race_images: result.files // Remove this if you're not dealing with files
        };
  
        this.raceService.addRace(raceData).subscribe(
          (response) => {
            console.log('Race added successfully:', response);
            this.getRaces();  // Reload user races to reflect the new addition
          },
          (error) => {
            console.error('Error adding race:', error);
          }
        );
      }
    });
  } */

  deleteRace(race: Race): void {
    if (confirm(`Are you sure you want to delete ${race.race_name}?`)) {
      this.raceService.deleteRace(race.id).subscribe(
        () => {
          // Remove race from the userRaces array
          this.userRaces = this.userRaces.filter(r => r !== race);
          this.getRaces();
          console.log(`Race ${race.race_name} deleted successfully.`);
        },
        (error) => {
          console.error('Error deleting race:', error);
        }
      );
    }
  }

  editRace(race: Race): void {
    const dialogRef = this.dialog.open(EditRaceDialogComponent, {
      width: '300px',
      data: race
    });
    console.log('editing race: ', race.id);
    console.log(race)
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.raceService.updateRace(race.id, result).subscribe(
          (response) => {
            console.log('Race updated successfully:', response);
            this.getRaces();  // Refresh the list of races
          },
          (error) => {
            console.error('Error updating race:', error);
            // Handle error appropriately (e.g., show error message)
          }
        );
      }
    });
  }
}


/* maybe will use this later for more stats 
  
  // I think we'll need this for later on the stats page. 
  // It represents percentages of each region complete. 
  calculateRegionPercentages(): void {
    const regionNames: (keyof typeof this.totalStatesByRegion)[] = ["northeast", "midwest", "south", "west"];
    
    regionNames.forEach(region => {
      const totalStates = this.totalStatesByRegion[region];
      const racedStatesInRegion = this.userRaces.filter(race => race.state.region.toLowerCase() === region).length;
  
      // Debug logs to inspect the values
      console.log(`Region: ${region}`);
      console.log(`Total States: ${totalStates}`);
      console.log(`Raced States in Region: ${racedStatesInRegion}`);
  
      // Calculate percentage
      if (totalStates > 0) {
        this.regionPercentages[region] = (racedStatesInRegion / totalStates) * 100;
      } else {
        this.regionPercentages[region] = 0; // Handle case where totalStates is 0
      }
  
      console.log(`Percentage: ${this.regionPercentages[region]}`);
    });
  }



  /* Also don't need these on the home page anymore...
  scrollLeft(): void {
    if (this.statesContainer) {
      this.statesContainer.nativeElement.scrollBy({ left: -500, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.statesContainer) {
      this.statesContainer.nativeElement.scrollBy({ left: 500, behavior: 'smooth' });
    }
  } */


    /* Not sure we need this on the home page anymore..
  addRace(stateId: number): void {
    const dialogRef = this.dialog.open(AddRaceDialogComponent, {
      width: '300px',
      data: { stateId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const raceData = {
          race_name: result.raceName,
          state: stateId,
          race_date: this.datePipe.transform(result.date, 'yyyy-MM-dd'),
          race_time: result.time,
          race_notes: result.notes,
        };

        this.raceService.addRace(raceData).subscribe(
          () => {
            this.loadStatesAndRaces();
          },
          (error) => {
            console.error('Error adding race:', error);
          }
        );
      }
    });

  import { DatePipe } from '@angular/common'; // Ensure this is imported

addRace(stateId: number): void {
  const dialogRef = this.dialog.open(AddRaceDialogComponent, {
    width: '300px',
    data: { stateId }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      const raceData: Partial<Race> = {
        race_name: result.raceName,
        state: stateId,
        race_date: this.datePipe.transform(result.date, 'yyyy-MM-dd') as unknown as Date, // Convert to Date
        race_time: result.time,
        race_notes: result.notes,
      };

      this.raceService.addRace(raceData).subscribe(
        () => {
          this.loadStatesAndRaces();
        },
        (error) => {
          console.error('Error adding race:', error);
        }
      );
    }
  });
}




  } */


  