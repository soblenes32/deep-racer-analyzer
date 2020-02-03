import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyInspectionComponent } from './policy-inspection.component';

describe('PolicyInspectionComponent', () => {
  let component: PolicyInspectionComponent;
  let fixture: ComponentFixture<PolicyInspectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyInspectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
