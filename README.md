# Alemão Importados — Catálogo

Site estático (HTML/CSS/JS puro, sem build) para exibição do catálogo de iPhones e acessórios da Alemão Importados, com filtros, busca e integração com WhatsApp.

## Estrutura

- `index.html` — página única (hero, filtros, catálogo, sobre, localização, footer).
- `assets/css/styles.css` — estilos (tema escuro, inspirado na logo da loja).
- `assets/js/products.js` — lista de produtos do catálogo (edite aqui para adicionar/remover itens).
- `assets/js/app.js` — lógica de busca, filtros, ordenação e modal de produto.
- `assets/img/` — ícones (marca da maçã e favicon) em SVG.

## Como editar o catálogo

Abra `assets/js/products.js` e edite o array `PRODUCTS`. Cada item aceita:

```js
{
  id: "identificador-unico",
  category: "iphone" | "acessorio",
  model: "iPhone 15",
  memory: "128GB",
  color: "Rosa",
  colorHex: "#f2c9cf",       // usada na ilustração do produto
  condition: "novo" | "seminovo",
  battery: "92%",             // ou null se não se aplica
  price: 5399,
  oldPrice: 5799,             // ou null se não houver desconto
  badges: ["Lacrado", "Garantia Apple"],
}
```

## Configurar o WhatsApp

No topo de `assets/js/app.js`, ajuste:

```js
const WHATSAPP_NUMBER = "5531900000000"; // formato 55 + DDD + número, sem espaços ou símbolos
```

## Configurar endereço, horário e redes sociais

Esses dados estão no `index.html`, na seção `#localizacao` e no rodapé (`.site-footer`) — atualmente com valores de exemplo que precisam ser substituídos pelos dados reais da loja.

## Como rodar localmente

Como é um site 100% estático, basta abrir `index.html` no navegador, ou rodar um servidor simples:

```bash
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.

## Deploy

Pode ser publicado em qualquer hospedagem de site estático: GitHub Pages, Vercel, Netlify, Cloudflare Pages, etc. — não há etapa de build.
