import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDetailsDialogComponent } from './race-details-dialog.component';

describe('RaceDetailsDialogComponent', () => {
  let component: RaceDetailsDialogComponent;
  let fixture: ComponentFixture<RaceDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaceDetailsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaceDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
