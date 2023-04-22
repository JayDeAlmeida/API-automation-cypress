/// <reference types="cypress"/>
import contratos from '../contracts/produtos.contracts'

var link = 'http://localhost:3000/'
describe('teste da funcionalidade produtos', () => {
    let token
    before(() => {
        cy.token('jay@qa.com.br', 'teste').then(bearer => { token = bearer })
    });

    it.only('deve validar contrato de produtos', () => {
        cy.request('produtos').then(response =>{
            return contratos.validateAsync(response.body)
        })
    });
    it('listar produtos', () => {
        cy.request({
            method: 'GET',
            url: link + 'produtos'
        }).then((response) => {
           //(a criação de produtos dinamicos altera a lista)
           //expect(response.body.produtos[0].nome).to.equal('Logitech MX Vertical'),
                expect(response.status).to.equal(200),
                expect(response.body).to.have.property('produtos'),
                expect(response.duration).to.be.lessThan(20)
        })
    });
    it('cadastrar produto dinamico', () => {
        let randomNome = `produto random ${Math.random() * 100}`
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/produtos',
            body: {
                "nome": randomNome,
                "preco": 99,
                "descricao": "produto",
                "quantidade": 20
            },
            headers: {
                authorization: token
            }
        })
    });
    it('deve validar se o produto já existe', () => {
        cy.cadastrarProduto(token, 'Nintendo Switch', 2200, 'Console', 200)
            .then((response) => {
                expect(response.status).to.equal(400),
                    expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });
    it('deve editar as informações de um produto', () => {
        cy.request('produtos').then((response) => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                headers: {
                    authorization: token
                },
                url: `produtos/${id}`,
                body: {
                    "nome": "Produto Editado",
                    "preco": 99,
                    "descricao": "também editei aqui",
                    "quantidade": 20
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });
    it('deve deletar um produto cadastrado', () => {
        let randomNome = `produto random ${Math.random() * 100}`
        cy.cadastrarProduto(token, randomNome, 200, 'produto', 30)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: {
                    authorization: token
                }
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });
});