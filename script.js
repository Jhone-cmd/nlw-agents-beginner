const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

function markdownToHTML(text) {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

async function questionAI(question, game, apiKey) {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const lol = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo League of Legends.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, build e dicas

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'
    - Considere a data atual ${new Date().toLocaleDateString()}
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que vc não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres
    - Responda em markdown
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\nexemplo de runas\n\n

    ---
    Aqui está a pergunta do usuário: ${question}
  `

    const valorant = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo Valorant.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds, composições de time, e dicas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor composição de time para o mapa Ascent?
    resposta: A composição de time mais atual para Ascent inclui:
    **Iniciador:** Sova ou Gekko
    **Controlador:** Omen ou Viper
    **Sentinela:** Killjoy ou Cypher
    **Duelista:** Jett ou Raze
    **Iniciador/Controlador:** KAY/O ou Astra

    ---
    Aqui está a pergunta do usuário: ${question}`

    const csgo = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo Counter-Strike: Global Offensive (CS: GO).

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias de armas, uso de utilitários, economia, e dicas de mapas.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor estratégia para o lado CT no mapa Dust II?
    resposta: Para CT no Dust II, foque em segurar o meio com um AWPer ou rifle, controlar o B com smokes e molotovs, e ter um jogador agressivo no A para pegar informações. A economia é crucial.

    ---
    Aqui está a pergunta do usuário: ${question}`

    const fortnite = `
    ## Especialidade
    Você é um especialista assistente de meta para o jogo Fortnite.

    ## Tarefa
    Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias de construção, melhores drop spots, armas e dicas para o jogo.

    ## Regras
    - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
    - Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
    - Considere a data atual ${new Date().toLocaleDateString()}.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
    - Nunca responda itens que você não tenha certeza de que existe no patch atual.

    ## Resposta
    - Economize na resposta, seja direto e responda no máximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está querendo.

    ## Exemplo de resposta
    pergunta do usuário: Qual a melhor arma atualmente?
    resposta: A meta de armas atual varia, mas a **Rifle de Assalto Despertar (Burst)** e a **Escopeta de Repetição Frenética (Frenzy Auto)** são escolhas fortes. Para longo alcance, o **Rifle de Sniper Ceifador (Reaper)** é muito popular.

    ---
    Aqui está a pergunta do usuário: ${question}`

    switch (game) {
        case 'lol':
            text = lol;
            break;
        case 'valorant':
            text = valorant;
            break;
        case 'csgo':
            text = csgo;
            break;
        case 'fortnite':
            text = fortnite;
            break;
    }

    const payload = {
        contents: [{
            role: UserActivation,
            parts: [{
                text
            }]
        }]
    }

    const tools = [{
        google_search: {}
    }]



    // Chamada API para o Gemini
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload, { tools })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text;
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
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')

    } catch (error) {
        console.log('Erro ao enviar o formulário:', error);

    } finally {
        askButton.disabled = false
        askButton.textContent = 'Pergunta'
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)