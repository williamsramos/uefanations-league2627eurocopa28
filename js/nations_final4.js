/* =======================================================================
   NATIONS_FINAL4.JS
   Mata-mata da Liga A: os 2 primeiros de cada grupo (A1 a A4) — 8
   seleções ao todo — disputam as Quartas de Final. Os vencedores
   avançam às Meias-finais, depois à Final e ao jogo de 3º lugar.
   ======================================================================= */

const GRUPOS_LIGA_A = ["A1","A2","A3","A4"];

/* Emparelhamento padrão das quartas: o 1º de um grupo encara o 2º de
   outro grupo, evitando repetir logo de cara um adversário do próprio
   grupo. Os confrontos são recalculados automaticamente conforme a
   classificação muda — não há pareamento manual nesta fase. */
const QUARTOS_PAREAMENTO = [
  { id:"qf1", casa:{grupo:"A1",pos:0}, fora:{grupo:"A4",pos:1} },
  { id:"qf2", casa:{grupo:"A2",pos:0}, fora:{grupo:"A3",pos:1} },
  { id:"qf3", casa:{grupo:"A3",pos:0}, fora:{grupo:"A2",pos:1} },
  { id:"qf4", casa:{grupo:"A4",pos:0}, fora:{grupo:"A1",pos:1} }
];

/* Estado do mata-mata (em memória, não persiste após recarregar) */
const final4State = {
  placares: {
    qf1:{ casa:"", fora:"", penCasa:"", penFora:"" },
    qf2:{ casa:"", fora:"", penCasa:"", penFora:"" },
    qf3:{ casa:"", fora:"", penCasa:"", penFora:"" },
    qf4:{ casa:"", fora:"", penCasa:"", penFora:"" },
    sf1:{ casa:"", fora:"", penCasa:"", penFora:"" },
    sf2:{ casa:"", fora:"", penCasa:"", penFora:"" },
    final:{ casa:"", fora:"", penCasa:"", penFora:"" },
    terceiro:{ casa:"", fora:"", penCasa:"", penFora:"" }
  }
};

/* Devolve o 1º e o 2º colocado atuais de um grupo da Liga A */
function qualificadosGrupo(grupo){
  const standings = computeStandings(grupo);
  return { primeiro: standings[0].time, segundo: standings[1].time };
}

/* Resolve qual seleção ocupa um "slot" do pareamento (ex: 1º do A1) */
function timeDoSlot(slot){
  const q = qualificadosGrupo(slot.grupo);
  return slot.pos === 0 ? q.primeiro : q.segundo;
}

/* Devolve {vencedor, empatou} de um confronto dados os placares e,
   se necessário, os pênaltis escolhidos manualmente */
function resolverConfronto(placar, timeCasa, timeFora){
  const gc = parseInt(placar.casa), gf = parseInt(placar.fora);
  if(placar.casa === "" || placar.fora === "" || isNaN(gc) || isNaN(gf)){
    return { vencedor:null, empatou:false };
  }
  if(gc > gf) return { vencedor:timeCasa, empatou:false };
  if(gc < gf) return { vencedor:timeFora, empatou:false };
  // empate -> precisa de pênaltis
  if(placar.penCasa !== "" || placar.penFora !== ""){
    const pc = parseInt(placar.penCasa), pf = parseInt(placar.penFora);
    if(!isNaN(pc) && !isNaN(pf) && pc !== pf){
      return { vencedor: pc > pf ? timeCasa : timeFora, empatou:false };
    }
  }
  return { vencedor:null, empatou:true };
}

/* Tira do ar os 8 qualificados (1º e 2º de cada grupo), agrupados */
function renderQualificados(){
  const container = document.getElementById("final4Semifinalistas");
  let html = "";
  GRUPOS_LIGA_A.forEach(g=>{
    const { primeiro, segundo } = qualificadosGrupo(g);
    html += `<div class="final4-team-chip">
      <span class="grupo-tag">${g}</span> <span class="qualif-pos">1º</span> ${flagImg(primeiro)} ${primeiro}
    </div>`;
    html += `<div class="final4-team-chip">
      <span class="grupo-tag">${g}</span> <span class="qualif-pos">2º</span> ${flagImg(segundo)} ${segundo}
    </div>`;
  });
  container.innerHTML = html;
}

function renderMatchBox({ id, titulo, placarKey, timeCasaFixo, timeForaFixo }){
  const placar = final4State.placares[placarKey];
  const timeCasa = timeCasaFixo;
  const timeFora = timeForaFixo;

  const resultado = (timeCasa && timeFora) ? resolverConfronto(placar, timeCasa, timeFora) : { vencedor:null, empatou:false };
  const precisaPenaltis = resultado.empatou;

  const ladoCasa = `${flagImg(timeCasa, "flag flag-lg")}<span class="f4-team-name">${timeCasa || "—"}</span>`;
  const ladoFora = `${flagImg(timeFora, "flag flag-lg")}<span class="f4-team-name">${timeFora || "—"}</span>`;

  let html = `<div class="f4-match" data-match="${id}">
    <div class="f4-match-header">${titulo}</div>
    <div class="f4-match-body">
      <div class="f4-versus">
        <div class="f4-side">${ladoCasa}</div>
        <div class="f4-score">
          <input type="number" min="0" max="99" class="f4-score-casa" data-key="${placarKey}" value="${placar.casa}" ${timeCasa?"":"disabled"}>
          <span class="f4-score-sep">-</span>
          <input type="number" min="0" max="99" class="f4-score-fora" data-key="${placarKey}" value="${placar.fora}" ${timeFora?"":"disabled"}>
        </div>
        <div class="f4-side">${ladoFora}</div>
      </div>`;

  if(precisaPenaltis){
    html += `<div class="f4-pen-row">
      Empate — decide nos pénaltis:
      <select class="f4-pen-select" data-key="${placarKey}">
        <option value="">-- escolher --</option>
        <option value="casa" ${placar.penCasa!==""&&parseInt(placar.penCasa)>parseInt(placar.penFora||0)?"selected":""}>${timeCasa}</option>
        <option value="fora">${timeFora}</option>
      </select>
    </div>`;
  }

  html += `<div class="f4-winner-tag">${resultado.vencedor ? `🏆 ${resultado.vencedor}` : "&nbsp;"}</div>
    </div>
  </div>`;

  return { html, vencedor: resultado.vencedor, perdedor: resultado.vencedor ? (resultado.vencedor===timeCasa?timeFora:timeCasa) : null, timeCasa, timeFora };
}

