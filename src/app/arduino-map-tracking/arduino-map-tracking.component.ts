import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataRecord, MqttDataService } from '../services/mqtt-data.service';

L.Icon.Default.mergeOptions({
  shadowUrl: 'media/marker-shadow.png'
});


@Component({
  selector: 'app-arduino-map-tracking',
  standalone: true,
  templateUrl: './arduino-map-tracking.component.html',
  styleUrls: ['./arduino-map-tracking.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: L.Map;
  private markers: { [id: string]: L.Marker } = {}; // Diccionario para los marcadores
  data: DataRecord[] = [];

  constructor(private dataService: MqttDataService) {}

  ngOnInit(): void {
    this.fetchDataPeriodically();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('No se encontró el contenedor del mapa.');
      return;
    }

    this.map = L.map(this.mapContainer.nativeElement).setView([28.128619, -15.436333], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);
  }

  private fetchDataPeriodically(): void {
    setInterval(() => {
      this.dataService.getAllLatestData().subscribe(
        (records) => {
          this.data = records;
          this.updateMarkers();
        },
        (error) => {
          console.error('Error obteniendo datos:', error);
        }
      );
    }, 5000);
  }

  private updateMarkers(): void {
    if (!this.map) {
      console.error('El mapa no está inicializado correctamente.');
      return;
    }

    this.data.forEach(record => {
      const id = record.identifier;
      const latLng = L.latLng(record.latitude, record.longitude);
      const popupContent = `<b>ID:</b> ${id} <br> <b>Timestamp:</b> ${new Date(record.timestamp).toLocaleString()}`;

      if (!this.markers[id]) {
        // Si el marcador no existe, lo creamos
        this.markers[id] = L.marker(latLng)
          .addTo(this.map)
          .bindPopup(popupContent);
      } else {
        // Si ya existe, simplemente actualizamos su posición y popup
        this.markers[id].setLatLng(latLng).bindPopup(popupContent);
      }
    });

    // Ajustar la vista si hay marcadores nuevos
    const markerBounds = L.latLngBounds(Object.values(this.markers).map(marker => marker.getLatLng()));
    if (Object.keys(this.markers).length > 0) {
      this.map.fitBounds(markerBounds, { padding: [50, 50] });
    }
  }
}
