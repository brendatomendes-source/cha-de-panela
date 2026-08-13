function copiarPix() {

    const chave = document.getElementById("chave-pix").innerText;

    navigator.clipboard.writeText(chave)
        .then(function() {

            const mensagem =
                document.getElementById("mensagem-pix");

            mensagem.style.display = "block";

            setTimeout(function() {
                mensagem.style.display = "none";
            }, 3000);

        });

}
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

        console.error(error);

        mensagem.innerText =
            "Não foi possível reservar o presente. Tente novamente. 💙";

        return;
    }

    if (!data || data.length === 0) {

        mensagem.innerText =
            "Esse presente acabou de ser escolhido por outra pessoa. 💙";

        return;
    }

    mensagem.innerText =
        "Presente reservado com carinho! 💙";

}

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
