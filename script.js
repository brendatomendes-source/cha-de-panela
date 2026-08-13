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

    document.getElementById(
        "nome-presente-modal"
    ).innerText = nomePresente;

    document.getElementById(
        "nome-convidado"
    ).value = "";

    document.getElementById(
        "mensagem-presente"
    ).innerText = "";

    document.getElementById(
        "modal-presente"
    ).classList.add("ativo");

}


// =========================
// FECHAR MODAL
// =========================

function fecharModal() {

    document.getElementById(
        "modal-presente"
    ).classList.remove("ativo");

}


// =========================
// CONFIRMAR PRESENTE
// =========================

async function confirmarPresente() {

    const nome =
        document
            .getElementById("nome-convidado")
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


    // =========================
    // SALVAR NO BANCO
    // =========================

    const { error } =
        await supabaseClient
            .from("presentes")
            .update({

                reservado: true,

                nome_responsavel: nome

            })
            .eq(
                "id",
                presenteSelecionadoId
            );


    if (error) {

        console.error(
            "Erro ao reservar:",
            error
        );

        mensagem.innerText =
            "Não foi possível reservar o presente. 💙";

        return;
    }


    // =========================
    // SUCESSO
    // =========================

    mensagem.innerText =
        "Presente reservado com carinho! 💙";


    // Atualiza o botão

    const botao =
        document.querySelector(
            `.escolher[onclick*=", ${presenteSelecionadoId})"]`
        );


    if (botao) {

        botao.innerText =
            "✓ PRESENTE ESCOLHIDO";

        botao.disabled = true;

    }

}


// =========================
// VERIFICAR PRESENTES
// =========================

async function carregarStatusPresentes() {

    const { data, error } =
        await supabaseClient
            .from("presentes_publicos")
            .select(
                "id,nome,reservado"
            );


    if (error) {

        console.error(
            "Erro ao carregar presentes:",
            error
        );

        return;
    }


    console.log(
        "Status dos presentes:",
        data
    );


    data.forEach(function (presente) {

        const botao =
            document.querySelector(
                `.escolher[onclick*=", ${presente.id})"]`
            );


        if (!botao) {
            return;
        }


        if (presente.reservado === true) {

            botao.innerText =
                "✓ PRESENTE ESCOLHIDO";

            botao.disabled = true;

        } else {

            botao.innerText =
                "🎁 EU VOU DAR";

            botao.disabled = false;

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


// =========================
// CARREGAR STATUS
// =========================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carregarStatusPresentes();

    }
);
