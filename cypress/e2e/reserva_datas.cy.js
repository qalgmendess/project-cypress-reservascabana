describe('Reserva com seleção de datas', () => {
    it('Seleciona datas de check-in e check-out no calendário e valida próxima página', () => {
        // Gerar datas dinâmicas
        const hoje = new Date();
        const dataCheckin = new Date(hoje);
        dataCheckin.setDate(dataCheckin.getDate() + 3);

        const dataCheckout = new Date(dataCheckin);
        dataCheckout.setDate(dataCheckout.getDate() + 4);

        // Extrair dia do mês para seleção no calendário
        const diaCheckin = dataCheckin.getDate();
        const diaCheckout = dataCheckout.getDate();

        // Formatar datas para validação final (dd/mm/yyyy)
        const formatarData = (data) => {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        const dataFormatadaCheckin = formatarData(dataCheckin);
        const dataFormatadaCheckout = formatarData(dataCheckout);


        cy.visit('https://cabanaslagodacolina.com.br/reservas/inicio');

        // Abrir calendário
        cy.get('input[matstartdate]').click();

        // Esperar o calendário aparecer
        cy.get('.mat-calendar-body-cell-content').should('be.visible');

        // Selecionar dia de check-in
        cy.get('.mat-calendar-body-cell-content')
            .contains(`${diaCheckin}`)
            .click();

        // Selecionar dia de check-out
        cy.contains(`${diaCheckout}`, { timeout: 6000 }) // aumenta o tempo de espera
            .should('be.visible') // garante que o botão está visível
            .click();

        // Clicar em Pesquisar
        cy.contains('button', 'Pesquisar').click();

        // Validar que a próxima tela foi carregada
        cy.url().should('include', '/listar-acomodacoes?');

        cy.get('h2.text-center', { timeout: 10000 })
            .should('contain.text', `Acomodações disponíveis para as datas: ${dataFormatadaCheckin} à ${dataFormatadaCheckout}`);

        // Validar novamente os valores exibidos nas datas no segundo formulário (com os <span>)
        cy.get('mat-date-range-input span.mat-date-range-input-mirror')
            .eq(0) // primeiro span = check-in
            .should('have.text', dataFormatadaCheckin);

        cy.get('mat-date-range-input span.mat-date-range-input-mirror')
            .eq(1) // segundo span = check-out
            .should('have.text', dataFormatadaCheckout);


    });

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




});
