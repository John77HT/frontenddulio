import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  arrayUser: any[] = []; // Array para almacenar usuarios
  nuevoUsuarioForm: FormGroup;

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    // Inicializa el formulario con validaciones
    this.nuevoUsuarioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(1)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] // Se asegura que el teléfono tenga 10 dígitos
    });
  }

  ngOnInit(): void {
    this.fetch(); // Carga la lista de usuarios al iniciar
  }

  // Método para obtener la lista de usuarios
  fetch(): void {
    this.usuarioService.fetchUser().subscribe(
      (result: any) => {
        this.arrayUser = result;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  // Método para crear un nuevo usuario
  createUser(): void {
    if (this.nuevoUsuarioForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    // El nuevo usuario no necesita asignar un id_usuario, lo maneja el backend
    const nuevoUsuario = {
      ...this.nuevoUsuarioForm.value,
    };

    this.usuarioService.postUser(nuevoUsuario).subscribe(
      (result) => {
        console.log('Usuario creado:', result);
        this.arrayUser.push(result); // Agrega el nuevo usuario al array local
        this.nuevoUsuarioForm.reset(); // Resetea el formulario
        alert('Usuario creado exitosamente.');
      },
      (error) => {
        console.error('Error al crear usuario:', error);
        alert('Error al crear usuario. Por favor, inténtalo de nuevo.');
      }
    );
  }
}
