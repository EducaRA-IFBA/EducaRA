# EDUCARA

EDUCARA é um projeto para visualização de objetos educacionais 3D utilizando realidade aumentada. Este projeto é desenvolvido para dispositivos Android usando Kotlin, integrando tecnologias como o ARCore.

## Visão Geral

Este repositório é um monorepo que contém:

- **App Educara:** Versão completa do aplicativo com todos os recursos.
- **Serviços:** Um back-end de serviços web básico integrado ao aplicativo.

## Tecnologias Utilizadas

- **Kotlin:** Linguagem de programação principal do projeto.
- **Android:** Plataforma de desenvolvimento.
- **ARCore:** Utilizado para integrar a realidade aumentada.
- **Php:** Para criação dos serviços web do back-end.
- **Docker:** Para conteinerização dos serviços.

## Como Começar

Siga as instruções abaixo para clonar, compilar e executar o projeto.

### Clonando o Repositório

```bash
git clone https://github.com/EducaRA-IFBA/EducaRA.git
cd educara
```

### Compilando e Executando
- Abra um terminal de comando e execute o comando a partir do diretório "servicos":

```bash
cd servicos
docker-compose up -d --build
```

ou utilize o Docker Desktop para iniciar o back-end.
- Abra o projeto no Android Studio que está na pasta "aplicativo".
- Sincronize os arquivos do projeto e as dependências (Gradle).
- Conecte um dispositivo Android ou use um emulador.
- Clique em "Run" para compilar e executar o aplicativo.

### Estrutura do Projeto
```bash
educara/
│
├── app/               # Código fonte do App Educara FULL
│
├── servicos/          # Código fonte do Back-end
└── README.md          # Documentação do projeto
```

🚧Projeto em desenvolvimento...
