import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindRaceComponent } from './find-race.component';

describe('FindRaceComponent', () => {
  let component: FindRaceComponent;
  let fixture: ComponentFixture<FindRaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindRaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindRaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
