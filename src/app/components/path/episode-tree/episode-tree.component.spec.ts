import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeTreeComponent } from './episode-tree.component';

describe('EpisodeTreeComponent', () => {
  let component: EpisodeTreeComponent;
  let fixture: ComponentFixture<EpisodeTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
