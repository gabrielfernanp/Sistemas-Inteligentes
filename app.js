// Elementos da UI
const modelLoading = document.getElementById('model-loading');
const modelReady = document.getElementById('model-ready');
const modelError = document.getElementById('model-error');
const modelInfo = document.getElementById('model-info');
const modelClasses = document.getElementById('model-classes');

const imageClassificationSection = document.getElementById('image-classification-section');
const imageUploadArea = document.getElementById('image-upload-area');
const imageFileInput = document.getElementById('image-file');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const classifyBtn = document.getElementById('classify-btn');

const resultsStandby = document.getElementById('results-standby');
const classificationResults = document.getElementById('classification-results');

const alertContainer = document.getElementById('alert-container');

// Estado da aplicação
let model = null;
let metadata = null;
let selectedImage = null;

// Inicialização
async function init() {
    try {
        // Carregar o modelo da pasta "model"
        await loadModel();
        setupEventListeners();
    } catch (error) {
        console.error('Erro na inicialização:', error);
        showModelError();
    }
}

// Configuração dos event listeners
function setupEventListeners() {
    // Eventos para upload de imagem
    imageUploadArea.addEventListener('click', () => imageFileInput.click());
    imageFileInput.addEventListener('change', handleImageSelection);
    
    imageUploadArea.addEventListener('dragover', handleDragOver);
    imageUploadArea.addEventListener('dragleave', handleDragLeave);
    imageUploadArea.addEventListener('drop', handleImageDrop);
    
    classifyBtn.addEventListener('click', classifyImage);
}

// Manipuladores de eventos para drag and drop
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');
}

function handleImageDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0 && e.dataTransfer.files[0].type.startsWith('image/')) {
        processImageFile(e.dataTransfer.files[0]);
    } else {
        showAlert('Por favor, selecione um arquivo de imagem válido.', 'error');
    }
}

// Carregamento do modelo
async function loadModel() {
    try {
        // Mostrar estado de carregamento
        showModelLoading();
        
        // Carregar metadata
        const metadataResponse = await fetch('./model/metadata.json');
        if (!metadataResponse.ok) {
            throw new Error('Não foi possível carregar o arquivo metadata.json');
        }
        metadata = await metadataResponse.json();
        
        // Carregar o modelo
        model = await tf.loadLayersModel('./model/model.json');
        
        // Mostrar sucesso e habilitar a classificação de imagens
        showModelSuccess();
        displayModelInfo();
        enableImageClassification();
        
    } catch (error) {
        console.error('Erro ao carregar o modelo:', error);
        showModelError();
        showAlert('Erro ao carregar o modelo. Verifique se os arquivos do modelo estão na pasta "model".', 'error');
    }
}

function showModelLoading() {
    modelLoading.classList.remove('hidden');
    modelReady.classList.add('hidden');
    modelError.classList.add('hidden');
}

function showModelSuccess() {
    modelLoading.classList.add('hidden');
    modelReady.classList.remove('hidden');
    modelError.classList.add('hidden');
    showAlert('Modelo carregado com sucesso!', 'success');
}

function showModelError() {
    modelLoading.classList.add('hidden');
    modelReady.classList.add('hidden');
    modelError.classList.remove('hidden');
}

function displayModelInfo() {
    if (metadata && metadata.labels) {
        // Limpar lista de classes
        modelClasses.innerHTML = '';
        
        // Adicionar cada classe à lista
        metadata.labels.forEach(label => {
            const li = document.createElement('li');
            li.textContent = label;
            modelClasses.appendChild(li);
        });
        
        // Mostrar informações do modelo
        modelInfo.classList.remove('hidden');
    }
}

function enableImageClassification() {
    imageClassificationSection.classList.remove('disabled');
    imageFileInput.disabled = false;
}

// Processamento de imagem
function handleImageSelection(e) {
    if (e.target.files.length > 0) {
        processImageFile(e.target.files[0]);
    }
}

function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
        showAlert('Por favor, selecione um arquivo de imagem válido.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        selectedImage = e.target.result;
        displayImagePreview(selectedImage);
    };
    reader.readAsDataURL(file);
}

function displayImagePreview(imageSrc) {
    imagePreview.src = imageSrc;
    previewContainer.classList.remove('hidden');
}

