import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRaceDialogComponent } from './add-race-dialog.component';

describe('AddRaceDialogComponent', () => {
  let component: AddRaceDialogComponent;
  let fixture: ComponentFixture<AddRaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRaceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
