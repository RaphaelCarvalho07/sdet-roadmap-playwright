# 📘 DIÁRIO DE BORDO & BACKUP - JORNADA SDET

> **Instrução de Contexto:** Este arquivo serve como a memória central e linear da minha transição de carreira para SDET. Ele deve ser mantido atualizado incrementalmente a cada sessão de mentoria técnica realizada na Antigravity IDE.

---

## 1. Prompt de Atualização Incremental (Fim de Sessão)

Sempre que terminar uma discussão técnica, resolução de bug ou desenho de arquitetura de testes, copie o prompt abaixo, cole no chat da IDE e envie:

```prompt
Abra o arquivo @jornada_sdet_backup.md e adicione uma nova seção no final dele com o resumo desta nossa conversa atual. Siga rigorosamente este template de Markdown para a nova seção:

## [Data de Hoje] - [Título do Assunto]
### 1. Cenário e Desafio Técnico
[Insira aqui o resumo do problema que resolvemos]
### 2. Solução Estruturada & Padrões Recomendados
[Insira aqui os blocos de código e arquitetura que consolidamos]
### 3. Próximos Passos de Estudo
[Insira aqui o plano de ação imediato]

Mantenha o restante do arquivo intacto e apenas anexe essa nova seção.
```

## 2. Fluxo de Versionamento Git (Pós-Sessão)

Após a IA confirmar que salvou a nova seção no arquivo, abra o terminal do seu repositório pessoal e execute os seguintes comandos para blindar o seu progresso na nuvem:

```bash
git add jornada_sdet_backup.md
git commit -m "docs: adiciona mentoria sobre [Assunto de Hoje] ao diário de bordo"
git push origin main
```

---

## 06/07/2026 - Consolidação do Histórico de Mentoria (Origem: WebApp)

### 1. Cenário e Desafio Técnico
A jornada teve início com o objetivo de realizar a transição profissional de **QA Automation Engineer** para **SDET (Software Development Engineer in Test)**, focando em elevar o nível dos testes funcionais isolados para uma arquitetura robusta de nível de produção. No início, trabalhava-se com um script de teste de UI linear e procedimental (`tests/ecommerce.spec.ts`) contra o e-commerce *SauceDemo*.

Durante a evolução do projeto, enfrentamos os seguintes desafios de engenharia:
- **Paradigma de POO & Encapsulamento:** Sair de scripts sequenciais para estruturar classes reutilizáveis com seletores de elementos privados e fortemente tipados (`Locator`).
- **Ambiguidade e Dados Chumbados:** Lidar com seletores duplicados no carrinho de compras e o risco de quebras silenciosas por strings fixas (hardcoded) para produtos na interface.
- **Erros de Compilação do TypeScript:** Correção de erros recorrentes de escopo e imports ausentes (como o objeto `expect`).
- **Setup e Velocidade de Execução (Bypass de Login):** Evitar ter que realizar o fluxo de login em cada teste de UI individual, o que aumentava significativamente o tempo de teste.
- **Isolamento de Ambientes Híbridos (API e UI):** Impedir que testes de API vazassem de contexto ou falhassem devido à falta de `baseURL` apropriada ou rejeição por ausência de cabeçalhos de autenticação exigidos pelo WAF do ReqRes.
- **Conflito de Módulos (CommonJS vs ESM):** Resolução de problemas de compilação ao integrar o pacote moderno `@faker-js/faker` (ESM) em um projeto configurado em CommonJS.

### 2. Solução Estruturada & Padrões Recomendados
Para solucionar os desafios técnicos e estabelecer os alicerces de um framework profissional, implementamos as seguintes soluções arquiteturais:

- **Page Object Model (POM) Dinâmico:** Centralização de localizadores no construtor de classes como `LoginPage` e `ProductsPage`. Usamos Expressões Regulares (`Regex` kebab-case) para mapear nomes de produtos de forma dinâmica a identificadores `data-test` do HTML, resolvendo colisões de elementos:
  ```ts
  const formattedName = productName.toLowerCase().replace(/\s+/g, "-");
  const productButton = this.page.getByTestId(`add-to-cart-${formattedName}`);
  await productButton.click();
  ```
- **Centralização de Locators & Encadeamento:** Encadeamento de localizadores a partir de escopos filtrados no POM para reaproveitar propriedades da classe e mitigar quebras em mudanças de layout:
  ```ts
  const scopedItemContainer = this.cartItemContainer.filter({ hasText: productName });
  const itemNameLocator = scopedItemContainer.locator(this.productItemName);
  await itemNameLocator.waitFor({ state: "visible" });
  ```
- **Injeção de Dependências com Custom Fixtures:** Estendemos o motor nativo do Playwright (`base.extend`) em `src/fixtures/baseTest.ts` para inicializar automaticamente as páginas de login e produtos, eliminando o boilerplate de instanciação em cada arquivo de teste:
  ```ts
  export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
      await use(new ProductsPage(page));
    },
  });
  ```
- **Session-State Bypass (Autenticação Global):** Configuração de um setup global (`tests/global.setup.ts`) para autenticar o usuário e armazenar o estado de sessão em `.auth/user.json`. Os projetos de UI reutilizam esse estado dinamicamente, otimizando o tempo total de execução.
- **Isolamento Estrito de Projetos (`playwright.config.ts`):** Divisão clara no arquivo de configuração do Playwright, amarrando o `testDir` cirurgicamente às subpastas `/tests/api` e `/tests/ui` para evitar sobreposição de workers.
- **Cliente HTTP Purista (`UserClient.ts`):** Centralização de rotas com caminhos relativos na classe de cliente HTTP e tratamento correto dos headers (`Content-Type`, `x-api-key`) para testes de integração de API.
- **Fábrica de Dados Dinâmicos (`UserFactory.ts`):** Implementação de fábricas com importação dinâmica assíncrona (`await import('@faker-js/faker')`) para driblar incompatibilidade de módulos e garantir massa de dados única a cada execução.
- **Mocking de Rede & Resiliência:** Testes de UI interceptando requisições com mocks para validar comportamentos resilientes do frontend diante de falhas críticas (HTTP 500), substituição dinâmica de assets e simulação de latência de rede (Slow 3G).

### 3. Próximos Passos de Estudo
- **Pipeline CI/CD no GitHub Actions:** Desenvolver e implementar o arquivo `.github/workflows/playwright.yml` para execução headless paralela nas máquinas Linux do GitHub.
- **Gerenciamento Seguro de Secrets:** Configurar segredos de ambiente no repositório (`API_URL`, `UI_URL`, `REQRES_API_KEY`) para rodar os testes na nuvem com segurança.
- **Ampliação das Fábricas de Dados:** Criar novas fábricas de objetos dinâmicos e aplicar o padrão de forma mais ampla no framework.
- **Melhores Práticas de Relatórios e Debugging:** Configurar relatórios HTML robustos no CI para análise rápida de falhas.
