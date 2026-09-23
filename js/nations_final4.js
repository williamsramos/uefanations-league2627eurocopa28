/* =======================================================================
   NATIONS_FINAL4.JS
   Mata-mata da Final Four: os 4 vencedores dos grupos da Liga A
   (A1 a A4) disputam meias-finais, jogo de 3º lugar e final.
   ======================================================================= */

const GRUPOS_LIGA_A = ["A1","A2","A3","A4"];

/* Estado do mata-mata (em memória) */
const final4State = {
  pareamento: { sf1:["A1","A2"], sf2:["A3","A4"] }, // qual grupo em cada lado
  placares: {
    sf1: { casa:"", fora:"", penCasa:"", penFora:"" },
    sf2: { casa:"", fora:"", penCasa:"", penFora:"" },
    final: { casa:"", fora:"", penCasa:"", penFora:"" },
    terceiro: { casa:"", fora:"", penCasa:"", penFora:"" }
  }
};

function vencedorGrupoA(grupo){
  const standings = computeStandings(grupo);
  return standings[0].time;
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

function renderSemifinalistas(){
  const container = document.getElementById("final4Semifinalistas");
  let html = "";
  GRUPOS_LIGA_A.forEach(g=>{
    const vencedor = vencedorGrupoA(g);
    html += `<div class="final4-team-chip">
      <span class="grupo-tag">${g}</span> ${flagImg(vencedor)} ${vencedor}
    </div>`;
  });
  container.innerHTML = html;
}

function selectDeTimes(idSelect, valorAtual, opcoes){
  const options = opcoes.map(t => `<option value="${t}" ${t===valorAtual?"selected":""}>${t}</option>`).join("");
  return `<select id="${idSelect}" class="f4-team-pick">${options}</select>`;
}

function renderMatchBox({ id, titulo, timeCasaDefault, timeForaDefault, placarKey, timeCasaFixo, timeForaFixo, opcoesCasa, opcoesFora }){
  const placar = final4State.placares[placarKey];
  const timeCasa = timeCasaFixo || document.getElementById(`${id}-casa-select`)?.value || timeCasaDefault;
  const timeFora = timeForaFixo || document.getElementById(`${id}-fora-select`)?.value || timeForaDefault;

  const resultado = (timeCasa && timeFora) ? resolverConfronto(placar, timeCasa, timeFora) : { vencedor:null, empatou:false };
  const precisaPenaltis = resultado.empatou;

  const ladoCasa = opcoesCasa
    ? `${flagImg(timeCasa)}${selectDeTimes(`${id}-casa-select`, timeCasa, opcoesCasa)}`
    : `${flagImg(timeCasa, "flag flag-lg")}<span class="f4-team-name">${timeCasa || "—"}</span>`;

  const ladoFora = opcoesFora
    ? `${flagImg(timeFora)}${selectDeTimes(`${id}-fora-select`, timeFora, opcoesFora)}`
    : `${flagImg(timeFora, "flag flag-lg")}<span class="f4-team-name">${timeFora || "—"}</span>`;

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
  renderSemifinalistas();

  const todosOsVencedores = GRUPOS_LIGA_A.map(vencedorGrupoA);

  const sf1Casa = vencedorGrupoA(final4State.pareamento.sf1[0]);
  const sf1Fora = vencedorGrupoA(final4State.pareamento.sf1[1]);
  const sf2Casa = vencedorGrupoA(final4State.pareamento.sf2[0]);
  const sf2Fora = vencedorGrupoA(final4State.pareamento.sf2[1]);

  const sf1 = renderMatchBox({
    id:"sf1", titulo:"Meia-final 1",
    timeCasaDefault:sf1Casa, timeForaDefault:sf1Fora,
    placarKey:"sf1", timeCasaFixo:sf1Casa, timeForaFixo:sf1Fora
  });
  const sf2 = renderMatchBox({
    id:"sf2", titulo:"Meia-final 2",
    timeCasaDefault:sf2Casa, timeForaDefault:sf2Fora,
    placarKey:"sf2", timeCasaFixo:sf2Casa, timeForaFixo:sf2Fora
  });

  const finalBox = renderMatchBox({
    id:"final", titulo:"Final",
    placarKey:"final",
    timeCasaFixo: sf1.vencedor, timeForaFixo: sf2.vencedor
  });
  const terceiroBox = renderMatchBox({
    id:"terceiro", titulo:"Jogo de 3º lugar",
    placarKey:"terceiro",
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
    <div class="f4-stage-title">Meias-finais (define o par manualmente, se quiseres trocar)</div>
    <div class="f4-pareamento-controls">
      <label>Meia-final 1: 
        ${selectDeTimes("pareamentoSf1Casa", final4State.pareamento.sf1[0], GRUPOS_LIGA_A)}
        vs
        ${selectDeTimes("pareamentoSf1Fora", final4State.pareamento.sf1[1], GRUPOS_LIGA_A)}
      </label>
    </div>
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

/* Delegação de eventos: placares e pênaltis */
safeOn("final4Bracket", "input", (e)=>{
  const el = e.target;
  const key = el.dataset.key;
  if(!key) return;

  if(el.matches(".f4-score-casa")) final4State.placares[key].casa = el.value;
  if(el.matches(".f4-score-fora")) final4State.placares[key].fora = el.value;
  if(el.matches(".f4-pen-select")){
    // guarda um valor simbólico de pênaltis (1-0) a favor de quem foi escolhido
    if(el.value === "casa"){ final4State.placares[key].penCasa = "1"; final4State.placares[key].penFora = "0"; }
    else if(el.value === "fora"){ final4State.placares[key].penCasa = "0"; final4State.placares[key].penFora = "1"; }
    else { final4State.placares[key].penCasa = ""; final4State.placares[key].penFora = ""; }
  }
  renderFinal4();
});

/* Troca manual do emparelhamento das meias-finais */
safeOn("final4Bracket", "change", (e)=>{
  if(e.target.id === "pareamentoSf1Casa" || e.target.id === "pareamentoSf1Fora"){
    const casa = document.getElementById("pareamentoSf1Casa").value;
    const fora = document.getElementById("pareamentoSf1Fora").value;
    if(casa === fora) return; // evita repetir o mesmo grupo nos dois lados
    final4State.pareamento.sf1 = [casa, fora];
    final4State.pareamento.sf2 = GRUPOS_LIGA_A.filter(g => g !== casa && g !== fora);
    renderFinal4();
  }
});

document.addEventListener("DOMContentLoaded", ()=>{
  renderFinal4();
});
