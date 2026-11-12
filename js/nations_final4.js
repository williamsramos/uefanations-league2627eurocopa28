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
    terceiro:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pab1:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pab2:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pab3:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pab4:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pbc1:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pbc2:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pbc3:{ casa:"", fora:"", penCasa:"", penFora:"" },
    pbc4:{ casa:"", fora:"", penCasa:"", penFora:"" }
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


/* =======================================================================
   PLAYOFFS DE ACESSO E REBAIXAMENTO (ida e volta)
   Liga A/B: 2 piores 3º + 2 melhores 4º da Liga A  x  4 segundos da Liga B
   Liga B/C: 4 últimos (4º) da Liga B  x  4 segundos da Liga C
   Quem vence fica (ou sobe para) a liga superior. Os confrontos seguem o
   ranking: melhor campanha da liga superior x pior da inferior.
   Ida: o time da liga inferior joga em casa. Volta: o da superior.
   ======================================================================= */
const PLAYOFFS = [];
[0,1,2,3].forEach(i=>{
  PLAYOFFS.push({ id:`ab${i+1}`, tipo:"A/B", ligaAlta:"A", ligaBaixa:"B", i, altaKey:"rebaixA", baixaKey:"promoB" });
});
[0,1,2,3].forEach(i=>{
  PLAYOFFS.push({ id:`bc${i+1}`, tipo:"B/C", ligaAlta:"B", ligaBaixa:"C", i, altaKey:"rebaixB", baixaKey:"promoC" });
});

const playoffState = {};
PLAYOFFS.forEach(p=>{ playoffState[p.id] = { ida:{b:"",a:""}, volta:{a:"",b:""}, pen:"" }; });

function timesPlayoff(p, cp){
  const alta = cp[p.altaKey][p.i];
  const baixa = cp[p.baixaKey][3 - p.i];
  return { tA: alta ? alta.time : "—", tB: baixa ? baixa.time : "—" };
}

function resultadoPlayoff(p){
  const s = playoffState[p.id];
  const vals = [s.ida.b, s.ida.a, s.volta.a, s.volta.b];
  if(vals.some(v => v === "" || isNaN(parseInt(v)))) return { completo:false };
  const b = parseInt(s.ida.b) + parseInt(s.volta.b);
  const a = parseInt(s.ida.a) + parseInt(s.volta.a);
  let vencedor = null, empate = false;
  if(a > b) vencedor = "alta";
  else if(b > a) vencedor = "baixa";
  else if(s.pen === "alta" || s.pen === "baixa") vencedor = s.pen;
  else empate = true;
  return { completo:true, a, b, vencedor, empate };
}

function textoResultadoPlayoff(p, tAlta, tBaixa){
  const r = resultadoPlayoff(p);
  if(!r.completo) return { agg:"", res:"", pen:false };
  const agg = `Agregado: ${tBaixa} ${r.b} - ${r.a} ${tAlta}`;
  if(r.empate) return { agg, res:"Empate no agregado — escolha quem vence nos pênaltis", pen:true };
  if(r.vencedor === "alta"){
    return { agg, res:`✅ ${tAlta} fica na Liga ${p.ligaAlta} · ⬇ ${tBaixa} fica na Liga ${p.ligaBaixa}`, pen:r.a === r.b };
  }
  return { agg, res:`⬆ ${tBaixa} sobe à Liga ${p.ligaAlta} · ⬇ ${tAlta} desce à Liga ${p.ligaBaixa}`, pen:r.a === r.b };
}

