/* =======================================================================
   NATIONS_FINAL4.JS
   Mata-mata da Liga A (Quartas de Final, Meias-finais, Final e 3º lugar)
   e Play-offs de Acesso/Rebaixamento (Liga A/B e Liga B/C)
   ======================================================================= */

const GRUPOS_LIGA_A = ["A1","A2","A3","A4"];

/* Confrontos oficiais das Quartas de Final (Ida e Volta)
   1º lugar (p) decide a volta em casa; 2º lugar (s) joga a ida em casa. */
const QUARTOS_PAREAMENTO = [
  { id:"qf1", p:"Alemanha",   s:"Bélgica",  idaData:"25/03/27 16:45", voltaData:"28/03/27 15:45" },
  { id:"qf2", p:"França",     s:"Espanha",  idaData:"25/03/27 16:45", voltaData:"28/03/27 15:45" },
  { id:"qf3", p:"Inglaterra", s:"Noruega",  idaData:"27/03/27 14:00", voltaData:"30/03/27 15:45" },
  { id:"qf4", p:"Portugal",   s:"Paises Baixos",  idaData:"27/03/27 16:45", voltaData:"30/03/27 15:45" }
];

/* Estado do mata-mata (em memória, não persiste após recarregar) */
const final4State = {
  placares: {
    sf1:{ casa:"", fora:"", penCasa:"", penFora:"" },
    sf2:{ casa:"", fora:"", penCasa:"", penFora:"" },
    final:{ casa:"", fora:"", penCasa:"", penFora:"" },
    terceiro:{ casa:"", fora:"", penCasa:"", penFora:"" }
  }
};

