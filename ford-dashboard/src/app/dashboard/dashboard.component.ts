import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle, VehicleData } from '../models/vehicle.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  vehicles: Vehicle[] = [];

  vehicleSelecionado: Vehicle | null = null;

  vinInput: string = '';

  vehicleData: VehicleData | null = null;
  vinErro: string = '';
  vinCarregando: boolean = false;

  private vinSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  menuAberto: boolean = false;
  userMenuAberto: boolean = false;

  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarVeiculos();
    this.configurarVinSearch();
  }

  carregarVeiculos(): void {
    this.vehicleService.getVehicles().pipe(
      map(vehicles => vehicles)
    ).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        if (vehicles.length > 0) {
          this.vehicleSelecionado = vehicles[0];
        }
      },
      error: () => {
        console.error('Erro ao carregar veículos');
      }
    });
  }

  onVehicleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    const encontrado = this.vehicles.find(v => v.id === id);
    this.vehicleSelecionado = encontrado || null;
  }

  // Configuração RxJS: debounceTime, distinctUntilChanged, filter
  configurarVinSearch(): void {
    this.vinSubject.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      filter(vin => vin.trim().length >= 10),
      map(vin => vin.trim().toUpperCase())
    ).subscribe(vin => {
      this.buscarVehicleData(vin);
    });
  }

  onVinInput(vin: string): void {
    this.vinErro = '';
    this.vehicleData = null;
    this.vinSubject.next(vin);
  }

  buscarVehicleData(vin: string): void {
    this.vinCarregando = true;
    this.vehicleService.getVehicleData(vin).subscribe({
      next: (data) => {
        this.vehicleData = data;
        this.vinCarregando = false;
        this.vinErro = '';
      },
      error: (err) => {
        this.vinErro = err.error?.message || 'Código VIN não encontrado.';
        this.vehicleData = null;
        this.vinCarregando = false;
      }
    });
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.vinSubject.complete();
  }
}