function renderPlayoffs(){
  const c = document.getElementById("playoffsContainer");
  if(!c) return;
  const cp = classificadosPlayoffs();
  const dicas = {
    "A/B": "2 piores 3º + 2 melhores 4º da Liga A contra os 4 segundos da Liga B, em ida e volta. Quem vence fica na (ou sobe para a) Liga A. Os 2 piores 4º da Liga A descem direto.",
    "B/C": "Os 4 últimos da Liga B contra os 4 segundos da Liga C, em ida e volta. Quem vence fica na (ou sobe para a) Liga B."
  };
  let html = "";
  ["A/B","B/C"].forEach(tipo=>{
    html += `<div class="f4-stage-title">Play-offs Liga ${tipo}</div><p class="hint centro">${dicas[tipo]}</p><div class="po-grid">`;
    PLAYOFFS.filter(p=>p.tipo===tipo).forEach(p=>{
      const { tA, tB } = timesPlayoff(p, cp);
      const s = playoffState[p.id];
      const t = textoResultadoPlayoff(p, tA, tB);
      const inp = (leg, side, val) =>
        `<input type="number" min="0" max="99" class="po-in" data-tie="${p.id}" data-leg="${leg}" data-side="${side}" value="${val}">`;
      html += `<div class="po-tie" data-tie="${p.id}">
        <div class="f4-match-header">Jogo ${p.i+1}</div>
        <div class="po-body">
          <div class="po-leg-label">Ida</div>
          <div class="po-leg">
            <span class="po-team">${flagImg(tB)} <span>${tB}</span></span>
            <span class="po-score">${inp("ida","b",s.ida.b)}-${inp("ida","a",s.ida.a)}</span>
            <span class="po-team right"><span>${tA}</span> ${flagImg(tA)}</span>
          </div>
          <div class="po-leg-label">Volta</div>
          <div class="po-leg">
            <span class="po-team">${flagImg(tA)} <span>${tA}</span></span>
            <span class="po-score">${inp("volta","a",s.volta.a)}-${inp("volta","b",s.volta.b)}</span>
            <span class="po-team right"><span>${tB}</span> ${flagImg(tB)}</span>
          </div>
          <div class="po-agg">${t.agg}</div>
          <div class="po-pen" ${t.pen && resultadoPlayoff(p).empate ? "" : "hidden"}>
            <select class="po-pen-select" data-tie="${p.id}">
              <option value="">-- vence nos pênaltis --</option>
              <option value="alta" ${s.pen==="alta"?"selected":""}>${tA}</option>
              <option value="baixa" ${s.pen==="baixa"?"selected":""}>${tB}</option>
            </select>
          </div>
          <div class="po-result">${t.res}</div>
        </div>
      </div>`;
    });
    html += `</div>`;
  });
  c.innerHTML = html;
}

/* Atualiza só o resumo de um confronto (sem recriar os inputs, pra não
   perder o foco enquanto se digita) */
function atualizarTiePlayoff(id){
  const p = PLAYOFFS.find(x=>x.id===id);
  const card = document.querySelector(`.po-tie[data-tie="${id}"]`);
  if(!p || !card) return;
  const { tA, tB } = timesPlayoff(p, classificadosPlayoffs());
  const r = resultadoPlayoff(p);
  const t = textoResultadoPlayoff(p, tA, tB);
  card.querySelector(".po-agg").textContent = t.agg;
  card.querySelector(".po-result").textContent = t.res;
  card.querySelector(".po-pen").hidden = !(r.completo && r.empate);
}

safeOn("playoffsContainer", "input", (e)=>{
  const el = e.target;
  if(!el.matches(".po-in")) return;
  const s = playoffState[el.dataset.tie];
  if(!s) return;
  s[el.dataset.leg][el.dataset.side] = el.value;
  s.pen = "";
  const sel = document.querySelector(`.po-pen-select[data-tie="${el.dataset.tie}"]`);
  if(sel) sel.value = "";
  atualizarTiePlayoff(el.dataset.tie);
});

safeOn("playoffsContainer", "change", (e)=>{
  const el = e.target;
  if(!el.matches(".po-pen-select")) return;
  playoffState[el.dataset.tie].pen = el.value;
  atualizarTiePlayoff(el.dataset.tie);
});

/* Redesenha ao entrar na aba (os times mudam com a classificação) e ao
   carregar a página */
document.addEventListener("DOMContentLoaded", renderPlayoffs);
safeOn("nationsSubTabs", "click", (e)=>{
  if(e.target.closest(".sub-tab-btn")?.dataset.sub === "final4") renderPlayoffs();
});