/* Lista os 8 classificados das Quartas de Final */
function renderQualificados(){
  const container = document.getElementById("final4Semifinalistas");
  if(!container) return;
  let html = "";
  QUARTOS_PAREAMENTO.forEach((par, idx)=>{
    html += `<div class="final4-team-chip">
      <span class="grupo-tag">QF${idx+1}</span> <span class="qualif-pos">1º</span> ${flagImg(par.p)} ${par.p}
    </div>`;
    html += `<div class="final4-team-chip">
      <span class="grupo-tag">QF${idx+1}</span> <span class="qualif-pos">2º</span> ${flagImg(par.s)} ${par.s}
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
        <option value="fora" ${placar.penFora!==""&&parseInt(placar.penFora)>parseInt(placar.penCasa||0)?"selected":""}>${timeFora}</option>
      </select>
    </div>`;
  }

  html += `<div class="f4-winner-tag">${resultado.vencedor ? `🏆 ${resultado.vencedor}` : "&nbsp;"}</div>
    </div>
  </div>`;

  return { html, vencedor: resultado.vencedor, perdedor: resultado.vencedor ? (resultado.vencedor===timeCasa?timeFora:timeCasa) : null, timeCasa, timeFora };
}

function resolverConfronto(placar, timeCasa, timeFora){
  const gc = parseInt(placar.casa), gf = parseInt(placar.fora);
  if(placar.casa === "" || placar.fora === "" || isNaN(gc) || isNaN(gf)){
    return { vencedor:null, empatou:false };
  }
  if(gc > gf) return { vencedor:timeCasa, empatou:false };
  if(gc < gf) return { vencedor:timeFora, empatou:false };
  if(placar.penCasa !== "" || placar.penFora !== ""){
    const pc = parseInt(placar.penCasa), pf = parseInt(placar.penFora);
    if(!isNaN(pc) && !isNaN(pf) && pc !== pf){
      return { vencedor: pc > pf ? timeCasa : timeFora, empatou:false };
    }
  }
  return { vencedor:null, empatou:true };
}

/* ---------- Quartas de Final: ida e volta ---------- */
const qfState = {};
QUARTOS_PAREAMENTO.forEach(p=>{ qfState[p.id] = { ida:{p:"",s:""}, volta:{p:"",s:""}, pen:"" }; });

function renderQuartaTie(par){
  const tP = par.p, tS = par.s;
  const st = qfState[par.id];
  const completo = [st.ida.p, st.ida.s, st.volta.p, st.volta.s].every(v => v !== "" && !isNaN(parseInt(v)));
  let agg = "", res = "", vencedor = null, empate = false;
  if(completo){
    const p = parseInt(st.ida.p) + parseInt(st.volta.p);
    const sc = parseInt(st.ida.s) + parseInt(st.volta.s);
    agg = `Agregado: ${tP} ${p} - ${sc} ${tS}`;
    if(p > sc) vencedor = tP;
    else if(sc > p) vencedor = tS;
    else if(st.pen === "p") vencedor = tP;
    else if(st.pen === "s") vencedor = tS;
    else empate = true;
    res = vencedor ? `🏆 ${vencedor} avança às meias-finais` : "Empate no agregado — escolha quem vence nos pênaltis";
  }
  const inp = (leg, side, val) =>
    `<input type="number" min="0" max="99" class="po-in qf-in" data-qf="${par.id}" data-leg="${leg}" data-side="${side}" value="${val}">`;
  const html = `<div class="po-tie" data-qf="${par.id}">
    <div class="f4-match-header">Quartas de Final — Jogo ${par.id.replace("qf","")}</div>
    <div class="po-body">
      <div class="po-leg-label">Ida · ${par.idaData}</div>
      <div class="po-leg">
        <span class="po-team">${flagImg(tS)} <span>${tS}</span></span>
        <span class="po-score">${inp("ida","s",st.ida.s)}-${inp("ida","p",st.ida.p)}</span>
        <span class="po-team right"><span>${tP}</span> ${flagImg(tP)}</span>
      </div>
      <div class="po-leg-label">Volta · ${par.voltaData}</div>
      <div class="po-leg">
        <span class="po-team">${flagImg(tP)} <span>${tP}</span></span>
        <span class="po-score">${inp("volta","p",st.volta.p)}-${inp("volta","s",st.volta.s)}</span>
        <span class="po-team right"><span>${tS}</span> ${flagImg(tS)}</span>
      </div>
      <div class="po-agg">${agg}</div>
      ${empate ? `<div class="po-pen"><select class="qf-pen-select" data-qf="${par.id}">
        <option value="">-- vence nos pênaltis --</option>
        <option value="p" ${st.pen==="p"?"selected":""}>${tP}</option>
        <option value="s" ${st.pen==="s"?"selected":""}>${tS}</option>
      </select></div>` : ""}
      <div class="po-result">${res}</div>
    </div>
  </div>`;
  return { html, vencedor };
}

function renderFinal4(){
  renderQualificados();

  const qf = QUARTOS_PAREAMENTO.map(par => renderQuartaTie(par));

  const sf1 = renderMatchBox({
    id:"sf1", titulo:"Meia-final 1", placarKey:"sf1",
    timeCasaFixo: qf[0].vencedor, timeForaFixo: qf[1].vencedor
  });
  const sf2 = renderMatchBox({
    id:"sf2", titulo:"Meia-final 2", placarKey:"sf2",
    timeCasaFixo: qf[2].vencedor, timeForaFixo: qf[3].vencedor
  });

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
    <div class="f4-stage-title">Quartas de Final — ida e volta (Liga A)</div>
    <div class="po-grid">${qf.map(q=>q.html).join("")}</div>
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

safeOn("final4Bracket", "input", (e)=>{
  const el = e.target;
  if(!el.matches(".qf-in")) return;
  const st = qfState[el.dataset.qf];
  if(!st) return;
  st[el.dataset.leg][el.dataset.side] = el.value;
  st.pen = "";
  const sel = `.qf-in[data-qf="${el.dataset.qf}"][data-leg="${el.dataset.leg}"][data-side="${el.dataset.side}"]`;
  renderFinal4();
  document.querySelector(sel)?.focus();
});

safeOn("final4Bracket", "change", (e)=>{
  const el = e.target;
  if(!el.matches(".qf-pen-select")) return;
  const st = qfState[el.dataset.qf];
  if(!st) return;
  st.pen = el.value;
  renderFinal4();
});

document.addEventListener("DOMContentLoaded", ()=>{
  renderFinal4();
});


/* =======================================================================
   PLAYOFFS DE ACESSO E REBAIXAMENTO (ida e volta)
   Ida: time da liga inferior (tB) joga em casa.
   Volta: time da liga superior (tA) joga em casa.
   ======================================================================= */
const PLAYOFFS = [
  // Liga A/B
  { id:"ab1", tipo:"A/B", ligaAlta:"A", ligaBaixa:"B", i:0, tB:"Bósnia e Herzegovina", tA:"Dinamarca",     idaData:"25/03/27 16:45", voltaData:"28/03/27 15:45" },
  { id:"ab2", tipo:"A/B", ligaAlta:"A", ligaBaixa:"B", i:1, tB:"Hungria",              tA:"Sérvia",        idaData:"25/03/27 16:45", voltaData:"28/03/27 13:00" },
  { id:"ab3", tipo:"A/B", ligaAlta:"A", ligaBaixa:"B", i:2, tB:"Eslovênia",            tA:"País de Gales", idaData:"27/03/27 16:45", voltaData:"30/03/27 15:45" },
  { id:"ab4", tipo:"A/B", ligaAlta:"A", ligaBaixa:"B", i:3, tB:"República da Irlanda",              tA:"Croácia",       idaData:"27/03/27 16:45", voltaData:"30/03/27 15:45" },

  // Liga B/C
  { id:"bc1", tipo:"B/C", ligaAlta:"B", ligaBaixa:"C", i:0, tB:"Chipre",               tA:"Macedonia do Norte",  idaData:"25/03/27 14:00", voltaData:"28/03/27 10:00" },
  { id:"bc2", tipo:"B/C", ligaAlta:"B", ligaBaixa:"C", i:1, tB:"Bielorrússia",         tA:"Israel",        idaData:"25/03/27 16:45", voltaData:"28/03/27 15:45" },
  { id:"bc3", tipo:"B/C", ligaAlta:"B", ligaBaixa:"C", i:2, tB:"Ilhas Faroé",          tA:"Geórgia",       idaData:"27/03/27 11:00", voltaData:"30/03/27 13:00" },
  { id:"bc4", tipo:"B/C", ligaAlta:"B", ligaBaixa:"C", i:3, tB:"Estônia",              tA:"Romênia",       idaData:"27/03/27 14:00", voltaData:"30/03/27 15:45" }
];

const playoffState = {};
PLAYOFFS.forEach(p=>{ playoffState[p.id] = { ida:{b:"",a:""}, volta:{a:"",b:""}, pen:"" }; });

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

function textoResultadoPlayoff(p){
  const tAlta = p.tA, tBaixa = p.tB;
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
  const dicas = {
    "A/B": "2 piores 3º + 2 melhores 4º da Liga A contra os 4 segundos da Liga B, em ida e volta. Quem vence fica na (ou sobe para a) Liga A. Os 2 piores 4º da Liga A descem direto.",
    "B/C": "Os 4 últimos da Liga B contra os 4 segundos da Liga C, em ida e volta. Quem vence fica na (ou sobe para a) Liga B."
  };
  let html = "";
  ["A/B","B/C"].forEach(tipo=>{
    html += `<div class="f4-stage-title">Play-offs Liga ${tipo}</div><p class="hint centro">${dicas[tipo]}</p><div class="po-grid">`;
    PLAYOFFS.filter(p=>p.tipo===tipo).forEach(p=>{
      const { tA, tB } = p;
      const s = playoffState[p.id];
      const t = textoResultadoPlayoff(p);
      const inp = (leg, side, val) =>
        `<input type="number" min="0" max="99" class="po-in" data-tie="${p.id}" data-leg="${leg}" data-side="${side}" value="${val}">`;
      html += `<div class="po-tie" data-tie="${p.id}">
        <div class="f4-match-header">Jogo ${p.i+1}</div>
        <div class="po-body">
          <div class="po-leg-label">Ida · ${p.idaData}</div>
          <div class="po-leg">
            <span class="po-team">${flagImg(tB)} <span>${tB}</span></span>
            <span class="po-score">${inp("ida","b",s.ida.b)}-${inp("ida","a",s.ida.a)}</span>
            <span class="po-team right"><span>${tA}</span> ${flagImg(tA)}</span>
          </div>
          <div class="po-leg-label">Volta · ${p.voltaData}</div>
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

function atualizarTiePlayoff(id){
  const p = PLAYOFFS.find(x=>x.id===id);
  const card = document.querySelector(`.po-tie[data-tie="${id}"]`);
  if(!p || !card) return;
  const r = resultadoPlayoff(p);
  const t = textoResultadoPlayoff(p);
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

document.addEventListener("DOMContentLoaded", renderPlayoffs);
safeOn("nationsSubTabs", "click", (e)=>{
  if(e.target.closest(".sub-tab-btn")?.dataset.sub === "final4") renderPlayoffs();
});
