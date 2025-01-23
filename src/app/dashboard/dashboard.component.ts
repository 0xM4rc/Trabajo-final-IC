import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceTrackerComponent } from '../device-tracker/device-tracker.component';
import { MapComponent } from '../arduino-map-tracking/arduino-map-tracking.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, DeviceTrackerComponent, MapComponent]
})
export class DashboardComponent {
  currentView: 'map' | 'table' = 'map';  // Vista predeterminada

  switchView(view: 'map' | 'table') {
    this.currentView = view;
  }

  currentDate(): string {
    return new Date().toLocaleString();
  }
  
}
