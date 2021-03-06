import { MobileRouteGuardService } from './services/mobile-route-guard/mobile-route-guard.service';
import { LogTreeNodeDatabaseService } from './services/logtreenodedatabase/log-tree-node-database.service';
import { ReportsComponent } from './components/reports/reports.component';
import { PathComponent } from './components/path/path.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';

import { RacetrackService } from './services/racetrack/racetrack.service';
import { EpisodeTreeComponent } from './components/path/episode-tree/episode-tree.component';
import { PathVisualizerComponent } from './components/path/path-visualizer/path-visualizer.component';
import { StepInformationComponent } from './components/path/path-visualizer/step-information/step-information.component';
import { PathPlotComponent } from './components/path/path-visualizer/path-plot/path-plot.component';
import { SimulationParametersComponent } from './components/path/path-visualizer/step-information/simulation-parameters/simulation-parameters.component';
import { StepDetailComponent } from './components/path/path-visualizer/step-information/step-detail/step-detail.component';
import { PlotPresentationComponent } from './components/path/path-visualizer/step-information/plot-presentation/plot-presentation.component';
import { SetupComponent } from './components/home/setup/setup.component';
import { ReportListComponent } from './components/reports/report-list/report-list.component';
import { ExportComponent } from './components/export/export.component';
import { RewardIterationReportComponent } from './components/reports/reward-iteration-report/reward-iteration-report.component';
import { RewardEpisodeReportComponent } from './components/reports/reward-episode-report/reward-episode-report.component';
import { AboutComponent } from './components/about/about.component';
import { PolicyInspectionComponent } from './components/policy-inspection/policy-inspection.component';
import { ModelListComponent } from './components/policy-inspection/model-list/model-list.component';
import { ImageSelectionComponent } from './components/policy-inspection/image-selection/image-selection.component';
import { MobileComponent } from './components/mobile/mobile.component';

const appRoutes: Routes = [
  { path: 'mobile', component: MobileComponent },
  { path: '', canActivate: [MobileRouteGuardService], children: [
    { path: 'home', component: HomeComponent },
    { path: 'path', component: PathComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'policy-inspection', component: PolicyInspectionComponent },
    { path: 'export', component: ExportComponent },
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    HomeComponent,
    PathComponent,
    ReportsComponent,
    EpisodeTreeComponent,
    PathVisualizerComponent,
    StepInformationComponent,
    PathPlotComponent,
    SimulationParametersComponent,
    StepDetailComponent,
    PlotPresentationComponent,
    SetupComponent,
    ReportListComponent,
    ExportComponent,
    RewardIterationReportComponent,
    RewardEpisodeReportComponent,
    AboutComponent,
    PolicyInspectionComponent,
    ModelListComponent,
    ImageSelectionComponent,
    MobileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSidenavModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatStepperModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,

    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [
    RacetrackService,
    LogTreeNodeDatabaseService
  ],
  entryComponents: [SetupComponent],
  bootstrap: [AppComponent]
})


export class AppModule { }
