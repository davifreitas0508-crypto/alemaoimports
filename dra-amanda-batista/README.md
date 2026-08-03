# Dra. Amanda Batista — Odontologia

Site institucional estático (HTML/CSS/JS puro, sem build) para agendamento de consultas.

## Estrutura

- `index.html` — página única (header, hero, sobre, serviços, diferenciais, avaliações, contato, footer).
- `assets/css/styles.css` — identidade visual em vinho/bordô (#3d0f14–#5c1a21) e dourado/champagne, tipografia Playfair Display + Inter.
- `assets/js/config.js` — número de WhatsApp.
- `assets/js/app.js` — menu mobile, animações de scroll, e formulário de agendamento (envia via WhatsApp).
- `assets/img/` — ícones e foto da Dra. Amanda.

## Foto da Dra. Amanda

O arquivo `assets/img/dra-amanda.jpg` ainda não foi adicionado (não havia acesso ao anexo original no momento da criação do site). Enquanto isso, um placeholder ilustrativo (`dra-amanda-placeholder.svg`) é exibido automaticamente.

Para usar a foto real, basta salvar a imagem em:

```
dra-amanda-batista/assets/img/dra-amanda.jpg
```

O site detecta o arquivo automaticamente (o placeholder só aparece se `dra-amanda.jpg` não existir).

## Configurar o WhatsApp

Em `assets/js/config.js`, ajuste:

```js
const WHATSAPP_NUMBER = "5531900000000"; // formato 55 + DDD + número
```

## Como rodar localmente

```bash
cd dra-amanda-batista
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.
