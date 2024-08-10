import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { State } from '../models/state';
import { RaceService } from '../race.service';

@Component({
  selector: 'app-add-race-dialog',
  templateUrl: './add-race-dialog.component.html',
  styleUrls: ['./add-race-dialog.component.css']
})
export class AddRaceDialogComponent implements OnInit {
  raceForm: FormGroup;
  selectedFiles: File[] = [];
  states: State[] = [];


  constructor(
    private raceService: RaceService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the form group with form controls and their default values
    this.raceForm = this.fb.group({
      raceName: ['', Validators.required],
      raceDate: [''],
      city: [''],
      state: [null, Validators.required], // State is required
      raceTime: [''],
      hours: [''],
      minutes: [''],
      seconds: [''],
      notes: [''],
      images: [null]
    });
  }

  ngOnInit(): void {
    this.raceService.getStates().subscribe(states => this.states = states);
  }

  onFileSelected(event: any): void {
    const files = FileList = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.raceForm.patchValue({ images: this.selectedFiles });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }


  onSubmit(): void {
    if (this.raceForm.valid) {
      const { raceName, raceDate, city, state, hours, minutes, seconds, raceNotes } = this.raceForm.value;
  
      let dateObj: Date | null = null;
      if (raceDate) {
        dateObj = new Date(raceDate);
        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          dateObj = null;
        }
      }
  
      // Ensure hours, minutes, and seconds are padded with leading zeros if necessary
      const duration = `PT${String(hours).padStart(2, '0')}H${String(minutes).padStart(2, '0')}M${String(seconds).padStart(2, '0')}S`;
  
      const result = {
        raceName: raceName,
        date: dateObj,
        city: city,
        state: state,
        time: duration,
        notes: raceNotes
      };
  
      this.dialogRef.close(result);
    }
  }
    

}
