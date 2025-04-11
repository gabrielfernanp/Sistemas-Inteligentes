# Classificador de Imagens com Teachable Machine

Um aplicativo web para classificação de imagens usando modelos treinados com o Google Teachable Machine e TensorFlow.js.

![Classificador de Imagens](https://via.placeholder.com/800x400?text=Classificador+de+Imagens)

## 📋 Sobre o Projeto

Este projeto é um classificador de imagens baseado na web que permite aos usuários carregar imagens e classificá-las usando um modelo personalizado treinado com o Google Teachable Machine. O aplicativo carrega o modelo a partir de arquivos locais e executa a inferência diretamente no navegador usando TensorFlow.js.

### ✨ Funcionalidades

- Carregamento automático de modelos do Teachable Machine
- Upload de imagens por arrastar e soltar ou seleção de arquivo
- Visualização de prévia da imagem antes da classificação
- Exibição de resultados com barras de progresso animadas
- Interface responsiva para desktop e dispositivos móveis
- Feedback visual através de alertas e indicadores de carregamento

## 🚀 Como Usar

### Pré-requisitos

- Um navegador web moderno (Chrome, Firefox, Safari, Edge)
- Um modelo treinado com o Google Teachable Machine (arquivos `model.json` e `metadata.json`)

### Configuração

1. Clone este repositório ou baixe os arquivos para seu computador
2. Exporte seu modelo do Teachable Machine como um "Modelo de Imagem para Web"
3. Crie uma pasta chamada `model` no diretório raiz do projeto
4. Coloque os arquivos do modelo (`model.json`, `metadata.json` e os arquivos de pesos) na pasta `model`

### Execução

1. Abra o arquivo `index.html` em um navegador web
2. O aplicativo tentará carregar automaticamente o modelo da pasta `model`
3. Após o carregamento bem-sucedido, você poderá fazer upload de imagens para classificação

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da aplicação
- **CSS3** - Estilização e layout responsivo
- **JavaScript** - Lógica da aplicação e manipulação do DOM
- **TensorFlow.js** - Biblioteca para execução de modelos de machine learning no navegador
- **Google Teachable Machine** - Plataforma para treinamento de modelos personalizados

## 📁 Estrutura do Projeto

```
classificador-imagens/
│
├── index.html          # Estrutura HTML da aplicação
├── styles.css          # Estilos CSS
├── app.js              # Lógica JavaScript
│
└── model/              # Pasta para os arquivos do modelo (não incluída no repositório)
    ├── model.json      # Configuração do modelo
    ├── metadata.json   # Metadados do modelo (classes, etc.)
    └── weights.bin     # Pesos do modelo
```

## 🧠 Como Funciona

1. **Carregamento do Modelo**: Ao iniciar, o aplicativo tenta carregar o modelo TensorFlow.js e os metadados associados da pasta `model`.

2. **Upload de Imagem**: Os usuários podem fazer upload de imagens arrastando e soltando ou selecionando um arquivo.

3. **Pré-processamento**: A imagem é redimensionada para 224x224 pixels e normalizada para corresponder aos requisitos de entrada do modelo.

4. **Classificação**: O modelo processa a imagem e retorna probabilidades para cada classe.

5. **Exibição de Resultados**: Os resultados são exibidos em ordem decrescente de probabilidade com barras de progresso visuais.

## ⚙️ Personalização

### Modificando o Modelo

Para usar um modelo diferente:

1. Treine um novo modelo no [Google Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Exporte o modelo como "Modelo de Imagem para Web"
3. Substitua os arquivos na pasta `model`

### Personalizando a Interface

- Modifique as variáveis CSS em `styles.css` para alterar cores, fontes e outros elementos visuais
- Ajuste o layout HTML em `index.html` conforme necessário

## 📝 Notas Adicionais

- O aplicativo executa todo o processamento localmente no navegador, sem enviar imagens para servidores externos
- O desempenho pode variar dependendo do dispositivo e do navegador utilizados
- Modelos maiores podem levar mais tempo para carregar e processar imagens

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 🙏 Agradecimentos

- [TensorFlow.js](https://www.tensorflow.org/js) por fornecer a biblioteca para execução de modelos ML no navegador
- [Google Teachable Machine](https://teachablemachine.withgoogle.com/) por facilitar o treinamento de modelos personalizados
```

Este README fornece uma documentação completa do seu projeto de classificador de imagens, incluindo:

- Uma visão geral do projeto
- Instruções de configuração e uso
- Detalhes sobre as tecnologias utilizadas
- Explicação de como o sistema funciona
- Orientações para personalização

Você pode personalizar ainda mais este README adicionando capturas de tela do seu aplicativo em funcionamento, exemplos específicos de classificação, ou qualquer outra informação relevante para o seu projeto.
```

