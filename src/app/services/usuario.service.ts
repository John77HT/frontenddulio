// usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'https://backenddulio.onrender.com/clientes'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) {}

  /// Método para obtener todos los usuarios
  fetchUser(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo usuario
  postUser(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // Método para actualizar un usuario
  updateUser(id: string, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  // Método para eliminar un usuario
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para obtener un usuario por ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}