// Classificação de imagem
async function classifyImage() {
    if (!model || !metadata || !selectedImage) {
        showAlert('Modelo ou imagem não carregados corretamente.', 'error');
        return;
    }
    
    try {
        // Mostrar estado de carregamento
        classifyBtn.disabled = true;
        classifyBtn.innerHTML = '<span class="spinner"></span>Analisando...';
        
        // Carregar e pré-processar a imagem
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage;
        
        img.onload = async () => {
            try {
                // Pré-processar a imagem para corresponder aos requisitos de entrada do modelo
                const tensor = tf.browser
                    .fromPixels(img)
                    .resizeNearestNeighbor([224, 224]) // Redimensionar para corresponder à entrada do modelo
                    .toFloat()
                    .div(tf.scalar(255))
                    .expandDims();
                
                // Executar a inferência
                const predictions = await model.predict(tensor);
                const data = await predictions.data();
                
                // Processar previsões
                const result = Array.from(data).map((probability, index) => {
                    return {
                        className: metadata.labels[index],
                        probability: probability,
                    };
                });
                
                // Ordenar por probabilidade (maior primeiro)
                result.sort((a, b) => b.probability - a.probability);
                
                // Exibir resultados
                displayResults(result);
                
                // Limpar tensores
                tensor.dispose();
                predictions.dispose();
                
                // Restaurar botão
                classifyBtn.disabled = false;
                classifyBtn.innerHTML = '<span class="button-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span>Classificar Imagem';
                
            } catch (error) {
                console.error('Erro ao classificar imagem:', error);
                showAlert('Erro ao classificar a imagem. Por favor, tente novamente.', 'error');
                
                // Restaurar botão
                classifyBtn.disabled = false;
                classifyBtn.innerHTML = '<span class="button-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span>Classificar Imagem';
            }
        };
        
        img.onerror = () => {
            showAlert('Erro ao carregar a imagem. Por favor, tente novamente.', 'error');
            classifyBtn.disabled = false;
            classifyBtn.innerHTML = '<span class="button-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span>Classificar Imagem';
        };
        
    } catch (error) {
        console.error('Erro ao classificar imagem:', error);
        showAlert('Erro ao classificar a imagem. Por favor, tente novamente.', 'error');
        
        // Restaurar botão
        classifyBtn.disabled = false;
        classifyBtn.innerHTML = '<span class="button-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></span>Classificar Imagem';
    }
}

function displayResults(results) {
    // Esconder a mensagem de standby
    resultsStandby.classList.add('hidden');
    
    // Limpar resultados anteriores
    classificationResults.innerHTML = '';
    
    // Adicionar novos resultados
    results.forEach(result => {
        const percentage = (result.probability * 100).toFixed(2);
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const resultLabel = document.createElement('div');
        resultLabel.className = 'result-label';
        
        const className = document.createElement('span');
        className.textContent = result.className;
        
        const probability = document.createElement('span');
        probability.textContent = `${percentage}%`;
        
        resultLabel.appendChild(className);
        resultLabel.appendChild(probability);
        
        const resultBarContainer = document.createElement('div');
        resultBarContainer.className = 'result-bar-container';
        
        const resultBarFill = document.createElement('div');
        resultBarFill.className = 'result-bar-fill';
        resultBarFill.style.width = '0%';
        
        resultBarContainer.appendChild(resultBarFill);
        
        resultItem.appendChild(resultLabel);
        resultItem.appendChild(resultBarContainer);
        
        classificationResults.appendChild(resultItem);
        
        // Animar a barra de progresso
        setTimeout(() => {
            resultBarFill.style.width = `${percentage}%`;
        }, 50);
    });
    
    // Mostrar o container de resultados
    classificationResults.classList.remove('hidden');
}

// Utilitários
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    // Remover o alerta após 5 segundos
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alertContainer.removeChild(alert);
        }, 300);
    }, 5000);
}

// Inicializar a aplicação quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se o TensorFlow.js está disponível
    if (typeof tf === 'undefined') {
        showAlert('Erro: TensorFlow.js não foi carregado. Verifique sua conexão com a internet.', 'error');
        return;
    }
    
    // Iniciar a aplicação
    init();
});