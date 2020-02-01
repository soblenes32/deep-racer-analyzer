import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathPlotComponent } from './path-plot.component';

describe('PathPlotComponent', () => {
  let component: PathPlotComponent;
  let fixture: ComponentFixture<PathPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
