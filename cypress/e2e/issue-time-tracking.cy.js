describe('Time tracking tests: Time estimation & Time logging', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
        });

        //Creating a new issue
        cy.get('[data-testid="icon:plus"]').click();
        cy.get('[data-testid="modal:issue-create"]').should('be.visible').within(() => {
            cy.get('[data-testid="select:type"]').click();
            cy.get('[data-testid="select-option:Story"]').trigger('click');
            cy.get('.ql-editor').type('Test for time tracking functionalities');
            cy.get('input[name="title"]').type('An issue for time tracking tests');
            cy.get('[data-testid="select:userIds"]').click();
            cy.get('[data-testid="select-option:Pickle Rick"]').click();
            cy.get('button[type="submit"]').click();
        });

        cy.get('[data-testid="modal:issue-create"]').should('not.exist');
        cy.contains('Issue has been successfully created.').should('be.visible');
        cy.reload();
        cy.contains('Issue has been successfully created.').should('not.exist');
        cy.get('[data-testid="board-list:backlog').should('be.visible')
            .and('contain', 'An issue for time tracking tests');
    });

    it('Time estimation functionalities', () => {

        //Add estimation
        cy.contains('An issue for time tracking tests').click();
        cy.contains('No time logged').should('be.visible');

        cy.contains('Original Estimate (hours)').should('not.have.value');

        cy.get('input[placeholder="Number"]').type('10');
        cy.contains('10h estimated').should('be.visible');

        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog').should('be.visible')
            .and('contain', 'An issue for time tracking tests');

        cy.contains('An issue for time tracking tests').click();
        cy.get('input[placeholder="Number"]').should('have.value', '10').and('be.visible');

        //Update estimation
        cy.get('input[placeholder="Number"]').clear().type('20');

        cy.contains('20h estimated').should('be.visible');

        cy.get('[data-testid="icon:close"]').first().click();

        cy.get('[data-testid="board-list:backlog').should('be.visible')
            .and('contain', 'An issue for time tracking tests');

        cy.contains('An issue for time tracking tests').click();
        cy.get('input[placeholder="Number"]').should('have.value', '20').and('be.visible');

        //Remove estimation
        cy.get('input[placeholder="Number"]').clear();
        cy.contains('Original Estimate (hours)').should('not.have.value');

        cy.get('[data-testid="icon:close"]').first().click();

        cy.get('[data-testid="board-list:backlog').should('be.visible')
            .and('contain', 'An issue for time tracking tests');
        cy.contains('An issue for time tracking tests').click();
        cy.contains('No time logged').should('be.visible');
        cy.contains('Original Estimate (hours)').should('not.have.value');
    });

    it('Time logging & removing', () => {

        //Log time
        cy.contains('An issue for time tracking tests').click();
        cy.contains('No time logged').click();

        cy.get('[data-testid="modal:tracking"]').should('be.visible')
            .should('contain', 'Time spent (hours)')
            .and('contain', 'Time remaining (hours)');

        cy.get('input[placeholder="Number"]').eq(1).clear().type('2');
        cy.get('input[placeholder="Number"]').eq(2).clear().type('5');
       
        cy.contains('button', 'Done').click();
      
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
        cy.contains('2h logged').should('be.visible');
        cy.contains('5h remaining').should('be.visible');
        cy.contains('No time logged').should('not.exist');

        //Remove logged time
        cy.get('[data-testid="icon:stopwatch"]').click();
        
        cy.get('[data-testid="modal:tracking"]').should('be.visible')
        
        cy.get('input[placeholder="Number"]').eq(1).clear();
        cy.get('input[placeholder="Number"]').eq(2).clear();
        
        cy.contains('button', 'Done').click();
        
        cy.get('[data-testid="modal:issue-details"]').should('be.visible');
       
        cy.contains('No time logged').should('be.visible');
        cy.contains('2h logged').should('not.exist');
        cy.contains('5h remaining').should('not.exist');
    });
});