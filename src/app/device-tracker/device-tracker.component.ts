import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataRecord, MqttDataService } from '../services/mqtt-data.service';

@Component({
  selector: 'app-device-tracker',
  standalone: true,
  templateUrl: './device-tracker.component.html',
  styleUrls: ['./device-tracker.component.css'],
  imports: [CommonModule]
})
export class DeviceTrackerComponent implements OnInit {
  data: DataRecord[] = [];
  availableDevices: string[] = ['E6', 'E5', 'A1', 'Todos'];
  selectedDevice: string = 'Todos'; // Dispositivo seleccionado por defecto
  title = 'Seguimiento de dispositivos Arduino';

  constructor(private dataService: MqttDataService) {}

  ngOnInit(): void {
    this.loadData(this.selectedDevice);
  }

  // Método para actualizar la selección del dispositivo
  onDeviceChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedDevice = selectedValue;
    this.loadData(this.selectedDevice);
  }

  // Cargar datos dependiendo del dispositivo seleccionado
  loadData(deviceId: string): void {
    if (deviceId === 'Todos') {
      this.dataService.getAllLatestData().subscribe((records) => {
        this.data = records;
      });
    } else {
      this.dataService.getAllDataForDevice(deviceId).subscribe((records) => {
        this.data = records;
      });
    }
  }
}
