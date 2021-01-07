import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Bienvenido a la aplicacion en Angular 11';
  curso: string = 'Curso Spring 5 con Angular 11';
  alumno: string = 'Jonathan Navas';
}