function renderFinal4(){
  renderQualificados();

  /* ---- Quartas de Final (8 times, 4 jogos) ---- */
  const qf = QUARTOS_PAREAMENTO.map(par=>{
    const casa = timeDoSlot(par.casa);
    const fora = timeDoSlot(par.fora);
    return renderMatchBox({
      id: par.id,
      titulo: `Quartas de Final — ${par.id.toUpperCase().replace("QF","")}`,
      placarKey: par.id,
      timeCasaFixo: casa,
      timeForaFixo: fora
    });
  });

  /* ---- Meias-finais (vencedores das quartas, no bracket padrão) ---- */
  const sf1 = renderMatchBox({
    id:"sf1", titulo:"Meia-final 1", placarKey:"sf1",
    timeCasaFixo: qf[0].vencedor, timeForaFixo: qf[1].vencedor
  });
  const sf2 = renderMatchBox({
    id:"sf2", titulo:"Meia-final 2", placarKey:"sf2",
    timeCasaFixo: qf[2].vencedor, timeForaFixo: qf[3].vencedor
  });

  /* ---- Final e 3º lugar ---- */
  const finalBox = renderMatchBox({
    id:"final", titulo:"Final", placarKey:"final",
    timeCasaFixo: sf1.vencedor, timeForaFixo: sf2.vencedor
  });
  const terceiroBox = renderMatchBox({
    id:"terceiro", titulo:"Jogo de 3º lugar", placarKey:"terceiro",
    timeCasaFixo: sf1.perdedor, timeForaFixo: sf2.perdedor
  });

  let bannerHtml = "";
  if(finalBox.vencedor){
    bannerHtml = `<div class="f4-champion-banner">
      <img src="img/trofeu_nations.png" alt="Troféu" class="trofeu-banner" onerror="this.style.display='none'">
      <div class="titulo">Campeão da Nations League 2026/2027</div>
      <div class="nome">${flagImg(finalBox.vencedor)} ${finalBox.vencedor}</div>
      <button id="usarPodioFinal4Btn">Usar este pódio na aba Campeões</button>
    </div>`;
  }

  const container = document.getElementById("final4Bracket");
  container.innerHTML = `
    ${bannerHtml}
    <div class="f4-stage-title">Quartas de Final (1º e 2º de cada grupo da Liga A)</div>
    <div class="f4-row f4-row-4">${qf.map(q=>q.html).join("")}</div>
    <div class="f4-stage-title">Meias-finais</div>
    <div class="f4-row">${sf1.html}${sf2.html}</div>
    <div class="f4-stage-title">Final &amp; 3º lugar</div>
    <div class="f4-row">${finalBox.html}${terceiroBox.html}</div>
  `;

  const usarBtn = document.getElementById("usarPodioFinal4Btn");
  if(usarBtn){
    usarBtn.addEventListener("click", ()=>{
      podio2027 = { campeao: finalBox.vencedor, vice: finalBox.perdedor, terceiro: terceiroBox.vencedor };
      if(typeof renderChampionsHistory === "function") renderChampionsHistory();
      alert("Pódio 2026/2027 atualizado na aba Campeões!");
    });
  }
}

/* Delegação de eventos: placares e pênaltis (funciona pra qualquer
   fase — qf1..qf4, sf1, sf2, final, terceiro — pela chave data-key) */
safeOn("final4Bracket", "input", (e)=>{
  const el = e.target;
  const key = el.dataset.key;
  if(!key || !final4State.placares[key]) return;

  if(el.matches(".f4-score-casa")) final4State.placares[key].casa = el.value;
  if(el.matches(".f4-score-fora")) final4State.placares[key].fora = el.value;
  renderFinal4();
});

safeOn("final4Bracket", "change", (e)=>{
  const el = e.target;
  if(!el.matches(".f4-pen-select")) return;
  const key = el.dataset.key;
  if(!key || !final4State.placares[key]) return;

  if(el.value === "casa"){ final4State.placares[key].penCasa = "1"; final4State.placares[key].penFora = "0"; }
  else if(el.value === "fora"){ final4State.placares[key].penCasa = "0"; final4State.placares[key].penFora = "1"; }
  else { final4State.placares[key].penCasa = ""; final4State.placares[key].penFora = ""; }
  renderFinal4();
});

document.addEventListener("DOMContentLoaded", ()=>{
  renderFinal4();
});