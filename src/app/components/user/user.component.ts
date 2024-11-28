import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  arrayUser: any[] = []; // Cambia 'any' a 'Usuario'
  currentUser: any; // Cambia 'any' a 'Usuario'
  nuevoUsuarioForm: FormGroup; 
  usuarioEnEdicion: any = null; // Usuario en edición
  formVisible: boolean = false; // Controla la visibilidad del formulario

  constructor(public usuarioService: UsuarioService, private fb: FormBuilder) {
    this.nuevoUsuarioForm = this.fb.group({
      id_usuario: [{value: '', disabled: true}], // Deshabilitado por defecto
      nombre: [''],
      email: [''],
      direccion: [''],
      telefono: ['']
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
        console.log('Cliente actualizado:', result);
        this.cancelarEdicion(); // Llama a cancelar edición después de actualizar
        this.fetch(); // Refresca la lista de clientes
        alert('Cliente actualizado con éxito.');

        // Desplazarse hacia la parte superior
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error) => {
        console.error('Error actualizando cliente:', error);
        alert('Error al actualizar el cliente.');
      }
    );
  }

  // Método para eliminar un cliente
  deleteUser(id_usuario: string): void { 
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.usuarioService.deleteUser(id_usuario).subscribe(
        () => {
          // Filtra y elimina el cliente de la lista utilizando el id_usuario
          this.arrayUser = this.arrayUser.filter(user => user.id_usuario !== id_usuario);
          alert('Cliente eliminado con éxito.');
          this.fetch();
        },
        error => {
          console.error('Error al eliminar el cliente:', error);
          alert('Error al eliminar el cliente. Por favor, intenta de nuevo.');
        }
      );
    }
  }

  editarUsuario(cliente: any): void {
    this.usuarioEnEdicion = cliente;
    this.nuevoUsuarioForm.patchValue(cliente);
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
