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
  showPassword: boolean = false; // Controla visibilidad de la contraseña

  constructor(private usuarioService: UsuarioService, private fb: FormBuilder) {
    // Inicializa el formulario con validaciones
    this.nuevoUsuarioForm = this.fb.group({
      id_usuario: [{ value: '', disabled: true }], // No necesitas asignar ID manualmente
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(1)]],
      ciudad: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    // Elimina la lógica de obtener el último ID y crea el usuario directamente
    const nuevoUsuario = {
      ...this.nuevoUsuarioForm.value,
      // No se asigna un id_usuario, lo maneja el backend
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

  // Alterna la visibilidad de la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
