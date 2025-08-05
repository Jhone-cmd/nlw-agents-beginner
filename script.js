const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

async function questionAI(question, game, apiKey) {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const text = `Responda a seguinte pergunta sobre o jogo ${game} de forma clara e objetiva: ${question}`

    const payload = {
        contents: [{
            parts: [{
                text
            }]
        }]
    }



    // Chamada API para o Gemini
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()
    console.log({ data });

    return
}

const enviarFormulario = async (event) => {
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
        const text = await questionAI(question, game, apiKey)
        console.log(text);

    } catch (error) {
        console.log('Erro ao enviar o formulário:', error);

    } finally {
        askButton.disabled = false
        askButton.textContent = 'Pergunta'
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)