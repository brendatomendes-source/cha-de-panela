// =========================
// COPIAR PIX
// =========================

function copiarPix() {

    const chave =
        document.getElementById("chave-pix").innerText;

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


// =========================
// ABRIR MODAL
// =========================

function abrirModal(nomePresente, idPresente) {

    presenteSelecionado = nomePresente;

    presenteSelecionadoId = idPresente;

    const nomeModal =
        document.getElementById(
            "nome-presente-modal"
        );

    const nomeConvidado =
        document.getElementById(
            "nome-convidado"
        );

    const mensagem =
        document.getElementById(
            "mensagem-presente"
        );

    const modal =
        document.getElementById(
            "modal-presente"
        );


    nomeModal.innerText =
        nomePresente;

    nomeConvidado.value = "";

    mensagem.innerText = "";

    modal.classList.add("ativo");

}


// =========================
// FECHAR MODAL
// =========================

function fecharModal() {

    const modal =
        document.getElementById(
            "modal-presente"
        );

    modal.classList.remove("ativo");

}


// =========================
// CONFIRMAR PRESENTE
// =========================

async function confirmarPresente() {

    const nome =
        document
            .getElementById(
                "nome-convidado"
            )
            .value
            .trim();

    const mensagem =
        document.getElementById(
            "mensagem-presente"
        );


    if (!nome) {

        mensagem.innerText =
            "Por favor, digite seu nome. 💙";

        return;

    }


    if (!presenteSelecionadoId) {

        mensagem.innerText =
            "Não foi possível identificar o presente.";

        return;

    }


    mensagem.innerText =
        "Reservando seu presente...";

const { data, error } =
    await supabaseClient
        .from("presentes")
        .update({

            reservado: true,

            nome_responsavel: nome

        })
        .eq(
            "id",
            presenteSelecionadoId
        )
        .select();

console.log("ID do presente:", presenteSelecionadoId);

console.log("Nome:", nome);

console.log("DATA:", data);

console.log("ERRO:", error);


    if (error) {

        console.error(
            "Erro ao reservar:",
            error
        );

        mensagem.innerText =
            "Não foi possível reservar o presente. 💙";

        return;

    }


    mensagem.innerText =
        "Presente reservado com carinho! 💙";

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
