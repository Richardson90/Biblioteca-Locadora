class Item {
    constructor(titulo) {
        this.titulo = titulo;
        this.disponivel = true;
    }
    emprestar() {
        if (this.disponivel) {
            this.disponivel = false;
            return true;
        }
        return false;
    }
    devolver() {
        this.disponivel = true; 
    }
}

class Livro extends Item {}
class Filme extends Item {}

class Usuario {
    constructor(nome) {
        this.nome = nome;
        this.itensEmprestados = [];
    }
    pegarItem(item) {
        if (item.emprestar()) {
            this.itensEmprestados.push(item);
            console.log(`${this.nome} emprestou: ${item.titulo}`);
        } else{
            console.log(`O item "${item.titulo}" não está disponível.`);
        }
    }
    devolverItem(item) {
        const indice = this.itensEmprestados.indexOf(item);
        if (indice >= 0) {
            this.itensEmprestados.splice(indice, 1);
            item.devolver();
            console.log(`${this.nome} devolveu: ${item.titulo}`);
        } else {
            console.log(`Esse item não foi emprestado por ${this.nome}`);
        }
    }
    listarItens() {
        if(this.itensEmprestados.length === 0) {
            console.log(`${this.nome} não possui itens emprestados.`);
        } else {
            console.log(`Itens de ${this.nome}:`);
            this.itensEmprestados.forEach(i => console.log(` - ${i.titulo}`));
        }
    }
}

class Biblioteca {
    constructor() {
        this.livros = [];
    }
    adicionarLivro(livro) {
        this.livros.push(livro);
    }
    listarLivros() {
        console.log("===Livros===");
        this.livros.forEach(l => console.log(`${l.titulo} - ${l.disponivel}`));
    }
}

class Locadora {
    constructor() {
        this.filmes = [];
    }
    adicionarFilme(filme) {
        this.filmes.push(filme);
    }
    listarFilmes() {
        console.log("===Filmes===");
        this.filmes.forEach(f => console.log(`${f.titulo} - ${f.disponivel}`));
    }
}

const biblioteca = new Biblioteca();
const locadora = new Locadora();
const usuarios = [];

biblioteca.adicionarLivro(new Livro("O Senhor dos Anéis"));
biblioteca.adicionarLivro(new Livro("Dom Casmurro"));
locadora.adicionarFilme(new Filme("Matrix"));
locadora.adicionarFilme(new Filme("Interestelar"));

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function menu() {
  console.log(`\n=== Menu ===
    1. Adicionar usuário
    2. Listar livros
    3. Listar filmes
    4. Emprestar item
    5. Devolver item
    6 Listar itens de usuário
    0. Sair`);
      rl.question("Escolha uma opção: ", opcao => {
        switch(opcao){
          case '1':
            rl.question("Nome do usuário: ", nome =>{
              usuarios.push(new Usuario(nome));
              console.log(`Usuário ${nome} adiconado!`);
              menu();
            });
            break;
          case '2':
            biblioteca.listarLivros();
            menu();
            break;
          case '3':
            locadora.listarFilmes();
            menu();
            break;
          case '4':
            emprestarItem();
            break;
          case '5':
            devolverItem();
            break;
          case '6':
            listarItensUsuario();
            break;
          case '0':
            console.log("Encerrando...");
            rl.close();
            break;
          default:
            console.log("Opção inválida!");
            menu();
            
          }
      });
}

function selecionarUsuario(callback) {
  if (usuarios.length === 0) {
    console.log("Nenhum usuário cadastrado.");
    return menu();
  }
  console.log("Usuários: ");
  usuarios.forEach((u, i) => console.log(`${i} - ${u.nome}`));
  rl.question("Escolha o índice do usuário: ", indice => {
    const user = usuarios[parseInt(indice)];
    if (user) callback(user); else {console.log('Usuário inválido.'); menu();}
  });
}

function emprestarItem() {
  selecionarUsuario(user => {
    console.log("1. Livro 2. Filme");
    rl.question("Tipo de item: ", tipo => {
      if (tipo === "1") {
        biblioteca.listarLivros();
        rl.question("índice do livro: ", i => {
          const livro = biblioteca.livros[parseInt(i)];
          if (livro) user.pegarItem(livro);
          menu();
        });
      } else if (tipo === "2") {
        locadora.listarFilmes();
        rl.question("Índice do Filme: ", i => {
          const filme = locadora.filmes[parseInt(i)];
          if (filme) user.pegarItem(filme);
          menu();
        });
      } else {
        console.log("Tipo inválido!");
        menu();
      }
    });
  });
}

function devolverItem() {
  selecionarUsuario(user => {
    user.listarItens();
    rl.question("Índice do item para devolver: ", i => {
      const item = user.itensEmprestados[parseInt(i)];
      if (item) user.devolverItem(item);
      menu();
    });
  });
}

function listarItensUsuario() {
  selecionarUsuario(user => {
    user.listarItens();
    menu();
  });
}

menu();