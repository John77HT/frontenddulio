import { Component, OnInit } from '@angular/core';
import { PublicacionService } from '../../services/publicacion.service'; // Asegúrate de que este servicio existe
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-publicacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contenido.component.html',
  styleUrl: './contenido.component.css'
})
export class ContenidoComponent implements OnInit {
  arrayProductos: any[] = [];
  productoEnEdicion: any = null;
  nuevoProductoForm: FormGroup; 
  formVisible: boolean = false;

  constructor(private publicacionService: PublicacionService, private fb: FormBuilder) {
    this.nuevoProductoForm = this.fb.group({
      id_producto: [{ value: '', disabled: true }],
      nombre: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.fetch(); 
  }

  fetch(): void {
    this.publicacionService.fetchProductos().subscribe(result => {
      this.arrayProductos = result;
    });
  }

  crearProducto(): void {
    const nuevoProducto = this.nuevoProductoForm.value;
    this.publicacionService.postProducto(nuevoProducto).subscribe(
      (result) => {
        this.arrayProductos.push(result);
        this.nuevoProductoForm.reset();
        alert('Producto creado con éxito.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error) => {
        console.error('Error al crear producto:', error);
        alert('Error al crear el producto.');
      }
    );
  }

  editarProducto(producto: any): void {
    this.productoEnEdicion = producto;
    this.nuevoProductoForm.patchValue(producto);
    this.formVisible = true;

    setTimeout(() => {
      const formElement = document.getElementById('formularioEdicion');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  }

  actualizarProducto(): void {
    const id = this.nuevoProductoForm.get('id_producto')?.value;
    const productoActualizado = this.nuevoProductoForm.value;

    this.publicacionService.updateProducto(id, productoActualizado).subscribe(
      (result) => {
        const index = this.arrayProductos.findIndex(p => p.id_producto === id);
        if (index !== -1) {
          this.arrayProductos[index] = result;
        }
        this.cancelarEdicion();
        alert('Producto actualizado con éxito.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error) => {
        console.error('Error actualizando producto:', error);
        alert('Error al actualizar el producto.');
      }
    );
  }

  deleteProducto(id_producto: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.publicacionService.deleteProducto(id_producto).subscribe(
        () => {
          this.arrayProductos = this.arrayProductos.filter(p => p.id_producto !== id_producto);
          alert('Producto eliminado con éxito.');
        },
        error => {
          console.error('Error al eliminar el producto:', error);
          alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
        }
      );
    }
  }

  cancelarEdicion(): void {
    this.productoEnEdicion = null;
    this.nuevoProductoForm.reset();
    this.formVisible = false;
  }
}
