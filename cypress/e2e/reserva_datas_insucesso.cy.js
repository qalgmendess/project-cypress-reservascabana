describe('Reserva com seleção de datas de insucesso', () => {

    it('Exibe erro ao selecionar período de 1 dia com check-in na sexta-feira ou sábado', () => {
        const hoje = new Date();

        const validarErroParaDia = (diaSemanaAlvo) => {
            const dataCheckin = new Date(hoje);

            // Avança até o dia da semana desejado (5 = sexta, 6 = sábado)
            while (dataCheckin.getDay() !== diaSemanaAlvo) {
                dataCheckin.setDate(dataCheckin.getDate() + 1);
            }

            const dataCheckout = new Date(dataCheckin);
            dataCheckout.setDate(dataCheckout.getDate() + 1);

            const diaCheckin = dataCheckin.getDate();
            const diaCheckout = dataCheckout.getDate();

            cy.visit('https://cabanaslagodacolina.com.br/reservas/inicio');

            // Abrir calendário
            cy.get('input[matstartdate]').click();

            // Selecionar check-in
            cy.get('.mat-calendar-body-cell-content')
                .contains(`${diaCheckin}`)
                .click();

            // Selecionar check-out
            cy.get('.mat-calendar-body-cell-content')
                .contains(`${diaCheckout}`)
                .click();

            // Validar mensagem de erro específica
            cy.get('.mat-mdc-form-field-hint-wrapper')
                .should('be.visible')
                .and('contain.text', 'Mínimo de 2 dias para check-in na sexta ou sábado');
        };

        // Validar para sexta-feira (5)
        validarErroParaDia(5);

        // Validar para sábado (6)
        validarErroParaDia(6);
    });

    it('Exibe erro ao selecionar check-in e check-out no mesmo dia', () => {
        const hoje = new Date();
        const dataCheckin = new Date(hoje);
        dataCheckin.setDate(dataCheckin.getDate() + 3); // qualquer dia futuro

        const dia = dataCheckin.getDate();

        cy.visit('https://cabanaslagodacolina.com.br/reservas/inicio');

        cy.get('input[matstartdate]').click();
        cy.get('.mat-calendar-body-cell-content').contains(`${dia}`).click();
        cy.get('.mat-calendar-body-cell-content').contains(`${dia}`).click(); // mesmo dia

        cy.contains('Check-out deve ser realizado no mínimo 1 dia após o check-in')
            .should('be.visible');
    });

    it('Exibe erro ao selecionar check-out anterior ao check-in', () => {
        const hoje = new Date();

        // Começa com 2 dias à frente
        const dataCheckin = new Date(hoje);
        dataCheckin.setDate(dataCheckin.getDate() + 2);

        // Garante que o check-in caia de domingo (0) a quinta (4)
        while ([5, 6].includes(dataCheckin.getDay())) {
            dataCheckin.setDate(dataCheckin.getDate() + 1);
        }

        // Check-out será 1 dia antes do check-in, podendo ser hoje
        const dataCheckout = new Date(dataCheckin);
        dataCheckout.setDate(dataCheckin.getDate() - 1);

        const diaCheckin = dataCheckin.getDate();
        const diaCheckout = dataCheckout.getDate();

        cy.visit('https://cabanaslagodacolina.com.br/reservas/inicio');

        // Abrir o calendário
        cy.get('input[matstartdate]').click();

        // Selecionar data de check-in
        cy.get('.mat-calendar-body-cell-content')
            .contains(`${diaCheckin}`)
            .click();

        // Selecionar data de check-out (anterior ao check-in, pode ser hoje)
        cy.get('.mat-calendar-body-cell-content')
            .contains(`${diaCheckout}`)
            .click();

        // Validar a mensagem de erro
        cy.get('.mat-mdc-form-field-hint')
            .should('be.visible')
            .and('contain.text', 'Selecione pelo menos o dia seguinte');
    });





});
