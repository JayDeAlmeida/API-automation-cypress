/// <reference types="cypress"/>
var link = 'http://localhost:3000/'

describe('login - teste da API serveRest', () => {

    
    it('Deve fazer login com sucesso', () => {
     
        cy.request({

            method:'POST',
            url: link + 'login',
            body: {
                     "email": "jay@qa.com.br",
                     "password": "teste"
            }
            }).then((response)=> {
                expect(response.status).to.equal(200),
                expect(response.body.message).to.equal('Login realizado com sucesso')
                cy.log(response.body.authorization)
        })
    });

});