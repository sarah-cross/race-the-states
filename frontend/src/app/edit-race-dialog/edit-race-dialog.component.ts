import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { State } from '../models/state';
import { RaceService } from '../race.service';

@Component({
  selector: 'app-edit-race-dialog',
  templateUrl: './edit-race-dialog.component.html',
  styleUrls: ['./edit-race-dialog.component.css']
})
export class EditRaceDialogComponent implements OnInit {
  raceForm: FormGroup;
  states: State[] = [];

  constructor(
    private raceService: RaceService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditRaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.raceForm = this.fb.group({
      raceName: [data.race_name || '', Validators.required],
      raceDate: [data.race_date ? new Date(data.race_date) : null],
      city: [data.city || ''],
      state: [null],
      hours: [this.extractTime(data.race_time || '').hours],
      minutes: [this.extractTime(data.race_time || '').minutes],
      seconds: [this.extractTime(data.race_time || '').seconds],
      notes: [data.race_notes || ''],
      images: [data.images || null]
    });
  }

  ngOnInit(): void {
    // Fetch states from the service
    this.raceService.getStates().subscribe(states => {
      this.states = states;
      
      // Log states to confirm they are fetched
      console.log('Fetched states:', this.states);
  
      // Set the state in the form group
      if (this.data.state) {
        console.log('this.data.state:', this.data.state);
        const selectedState = this.states.find(state => state.id === this.data.state.id);
        
        if (selectedState) {
          this.raceForm.patchValue({
            state: selectedState
          });
        }
      }
    });
  }

  extractTime(duration: string): { hours: string; minutes: string; seconds: string } {
    let hours = '00';
    let minutes = '00';
    let seconds = '00';
  
    // Check if duration is in HH:MM:SS format
    const timePartsHHMMSS = duration.match(/(\d{2}):(\d{2}):(\d{2})/);
    if (timePartsHHMMSS) {
      hours = timePartsHHMMSS[1];
      minutes = timePartsHHMMSS[2];
      seconds = timePartsHHMMSS[3];
    } else {
      // Otherwise, assume duration is in ISO 8601 duration format (PTxxHxxMxxS)
      const timePartsISO = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      if (timePartsISO) {
        hours = timePartsISO[1] ? timePartsISO[1].slice(0, -1).padStart(2, '0') : '00';
        minutes = timePartsISO[2] ? timePartsISO[2].slice(0, -1).padStart(2, '0') : '00';
        seconds = timePartsISO[3] ? timePartsISO[3].slice(0, -1).padStart(2, '0') : '00';
      }
    }
    return { hours, minutes, seconds };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.raceForm.valid) {
      const hours = this.raceForm.value.hours || '00';
      const minutes = this.raceForm.value.minutes || '00';
      const seconds = this.raceForm.value.seconds || '00';
      const duration = `PT${hours}H${minutes}M${seconds}S`;

      const raceData = {
        race_name: this.raceForm.value.raceName,
        race_date: this.raceForm.value.raceDate ? this.raceForm.value.raceDate.toISOString().split('T')[0] : null,
        city: this.raceForm.value.city || '',
        race_time: duration,
        race_notes: this.raceForm.value.notes || '',
        state: this.raceForm.value.state ? this.raceForm.value.state.id : null
      };

      this.dialogRef.close(raceData);
    }
  }
}

