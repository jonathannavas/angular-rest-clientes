import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import {ModalService} from './detalle/modal.service';
import {tap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {


  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  
  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) { }


  ngOnInit(){

    

    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = + params.get('page');
      if(!page){
        page=0;
      }
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            (response.content as Cliente[]).forEach(
              cliente=>{
                console.log(cliente.nombre);
            });
          })
        ).subscribe(response => {
          
          this.clientes = response.content as Cliente[]
          this.paginador = response;
          
        });
      }
    );
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(
        clienteOriginal=>{

        if(cliente.id == clienteOriginal.id){
          clienteOriginal.foto = cliente.foto;
        }
        
        return clienteOriginal;
      }) 
    })
  }

  delete(cliente: Cliente): void{
    Swal.fire({
      title: 'Estas seguro?',
      text: `Deseas eliminar al cliente ${cliente.nombre} ${cliente.apellido} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id)
        .subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente eliminado con éxito','','success'
            )
          }
        )
        
      }
    })
  }


  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
