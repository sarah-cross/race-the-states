import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRaceDialogComponent } from './edit-race-dialog.component';

describe('EditRaceDialogComponent', () => {
  let component: EditRaceDialogComponent;
  let fixture: ComponentFixture<EditRaceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRaceDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditRaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
