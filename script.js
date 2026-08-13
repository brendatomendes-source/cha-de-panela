function copiarPix() {

    const chave = document.getElementById("chave-pix").innerText;

    navigator.clipboard.writeText(chave)
        .then(function () {

            const mensagem =
                document.getElementById("mensagem-pix");

            mensagem.style.display = "block";

            setTimeout(function () {
                mensagem.style.display = "none";
            }, 3000);

        });

}


// =========================
// SISTEMA DE PRESENTES
// =========================

let presenteSelecionado = "";
let presenteSelecionadoId = null;


function abrirModal(nomePresente, idPresente) {

    presenteSelecionado = nomePresente;
    presenteSelecionadoId = idPresente;

    document.getElementById("nome-presente-modal").innerText =
        nomePresente;

    document.getElementById("nome-convidado").value = "";

    document.getElementById("mensagem-presente").innerText = "";

    document
        .getElementById("modal-presente")
        .classList.add("ativo");
}


function fecharModal() {

    document
        .getElementById("modal-presente")
        .classList.remove("ativo");

}


async function confirmarPresente() {

    const nome =
        document
        .getElementById("nome-convidado")
        .value
        .trim();

    const mensagem =
        document.getElementById("mensagem-presente");


    // Verifica se o nome foi preenchido

    if (!nome) {

        mensagem.innerText =
            "Por favor, digite seu nome. 💙";

        return;
    }


    // Verifica se o presente foi identificado

    if (!presenteSelecionadoId) {

        mensagem.innerText =
            "Não foi possível identificar o presente.";

        return;
    }


    mensagem.innerText =
        "Reservando seu presente...";


    // =========================
    // SALVAR NO SUPABASE
    // =========================

    const { error } = await supabaseClient
        .from("presentes")
        .update({

            reservado: true,

            nome_responsavel: nome

        })
        .eq("id", presenteSelecionadoId);


    // =========================
    // VERIFICAR ERRO
    // =========================

    if (error) {

        console.error(
            "Erro ao reservar:",
            error
        );

        mensagem.innerText =
            "Não foi possível reservar o presente. Tente novamente. 💙";

        return;
    }


    // =========================
    // SUCESSO
    // =========================

    mensagem.innerText =
        "Presente reservado com carinho! 💙";


    // Muda o botão

    const botoes =
        document.querySelectorAll(
            ".presente-botoes .escolher"
        );


    botoes.forEach(function (botao) {

        const onclick =
            botao.getAttribute("onclick");

        if (
            onclick &&
            onclick.includes(
                ", " + presenteSelecionadoId + ")"
            )
        ) {

            botao.innerText =
                "✓ PRESENTE ESCOLHIDO";

            botao.disabled = true;

        }

    });

}


// =========================
// CONEXÃO COM SUPABASE
// =========================

const SUPABASE_URL =
    "https://klnlmxxfunpzqooncgdk.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_7qrNIYZi0X7CZR2g-BKRTw_K2oOzOmi";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


console.log(
    "Supabase conectado!"
);
