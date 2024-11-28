import { Component, OnInit } from '@angular/core';
import { UsuarioService }  from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule, FormGroup, FormBuilder} from '@angular/forms'; 
import { subscribe } from 'diagnostics_channel';
import{Login} from '../models/usuario';



@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  arrayUser: any[] = []; // Cambia 'any' a 'Usuario'
  currentUser: any; // Cambia 'any' a 'Usuario'
  nuevoUsuarioForm: FormGroup; 
  usuarioEnEdicion: any = null; // Usuario en edición
  formVisible: boolean = false; // Controla la visibilidad del formulario

  constructor(public usuarioService: UsuarioService, private fb:FormBuilder) {
    this.nuevoUsuarioForm = this.fb.group({
      id_usuario:  [{value: '', disabled: true}], // Deshabilitado por defecto
      nombre: [''],
      apellido:[''],
      correo: [''],
      edad: [''],
      ciudad: [''],
    fecha_nacimiento:[''],
    password:['']
      
    });
    
  }

 

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.usuarioService.fetchUser().subscribe(result => {
      this.arrayUser = result; // Asegúrate de que result sea del tipo Usuario[]
    });
  }
  actualizarUsuario(): void {
    const usuarioActualizado = this.nuevoUsuarioForm.value;
    this.usuarioService.updateUser(this.usuarioEnEdicion.id_usuario, usuarioActualizado).subscribe(
      (result) => {
        console.log('Usuario actualizado:', result);
        this.cancelarEdicion(); // Llama a cancelar edición después de actualizar
        this.fetch(); // Refresca la lista de usuarios
        alert('Usuario actualizado con éxito.');

        // Desplazarse hacia la parte superior
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error) => {
        console.error('Error actualizando usuario:', error);
        alert('Error al actualizar el usuario.');
      }
    );
  }
  
  // Método para eliminar un usuario
  deleteUser(id_usuario: string): void{ // Asegúrate de que id_usuario sea del tipo correcto
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.deleteUser(id_usuario).subscribe(
        () => {
          // Filtra y elimina el usuario de la lista utilizando el id_usuario
          this.arrayUser = this.arrayUser.filter(user => user.id_usuario !== id_usuario);
          alert('Usuario eliminado con éxito.');
          this.fetch();
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
          alert('Error al eliminar el usuario. Por favor, intenta de nuevo.');
        }
      );
    }
  }

  editarUsuario(usuario: any): void {
    this.usuarioEnEdicion = usuario;
    this.nuevoUsuarioForm.patchValue(usuario);
    this.formVisible = true;

    // Desplazarse hacia el formulario
    setTimeout(() => {
      const formElement = document.getElementById('formularioEdicion');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  cancelarEdicion(): void {
    this.usuarioEnEdicion = null;
    this.nuevoUsuarioForm.reset();
    this.formVisible = false; // Oculta el formulario al cancelar
  }
 
  
}




