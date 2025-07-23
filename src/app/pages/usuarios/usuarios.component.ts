import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  // Objeto usado tanto para cadastro quanto para edição
  novoUsuario: Usuario = {
    nome: '',
    email: '',
    cpf: '',
    endereco: '',
    telefone: ''
  };

  editando: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {
    this.usuarioService.listar().subscribe({
      next: (dados) => this.usuarios = dados,
      error: () => this.snackBar.open('Erro ao carregar usuários.', 'Fechar', { duration: 3000 })
    });
  }

  salvar(): void {
    if (this.editando) {
      // Atualizar
      if (!this.novoUsuario.id) {
        this.snackBar.open('ID do usuário é obrigatório para atualização.', 'Fechar', { duration: 3000 });
        return;
      }

      this.usuarioService.atualizar(this.novoUsuario).subscribe({
        next: () => {
          this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.listar();
          this.cancelar();
        },
        error: () => this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', { duration: 3000 })
      });

    } else {
      // Cadastrar
      this.usuarioService.cadastrar(this.novoUsuario).subscribe({
        next: () => {
          this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', { duration: 3000 });
          this.listar();
          this.cancelar();
        },
        error: () => this.snackBar.open('Erro ao cadastrar usuário.', 'Fechar', { duration: 3000 })
      });
    }
  }

  editar(usuario: Usuario): void {
    this.novoUsuario = { ...usuario }; // Clona o usuário para edição
    this.editando = true;
  }

  cancelar(): void {
    this.novoUsuario = {
      nome: '',
      email: '',
      cpf: '',
      endereco: '',
      telefone: ''
    };
    this.editando = false;
  }

  excluir(id: number): void {
    this.usuarioService.excluir(id).subscribe({
      next: () => {
        this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
        this.listar();
      },
      error: () => this.snackBar.open('Erro ao excluir usuário.', 'Fechar', { duration: 3000 })
    });
  }
}
