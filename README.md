     
# Battering 

### 📌 Sobre o **Battering**  

**Battering** é uma aplicação inovadora que ajuda você a **lembrar de carregar a bateria do seu notebook** e ainda te diverte com um **spam de memes**!  

🔋 Nunca mais fique sem bateria no meio do trabalho!  
😂 Receba memes aleatórios para descontrair.  

---  

### ✨ Funcionalidades  
✔ **Lembretes inteligentes** para carregar seu notebook.  
✔ **Spam de memes** para alegrar seu dia.  


## 🛠️ Tecnologias Utilizadas
### Frontend
- Electron
- JavaScript
- tailwindcss
- HTML



## ⚙️ Como Executar
### Pré-requisitos
- Node.js (versão 20 ou superior)


### Instalação
1. Clone o repositório
```bash
git clone https://github.com/edu-almeidaf/battering
```

2. Instale as dependências
```bash
cd battering
npm install
```

4. Inicie o projeto
```bash
npm start
```

5. Caso de erro de política do Windows 
```bash
powershell -ExecutionPolicy Bypass npm start
```

## 📦 Estrutura do Projeto
```
battering/
├── app/
│   ├── image/               # Image assets and meme collection
│   │   ├── icons/          # Application icons
│   │   └── memes/          # Meme images directory
│   ├── script/             # JavaScript source files
│   │   ├── battery.js      # Battery monitoring logic
│   │   ├── memeLoader.js   # Meme loading and display
│   │   └── utils.js        # Utility functions
│   ├── videos/             # Video content directory
│   └── view/               # HTML view templates
│       ├── index.html      # Main application window
│       └── popup.html      # Notification popup window
├── main.js                 # Electron main process file
├── package.json            # Project dependencies and scripts
├── README.md              # Project documentation
├── package-lock.json      # Locked dependencies
└── popupGenerator.js      # Popup window management

```

## 📝 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe
- Igor Amarilha 
- Jhon Alison
- Bruna Asquel
- Eduardo Fernandes
- David Emanuel


**Nota:** Este projeto foi desenvolvido como parte de um hackathon e está em constante evolução. Sugestões e contribuições são sempre bem-vindas!

        