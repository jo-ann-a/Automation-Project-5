    //Creating an issue for deleting
it('Should create an issue and validate it successfully', () => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
        cy.visit(url + '/board?modal-issue-create=true');
    });
    cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Story"]')
            .trigger('click');
        cy.get('.ql-editor').type('JPV_DESCRIPTION');
        cy.get('input[name="title"]').type('JPV_TITLE');
        cy.get('[data-testid="select:userIds"]').click();
        cy.get('[data-testid="select-option:Lord Gaben"]').click();
        cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    cy.reload();
    
    cy.contains('Issue has been successfully created.').should('not.exist');
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {

    //Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
            .should('have.length', '5')
            .first()
            .find('p')
            .contains('JPV_TITLE');
    });
});


describe('Issue opening', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('Backlog').click();
            //Finding the first issue
            cy.get('[data-testid="board-list:backlog"]').children().first().click()
            //Assert that issue detail modal window is visible
            cy.get('[data-testid="modal:issue-details"]').should('be.visible');

        });
    });


    it('Should delete an issue', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').children().contains(Text = "Delete issue").click()

        //Assert that deletion confirmation dialogue is not visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');

        //Assert that issue is deleted and not displayed on the board anymore
        cy.get('[data-testid="board-list:backlog"]').children().contains('JPV_TITLE').should('not.exist')

    });

    it('Should starting the deleting issue process, but cancelling this action', () => {
        cy.get('[data-testid="icon:trash"]').click();
        cy.get('[data-testid="modal:confirm"]').children().contains(Text = "Cancel").click()

        //Assert that deletion confirmation dialogue is not visible
        cy.get('[data-testid="modal:confirm"]').should('not.exist');

        //Assert that issue is not deleted and still displayed on the Jira board
        cy.get('[data-testid="icon:close"]').first().click();
        cy.get('[data-testid="board-list:backlog"]').should('contain', 'This is an issue of type: Task.')
    });
});