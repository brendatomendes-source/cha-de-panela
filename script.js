// =========================
// CONEXÃO COM SUPABASE
// =========================
const SUPABASE_URL = "https://klnlmxxfunpzqooncgdk.supabase.co";
const SUPABASE_KEY = "sb_publishable_7qrNIYZi0X7CZR2g-BKRTw_K2oOzOmi";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado!");

// Carrega o status dos presentes e configura o formulário assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lista-presentes")) {
        carregarStatusPresentes();
    }

    const formConfirmacao = document.getElementById("form-confirmacao");
    if (formConfirmacao) {
        formConfirmacao.addEventListener("submit", confirmarPresenca);
    }
});

// =========================
// COPIAR PIX
// =========================
function copiarPix() {
    const chaveElement = document.getElementById("chave-pix");
    if (!chaveElement) return;

    const chave = chaveElement.innerText;

    navigator.clipboard.writeText(chave).then(() => {
        const mensagem = document.getElementById("mensagem-pix");
        if (mensagem) {
            mensagem.style.display = "block";
            setTimeout(() => {
                mensagem.style.display = "none";
            }, 3000);
        }
    });
}

// =========================
// CONFIRMAÇÃO DE PRESENÇA (INDEX)
// =========================
async function confirmarPresenca(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const presenca = document.getElementById("presenca").value;
    const acompanhantes = document.getElementById("acompanhantes").value;

    if (!nome || !presenca) {
        alert("Por favor, preencha seu nome e selecione uma opção de presença. 💙");
        return;
    }

    const btnSubmit = event.target.querySelector("button[type='submit']");
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = "Enviando...";
    btnSubmit.disabled = true;

    const { error } = await supabaseClient
        .from("presencas")
        .insert([
            {
                nome: nome,
                confirmado: presenca === "sim",
                quantidade_acompanhantes: parseInt(acompanhantes) || 0
            }
        ]);

    if (error) {
        console.error("Erro ao confirmar presença:", error);
        alert("Ops! Não foi possível salvar sua resposta. Tente novamente. 💙");
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
        return;
    }

    alert(presenca === "sim" 
        ? "Presença confirmada com sucesso! Mal podemos esperar para te ver. 💙" 
        : "Agradecemos por nos avisar! Sentiremos sua falta. 💙");

    event.target.reset();
    btnSubmit.innerText = textoOriginal;
    btnSubmit.disabled = false;
}

// =========================
// SISTEMA DE PRESENTES
// =========================
let presenteSelecionado = "";
let presenteSelecionadoId = null;

async function carregarStatusPresentes() {
    const { data: presentes, error } = await supabaseClient
        .from("presentes")
        .select("id, reservado");

    if (error) {
        console.error("Erro ao buscar presentes:", error);
        return;
    }

    presentes.forEach(p => {
        if (p.reservado) {
            marcarComoReservadoNaTela(p.id);
        }
    });
}

function marcarComoReservadoNaTela(idPresente) {
    const botao = document.querySelector(
        `.presente-botoes .escolher[onclick*=", ${idPresente})"]`
    );

    if (botao) {
        botao.innerText = "✓ PRESENTE JÁ ESCOLHIDO";
        botao.disabled = true;
        botao.style.backgroundColor = "#9fb3c8";
        botao.style.cursor = "not-allowed";

        const card = botao.closest(".presente-card");
        if (card) {
            const statusTag = card.querySelector(".status");
            if (statusTag) {
                statusTag.innerText = "● RESERVADO";
                statusTag.style.color = "#829ab1";
            }
        }
    }
}

function abrirModal(nomePresente, idPresente) {
    presenteSelecionado = nomePresente;
    presenteSelecionadoId = idPresente;

    document.getElementById("nome-presente-modal").innerText = nomePresente;
    document.getElementById("nome-convidado").value = "";
    document.getElementById("mensagem-presente").innerText = "";

    document.getElementById("modal-presente").classList.add("ativo");
}

function fecharModal() {
    document.getElementById("modal-presente").classList.remove("ativo");
}

async function confirmarPresente() {
    const nomeInput = document.getElementById("nome-convidado");
    const nome = nomeInput.value.trim();
    const mensagem = document.getElementById("mensagem-presente");

    if (!nome) {
        mensagem.innerText = "Por favor, digite seu nome. 💙";
        return;
    }

    if (!presenteSelecionadoId) {
        mensagem.innerText = "Não foi possível identificar o presente.";
        return;
    }

    mensagem.innerText = "Reservando seu presente...";

    // Tenta reservar apenas se 'reservado' ainda for false
    const { data, error } = await supabaseClient
        .from("presentes")
        .update({
            reservado: true,
            nome_responsavel: nome
        })
        .eq("id", presenteSelecionadoId)
        .eq("reservado", false)
        .select();

    if (error) {
        console.error("Erro ao reservar:", error);
        mensagem.innerText = "Não foi possível reservar o presente. Tente novamente. 💙";
        return;
    }

    if (!data || data.length === 0) {
        mensagem.innerText = "Esse presente acabou de ser escolhido por outra pessoa! 💙";
        marcarComoReservadoNaTela(presenteSelecionadoId);
        return;
    }

    mensagem.innerText = "Presente reservado com carinho! 💙";
    marcarComoReservadoNaTela(presenteSelecionadoId);

    setTimeout(() => {
        fecharModal();
    }, 2000);
}
