import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DataRecord {
  timestamp: Date;
  identifier: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class MqttDataService {
  private dataPath = 'assets/mqtt_data_';
  private fileExtension = '.txt';
  private devices = ['E6', 'E5', 'A1'];

  constructor(private http: HttpClient) {}

  // Obtiene el último registro de cada dispositivo
  getAllLatestData(): Observable<DataRecord[]> {
    const requests = this.devices.map(deviceId =>
      this.getLatestData(deviceId).pipe(
        catchError(() => of(null))  // Manejo de errores
      )
    );
    return forkJoin(requests).pipe(
      map(results => results.filter(record => record !== null)) // Filtrar registros nulos
    );
  }

  // Obtiene el último registro de un dispositivo específico
  private getLatestData(deviceId: string): Observable<DataRecord> {
    const fileUrl = `${this.dataPath}${deviceId}${this.fileExtension}`;
    return this.http.get(fileUrl, { responseType: 'text' }).pipe(
      map((data: string) => this.parseLatestLine(data))
    );
  }

  // Obtiene todos los registros de un dispositivo específico
  getAllDataForDevice(deviceId: string): Observable<DataRecord[]> {
    const fileUrl = `${this.dataPath}${deviceId}${this.fileExtension}`;
    return this.http.get(fileUrl, { responseType: 'text' }).pipe(
      map((data: string) => this.parseAllLines(data)),
      catchError(() => of([]))  // Retorna un array vacío si hay un error
    );
  }

  // Parsea la última línea del archivo
  private parseLatestLine(rawData: string): DataRecord {
    const lines = rawData.trim().split('\n');
    return this.parseLine(lines[lines.length - 1]);
  }

  // Parsea todas las líneas del archivo
  private parseAllLines(rawData: string): DataRecord[] {
    return rawData.trim().split('\n').map(line => this.parseLine(line));
  }

  // Convierte una línea de texto en un objeto DataRecord
  private parseLine(line: string): DataRecord {
    const parts = line.split(',');
    return {
      timestamp: new Date(parts[0]),
      identifier: parts[1],
      latitude: parseFloat(parts[2]),
      longitude: parseFloat(parts[3]),
    };
  }
}
