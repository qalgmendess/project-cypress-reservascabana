describe('Reserva com seleção de datas', () => {
    it('Valida ações e informações da acomodação "Pousada das Andorinhas Lago da Colina"', () => {
        // Gerar datas futuras (check-in daqui a 3 dias, estadia de 3 noites)
        const hoje = new Date();
        const checkin = new Date(hoje);
        checkin.setDate(checkin.getDate() + 3);
        const checkout = new Date(checkin);
        checkout.setDate(checkout.getDate() + 3); // 3 diárias

        const diaCheckin = checkin.getDate();
        const diaCheckout = checkout.getDate();

        const formatarData = (data) => {
            const dia = String(data.getDate()).padStart(2, '0');
            const mes = String(data.getMonth() + 1).padStart(2, '0');
            const ano = data.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        const dataCheckinFormatada = formatarData(checkin);
        const dataCheckoutFormatada = formatarData(checkout);

        cy.visit('https://cabanaslagodacolina.com.br/reservas/inicio');

        // Selecionar datas
        cy.get('input[matstartdate]').click();
        cy.get('.mat-calendar-body-cell-content').contains(`${diaCheckin}`).click();
        cy.get('.mat-calendar-body-cell-content').contains(`${diaCheckout}`).click();

        // Clicar em "Pesquisar"
        cy.contains('button', 'Pesquisar').click();

        // Esperar resultado da busca
        cy.contains('h5', 'Pousada das Andorinhas Lago da Colina', { timeout: 10000 }).should('be.visible');

        // Validar dados exibidos
        cy.contains('h5', 'Pousada das Andorinhas Lago da Colina')
            .parents('app-card-lodge')
            .within(() => {
                // Validar valor da diária
                cy.contains('R$ 250,00 ').should('exist');

                // Validar taxa
                cy.contains('Taxa + R$ 30,00 ').should('exist');

                // Validar valor total: 3 diárias x 250 = 750 + 30 = 780
                cy.contains(' 3 (diárias) - R$ 780,00').should('exist');

                // Validar datas exibidas
                cy.contains(`${dataCheckinFormatada} à ${dataCheckoutFormatada}`).should('exist');

                // Clicar em Ver detalhes
                cy.contains('Ver detalhes').click();
            });

        // Validar que página de detalhes carregou
        cy.url().should('include', '/detalhes-acomodacao/');

        // Voltar à listagem
        cy.go('back');

        // Selecionar novamente a acomodação e clicar em Escolher
        cy.contains('h5', 'Pousada das Andorinhas Lago da Colina')
            .parents('app-card-lodge')
            .within(() => {
                cy.contains('Escolher acomodação').click();
            });

        // Validar redirecionamento para página de resumo
        cy.url().should('include', '/selecionar-acomodacao/');

        // Voltar mais uma vez se necessário
        cy.go('back');
    });


});
