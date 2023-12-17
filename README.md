# Drip Store - BackEnd

Este é o backend para o Drip Store, uma aplicação de comércio eletrônico.

## Descrição

O Drip Store é uma plataforma de comércio eletrônico onde os usuários podem gerenciar produtos e realizar compras. Este backend fornece endpoints para realizar operações CRUD (Create, Read, Update, Delete) para usuários, produtos, marcas, banners, categorias dentre outras.

## Endpoints

### Usuários

#### Listar Todos os Usuários

- **Endpoint:** `/api/users`
- **Método:** GET
- **Descrição:** Retorna a lista de todos os usuários cadastrados.

#### Buscar Usuário por ID

- **Endpoint:** `/api/users/:id`
- **Método:** GET
- **Descrição:** Retorna as informações do usuário correspondente ao ID fornecido.

#### Criar Novo Usuário

- **Endpoint:** `/api/users`
- **Método:** POST
- **Descrição:** Cria um novo usuário com base nos dados fornecidos.
- **Body:**
```
{
    name: string,
    email: string,
    password: sring,
    level: default 1
}
```

#### Atualizar Usuário

- **Endpoint:** `/api/users/:id`
- **Método:** PUT
- **Descrição:** Atualiza as informações do usuário correspondente ao ID fornecido.
- **Body:**
```
{
    name?: string,
    email?: string,
    password?: sring,
    level?: default 1
}
```


#### Remover Usuário

- **Endpoint:** `/api/users/:id`
- **Método:** DELETE
- **Descrição:** Remove o usuário correspondente ao ID fornecido.

### Produtos

#### Listar Todos os Produtos

- **Endpoint:** `/api/products`
- **Método:** GET
- **Descrição:** Retorna a lista de todos os produtos cadastrados.

#### Buscar Produto por ID

- **Endpoint:** `/api/products/:id`
- **Método:** GET
- **Descrição:** Retorna as informações do produto correspondente ao ID fornecido.

#### Criar Novo Produto

- **Endpoint:** `/api/products`
- **Método:** POST
- **Descrição:** Cria um novo produto com base nos dados fornecidos.

#### Atualizar Produto

- **Endpoint:** `/api/products/:id`
- **Método:** PUT
- **Descrição:** Atualiza as informações do produto correspondente ao ID fornecido.

#### Remover Produto

- **Endpoint:** `/api/products/:id`
- **Método:** DELETE
- **Descrição:** Remove o produto correspondente ao ID fornecido.

## Configuração

Para executar este projeto localmente, siga as etapas:

1. Clone este repositório.
2. Instale as dependências usando `npm install`.
3. Configure as variáveis de ambiente, se necessário.
4. Execute o servidor usando `npm start`.

Certifique-se de ter um ambiente Node.js configurado e um banco de dados compatível para o funcionamento adequado deste backend.

## Tecnologias Utilizadas

- Node.js
- Typescript
- Express.js
- Mysql (MariaDB)
- Insomnia
- Sequelize
- Swagger

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Autor

[David_Brito] davidbrito.carneiro458@gmail.com

