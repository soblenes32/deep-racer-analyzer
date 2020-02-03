import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectionComponent } from './image-selection.component';

describe('ImageSelectionComponent', () => {
  let component: ImageSelectionComponent;
  let fixture: ComponentFixture<ImageSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
