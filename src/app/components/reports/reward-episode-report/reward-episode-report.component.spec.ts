import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardEpisodeReportComponent } from './reward-episode-report.component';

describe('RewardEpisodeReportComponent', () => {
  let component: RewardEpisodeReportComponent;
  let fixture: ComponentFixture<RewardEpisodeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardEpisodeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardEpisodeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
