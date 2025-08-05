const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const enviarFormulario = (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (!apiKey || !game || !question) {
        alert('Por favor, preencha todos os campos.')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Enviando pergunta...'
    askButton.classList.add('loading')

    try {

    } catch (error) {
        console.log('Erro ao enviar o formulário:', error);

    } finally {
        askButton.disabled = false
        askButton.textContent = 'Pergunta'
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)