import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardIterationReportComponent } from './reward-iteration-report.component';

describe('RewardIterationReportComponent', () => {
  let component: RewardIterationReportComponent;
  let fixture: ComponentFixture<RewardIterationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardIterationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardIterationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
