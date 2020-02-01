import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathVisualizerComponent } from './path-visualizer.component';

describe('PathVisualizerComponent', () => {
  let component: PathVisualizerComponent;
  let fixture: ComponentFixture<PathVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
