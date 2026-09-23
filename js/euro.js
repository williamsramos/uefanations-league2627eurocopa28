/* =======================================================================
   EURO.JS
   Lógica específica da página da Eurocopa. Por enquanto só o histórico
   de campeões (informativo) — quando tiveres grupos/seleções/calendário
   da Euro 2028, isto ganha as mesmas funções de classificação/jogos que
   a Nations League tem em nations.js + nations_jogos.js.
   ======================================================================= */

/* ---------- Campeões da Eurocopa (histórico geral, informativo) ---------- */
const EURO_CHAMPIONS_HISTORY = [
  { edicao:"2016", campeao:"Portugal", vice:"França", terceiro:"—" },
  { edicao:"2020", campeao:"Itália", vice:"Inglaterra", terceiro:"—" },
  { edicao:"2024", campeao:"Espanha", vice:"Inglaterra", terceiro:"—" }
];

function renderEuroChampions(){
  const container = document.getElementById("euroChampionsHistory");
  if(!container) return;
  container.innerHTML = EURO_CHAMPIONS_HISTORY.map(c=>`
    <div class="champion-card">
      <div class="edicao">${c.edicao}</div>
      <div class="podio-line">🥇 ${flagImg(c.campeao)} ${c.campeao}</div>
      <div class="podio-line">🥈 ${flagImg(c.vice)} ${c.vice}</div>
    </div>
  `).join("");
}

/* =======================================================================
   SUB-ABAS DESTA PÁGINA + INICIALIZAÇÃO
   ======================================================================= */
bindSubTabs("euroSubTabs");

document.addEventListener("DOMContentLoaded", ()=>{
  renderEuroChampions();
});
