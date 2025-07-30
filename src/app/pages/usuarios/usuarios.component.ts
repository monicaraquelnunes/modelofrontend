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
  usuariosFiltrados: Usuario[] = [];
  filtroAtivo: 'todos' | 'ativos' | 'inativos' = 'todos';
  colunasExibidas: string[] = ['nome', 'email', 'cpf', 'telefone', 'ativo', 'acoes'];


  // Objeto usado tanto para cadastro quanto para edição
  novoUsuario: Usuario = {
    nome: '',
    email: '',
    cpf: '',
    endereco: '',
    telefone: '',
    ativo: true // padrão como ativo
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
      next: (dados) => {
        this.usuarios = dados;
        this.aplicarFiltro();
      },
      error: () => this.snackBar.open('Erro ao carregar usuários.', 'Fechar', { duration: 3000 })
    });
  }

  aplicarFiltro(): void {
    switch (this.filtroAtivo) {
      case 'ativos':
        this.usuariosFiltrados = this.usuarios.filter(u => u.ativo);
        break;
      case 'inativos':
        this.usuariosFiltrados = this.usuarios.filter(u => !u.ativo);
        break;
      default:
        this.usuariosFiltrados = this.usuarios;
    }
  }

  setFiltro(valor: 'todos' | 'ativos' | 'inativos'): void {
    this.filtroAtivo = valor;
    this.aplicarFiltro();
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
      telefone: '',
      ativo: true
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

  ativar(usuario: Usuario): void {
    if (!usuario.id) return;
    this.usuarioService.atualizarStatus(usuario.id, true).subscribe({
      next: () => {
        this.snackBar.open('Usuário ativado com sucesso!', 'Fechar', { duration: 3000 });
        this.listar();
      },
      error: () => this.snackBar.open('Erro ao ativar usuário.', 'Fechar', { duration: 3000 })
    });
}

  inativar(usuario: Usuario): void {
    if (!usuario.id) return;
    this.usuarioService.atualizarStatus(usuario.id, false).subscribe({
      next: () => {
        this.snackBar.open('Usuário inativado com sucesso!', 'Fechar', { duration: 3000 });
        this.listar();
      },
      error: () => this.snackBar.open('Erro ao inativar usuário.', 'Fechar', { duration: 3000 })
    });
  }

  // Esse método inverte o status atual do usuário (true para false, ou false para true), atualiza no backend, mostra uma mensagem e recarrega a lista.
  alternarStatus(usuario: Usuario): void {
    if (!usuario.id) return;

    const novoStatus = !usuario.ativo;

    this.usuarioService.atualizarStatus(usuario.id, novoStatus).subscribe({
      next: () => {
        const msg = novoStatus ? 'Usuário ativado com sucesso!' : 'Usuário inativado com sucesso!';
        this.snackBar.open(msg, 'Fechar', { duration: 3000 });
        this.listar();
      },
      error: () => this.snackBar.open('Erro ao atualizar status do usuário.', 'Fechar', { duration: 3000 })
    });
  }




}
