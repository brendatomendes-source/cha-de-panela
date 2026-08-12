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
