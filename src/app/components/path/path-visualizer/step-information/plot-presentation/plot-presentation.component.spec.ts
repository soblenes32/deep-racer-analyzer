import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotPresentationComponent } from './plot-presentation.component';

describe('PlotPresentationComponent', () => {
  let component: PlotPresentationComponent;
  let fixture: ComponentFixture<PlotPresentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotPresentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
