# Teste de seguranca de pagamentos

Use este checklist antes de publicar mudancas em pagamento, premium ou webhook.

## Variaveis obrigatorias

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `ADMIN_UIDS`
- `MP_ACCESS_TOKEN`
- `MP_WEBHOOK_SECRET`

## Teste local rapido

```bash
npm run test:security:payments
```

Se o PowerShell bloquear `npm.ps1`, use:

```bash
npm.cmd run test:security:payments
```

## Endpoints administrativos

- Sem `Authorization`: deve retornar 401.
- Com token invalido: deve retornar 401.
- Com token valido de usuario comum: deve retornar 403.
- Com token valido de UID presente em `ADMIN_UIDS`: deve funcionar.

Endpoints cobertos:

- `/api/admin-action`

## Pagamentos iniciados pelo usuario

- Sem `Authorization`: deve retornar 401.
- Com token invalido: deve retornar 401.
- Com `body.uid` diferente do UID do token: deve retornar 403.
- Com `body.uid` igual ao UID do token: pode prosseguir.
- Premium deve ser aplicado usando o UID do token validado.
- Usuario com Pix/pagamento avulso ativo e sem assinatura recorrente nao pode perder acesso ao tentar cancelar.
- Toda ativacao premium deve registrar `premiumOrigem`: `trial`, `pix`, `pagamento`, `assinatura` ou `manual`.

Endpoints cobertos:

- `/api/create-preference`
- `/api/create-pix`
- `/api/create-subscription`
- `/api/process-payment`
- `/api/cancel-subscription`

## Webhook Mercado Pago

- Sem `x-signature`: deve falhar.
- Sem `x-request-id`: deve falhar.
- Com assinatura invalida: deve falhar.
- Com assinatura valida e pagamento aprovado confirmado pela API do Mercado Pago: pode processar.
- Mesmo `paymentId` duas vezes: nao pode duplicar premium, cupom, repasse ou logs.
- Mesmo `invoiceId` de assinatura duas vezes: nao pode duplicar renovacao.

## Observacao

O app nunca deve liberar premium confiando apenas em `uid` vindo do frontend.
