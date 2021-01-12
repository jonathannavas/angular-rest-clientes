import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo: string = "Crear cliente";
  public errores: string[];

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.cargarCliente();
    this.cargarRegiones();

  }

  cargarRegiones(): void{
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
  }

  cargarCliente(): void{
    this.activatedRouter.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
  }

  create(): void{

    this.clienteService.create(this.cliente)
      .subscribe(
        cliente => {
          this.router.navigate(['/clientes']);
          swal.fire('Nuevo cliente',`El cliente: ${cliente.nombre} ha sido creado con exito` , 'success');
        }, err => {
          this.errores = err.error.errors as string[];
          console.error('Codigo del error desde el Backend: '+err.status);
          console.error(err.error.errors);
        }
      );

  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe(
      json => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado',`${json.mensaje}: ${json.cliente.nombre}`, 'success');
      }, err => {
        this.errores = err.error.errors as string[];
        console.error('Codigo del error desde el Backend: '+err.status);
        console.error(err.error.errors);
      }
    )
  }

  compararRegion(o1: Region, o2:Region):boolean {
    
    if(o1===undefined || o2===undefined){
      return true;
    }

    return o1===null || o2 === null || o1===undefined || o2 === undefined? false: o1.id===o2.id;
 
  }

}
