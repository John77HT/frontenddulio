// publicacion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private apiUrl = 'https://backenddulio.onrender.com/productos'; // Cambia la URL según tu configuración

  constructor(private http: HttpClient) { }

  // Método para obtener todos los productos
  fetchProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para crear un nuevo producto
  postProducto(producto: any): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  // Método para actualizar un producto
  updateProducto(id: string, producto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  // Método para eliminar un producto
  deleteProducto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Método para obtener un producto por ID
  getProductoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
