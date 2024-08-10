import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRacesComponent } from './my-races.component';

describe('MyRacesComponent', () => {
  let component: MyRacesComponent;
  let fixture: ComponentFixture<MyRacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRacesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyRacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
