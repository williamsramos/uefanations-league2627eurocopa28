/* =======================================================================
   NATIONS_JOGOS.JS
   Calendário de jogos (Jornadas 1 a 6) da fase de grupos da Nations
   League 2026/2027 + campos de input para os placares.
   Fonte: https://pt.uefa.com/uefanationsleague/fixtures-results/
   ======================================================================= */

/* Cada jogo: { grupo, casa, fora, hora (opcional) } */
const FIXTURES = [
  {
    jornada: 1,
    dias: [
      { data:"Quinta-feira, 24 de Setembro", jogos:[
        {grupo:"D1", casa:"Andorra", fora:"Malta", hora: "13:00"} ,
        {grupo:"A2", casa:"Holanda", fora:"Alemanha", hora: "15:45"},
        {grupo:"A2", casa:"Sérvia", fora:"Grécia" , hora: "15:45" },
        {grupo:"A4", casa:"Noruega", fora:"Dinamarca" , hora: "15:45"},
        {grupo:"A4", casa:"Portugal", fora:"País de Gales" , hora: "15:45"},
        {grupo:"B3", casa:"Áustria", fora:"Israel" , hora: "15:45"},
        {grupo:"B3", casa:"Kosovo", fora:"Irlanda" , hora: "15:45"},
        {grupo:"D2", casa:"Liechtenstein", fora:"Lituânia" , hora: "15:45"}
      ]},
      { data:"Sexta-feira, 25 de Setembro", jogos:[
        {grupo:"B2", casa:"Geórgia", fora:"Irl. do Norte", hora:"13:00"},
        {grupo:"C2", casa:"Arménia", fora:"Letónia", hora:"13:00"},
        {grupo:"A1", casa:"Itália", fora:"Bélgica" , hora: "15:45"},
        {grupo:"A1", casa:"Turquia", fora:"França" , hora: "15:45"},
        {grupo:"B2", casa:"Hungria", fora:"Ucrânia", hora: "15:45"},
        {grupo:"B4", casa:"Polónia", fora:"Bósnia e Herz." , hora: "15:45"},
        {grupo:"B4", casa:"Suécia", fora:"Roménia" , hora: "15:45"},
        {grupo:"C2", casa:"Montenegro", fora:"Chipre" , hora: "15:45"}
      ]},
      { data:"Sábado, 26 de Setembro", jogos:[
        {grupo:"B1", casa:"Eslovénia", fora:"Escócia", hora:"10:00"},
        {grupo:"B1", casa:"Macedónia", fora:"Suíça" , hora: "15:45"},
        {grupo:"C1", casa:"San Marino", fora:"Finlândia", hora:"13:00"},
        {grupo:"C1", casa:"Albânia", fora:"Bielorrússia" , hora: "15:45"},
        {grupo:"C3", casa:"Ilhas Faroé", fora:"Cazaquistão", hora:"13:00"},
        {grupo:"C3", casa:"Eslováquia", fora:"Moldávia" , hora: "15:45"},
        {grupo:"C4", casa:"Bulgária", fora:"Luxemburgo", hora:"13:00"},
        {grupo:"C4", casa:"Islândia", fora:"Estónia", hora:"15:45"},
        {grupo:"A3", casa:"Chéquia", fora:"Croácia" , hora: "15:45"},
        {grupo:"A3", casa:"Inglaterra", fora:"Espanha" , hora: "15:45"}
      ]}
    ]
  },
  {
    jornada: 2,
    dias: [
      { data:"Domingo, 27 de Setembro", jogos:[
        {grupo:"D2", casa:"Lituânia", fora:"Azerbaijão", hora:"10:00"},
        {grupo:"B3", casa:"Áustria", fora:"Kosovo", hora:"13:00"},
        {grupo:"B3", casa:"Israel", fora:"Irlanda" , hora: "15:45"},
        {grupo:"A4", casa:"Dinamarca", fora:"País de Gales", hora:"13:00"},
        {grupo:"A4", casa:"Noruega", fora:"Portugal" , hora: "15:45"},
        {grupo:"A2", casa:"Sérvia", fora:"Holanda", hora:"13:00"},
        {grupo:"A2", casa:"Alemanha", fora:"Grécia" , hora: "15:45"},
        {grupo:"D1", casa:"Gibraltar", fora:"Andorra", hora:"13:00"}
      ]},
      { data:"Segunda-feira, 28 de Setembro", jogos:[
        {grupo:"B2", casa:"Geórgia", fora:"Ucrânia", hora:"13:00"},
        {grupo:"B2", casa:"Irl. do Norte", fora:"Hungria" , hora: "15:45"},
        {grupo:"C2", casa:"Arménia", fora:"Montenegro", hora:"13:00"},
        {grupo:"C2", casa:"Letónia", fora:"Chipre", hora:"13:00"},
        {grupo:"B4", casa:"Roménia", fora:"Bósnia e Herz." , hora: "15:45"},
        {grupo:"B4", casa:"Suécia", fora:"Polónia" , hora: "15:45"},
        {grupo:"A1", casa:"Bélgica", fora:"França" , hora: "15:45"},
        {grupo:"A1", casa:"Turquia", fora:"Itália" , hora: "15:45"}
       
      ]},
      { data:"Terça-feira, 29 de Setembro", jogos:[
        {grupo:"C3", casa:"Moldávia", fora:"Ilhas Faroé", hora:"13:00"},
        {grupo:"C3", casa:"Eslováquia", fora:"Cazaquistão" , hora: "15:45"},
        {grupo:"C1", casa:"Finlândia", fora:"Bielorrússia", hora:"13:00"},
        {grupo:"C1", casa:"San Marino", fora:"Albânia", hora: "15:45"},
        {grupo:"B1", casa:"Escócia", fora:"Suíça" , hora: "15:45"},
        {grupo:"B1", casa:"Eslovénia", fora:"Macedónia" , hora: "15:45"},
        {grupo:"A3", casa:"Chéquia", fora:"Inglaterra" , hora: "15:45"},
        {grupo:"A3", casa:"Espanha", fora:"Croácia" , hora: "15:45"},
        {grupo:"C4", casa:"Bulgária", fora:"Estónia" , hora: "15:45"},
        {grupo:"C4", casa:"Luxemburgo", fora:"Islândia" , hora: "15:45"}
      ]}
    ]
  },
  {
    jornada: 3,
    dias: [
      { data:"Quinta-feira, 1 de Outubro", jogos:[
        {grupo:"D2", casa:"Azerbaijão", fora:"Liechtenstein", hora:"13:00"},
        {grupo:"B3", casa:"Israel", fora:"Kosovo" , hora: "15:45"},
        {grupo:"B3", casa:"Irlanda", fora:"Áustria"  , hora: "15:45"},
        {grupo:"A4", casa:"Dinamarca", fora:"Portugal" , hora: "15:45"},
        {grupo:"A4", casa:"País de Gales", fora:"Noruega" , hora: "15:45"},
        {grupo:"A2", casa:"Alemanha", fora:"Sérvia" , hora: "15:45"},
        {grupo:"A2", casa:"Grécia", fora:"Holanda" , hora: "15:45"},
        {grupo:"D1", casa:"Malta", fora:"Gibraltar" , hora: "15:45"}
      ]},
      { data:"Sexta-feira, 2 de Outubro", jogos:[
        {grupo:"C3", casa:"Cazaquistão", fora:"Moldávia", hora:"11:00"},
        {grupo:"C3", casa:"Ilhas Faroé", fora:"Eslováquia" , hora: "15:45"},
        {grupo:"C2", casa:"Chipre", fora:"Arménia", hora:"17:00"},
        {grupo:"C2", casa:"Letónia", fora:"Montenegro", hora:"17:00"},
        {grupo:"B4", casa:"Bósnia e Herz.", fora:"Suécia" , hora: "15:45"},
        {grupo:"B4", casa:"Polónia", fora:"Roménia" , hora: "15:45"},
        {grupo:"B2", casa:"Hungria", fora:"Geórgia" , hora: "15:45"},
        {grupo:"B2", casa:"Ucrânia", fora:"Irl. do Norte" , hora: "15:45"},
        {grupo:"A1", casa:"Bélgica", fora:"Turquia" , hora: "15:45"},
        {grupo:"A1", casa:"França", fora:"Itália" , hora: "15:45"} 
      ]},
      { data:"Sábado, 3 de Outubro", jogos:[
        {grupo:"C1", casa:"Finlândia", fora:"Albânia", hora:"10:00"},
        {grupo:"C1", casa:"Bielorrússia", fora:"San Marino", hora:"13:00"},
        {grupo:"A3", casa:"Croácia", fora:"Inglaterra", hora:"13:00"},
        {grupo:"A3", casa:"Espanha", fora:"Chéquia" , hora: "15:45"},
        {grupo:"C4", casa:"Estónia", fora:"Luxemburgo", hora:"13:00"},
        {grupo:"C4", casa:"Islândia", fora:"Bulgária", hora:"13:00"},
        {grupo:"B1", casa:"Macedónia", fora:"Escócia" , hora: "15:45"},
        {grupo:"B1", casa:"Suíça", fora:"Eslovénia" , hora: "15:45"}
      ]}
    ]
  },
  {
    jornada: 4,
    dias: [
      { data:"Domingo, 4 de Outubro", jogos:[
        {grupo:"D2", casa:"Azerbaijão", fora:"Lituânia", hora:"10:00"},
        {grupo:"B3", casa:"Kosovo", fora:"Áustria", hora:"13:00"},
        {grupo:"B3", casa:"Irlanda", fora:"Israel" , hora: "15:45"},
        {grupo:"D1", casa:"Malta", fora:"Andorra", hora:"13:00"},
        {grupo:"A4", casa:"Portugal", fora:"Noruega" , hora: "15:45"},
        {grupo:"A4", casa:"País de Gales", fora:"Dinamarca" , hora: "15:45"},
        {grupo:"A2", casa:"Grécia", fora:"Alemanha" , hora: "15:45"},
        {grupo:"A2", casa:"Holanda", fora:"Sérvia" , hora: "15:45"}
        
      ]},
      { data:"Segunda-feira, 5 de Outubro", jogos:[
        {grupo:"C2", casa:"Chipre", fora:"Letónia", hora:"13:00"},
        {grupo:"C2", casa:"Montenegro", fora:"Arménia" , hora: "15:45"},
        {grupo:"B4", casa:"Bósnia e Herz.", fora:"Polónia" , hora: "15:45"},
        {grupo:"B4", casa:"Roménia", fora:"Suécia" , hora: "15:45"},
        {grupo:"B2", casa:"Irl. do Norte", fora:"Geórgia" , hora: "15:45"},
        {grupo:"B2", casa:"Ucrânia", fora:"Hungria" , hora: "15:45"},
        {grupo:"A1", casa:"França", fora:"Bélgica" , hora: "15:45"},
        {grupo:"A1", casa:"Itália", fora:"Turquia" , hora: "15:45"}
      ]},
      { data:"Terça-feira, 6 de Outubro", jogos:[
        {grupo:"C3", casa:"Cazaquistão", fora:"Ilhas Faroé", hora:"11:00"},
        {grupo:"C3", casa:"Moldávia", fora:"Eslováquia" , hora: "15:45"},
        {grupo:"B1", casa:"Escócia", fora:"Eslovénia" , hora: "15:45"},
        {grupo:"B1", casa:"Suíça", fora:"Macedónia" , hora: "15:45"},
        {grupo:"A3", casa:"Croácia", fora:"Espanha" , hora: "15:45"},
        {grupo:"A3", casa:"Inglaterra", fora:"Chéquia" , hora: "15:45"},
        {grupo:"C4", casa:"Estónia", fora:"Islândia" , hora: "15:45"},
        {grupo:"C4", casa:"Luxemburgo", fora:"Bulgária" , hora: "15:45"},
        {grupo:"C1", casa:"Albânia", fora:"San Marino" , hora: "15:45"},
        {grupo:"C1", casa:"Bielorrússia", fora:"Finlândia" , hora: "15:45"}
      ]}
    ]
  },
  {
    jornada: 5,
    dias: [
      { data:"Quinta-feira, 12 de Novembro", jogos:[
        {grupo:"A1", casa:"Turquia", fora:"Bélgica", hora:"14:00"},
        {grupo:"A1", casa:"Itália", fora:"França", hora: "16:45"},
        {grupo:"C2", casa:"Arménia", fora:"Chipre", hora:"14:00"},
        {grupo:"A3", casa:"Chéquia", fora:"Espanha", hora: "16:45"},
        {grupo:"A3", casa:"Inglaterra", fora:"Croácia" , hora: "16:45"},
        {grupo:"C1", casa:"Albânia", fora:"Finlândia",  hora: "16:45"},
        {grupo:"C1", casa:"San Marino", fora:"Bielorrússia" , hora: "16:45"},
        {grupo:"C2", casa:"Montenegro", fora:"Letónia" , hora: "16:45"}
      ]},
      { data:"Sexta-feira, 13 de Novembro", jogos:[
        {grupo:"C3", casa:"Moldávia", fora:"Cazaquistão", hora:"14:00"},
        {grupo:"C3", casa:"Eslováquia", fora:"Ilhas Faroé", hora: "16:45"},
        {grupo:"B1", casa:"Escócia", fora:"Macedónia" , hora: "16:45"},
        {grupo:"B1", casa:"Eslovénia", fora:"Suíça" , hora: "16:45"},
        {grupo:"D2", casa:"Liechtenstein", fora:"Azerbaijão" , hora: "16:45"},
        {grupo:"A2", casa:"Holanda", fora:"Grécia" , hora: "16:45"},
        {grupo:"A2", casa:"Sérvia", fora:"Alemanha" , hora: "16:45"},
        {grupo:"C4", casa:"Bulgária", fora:"Islândia" , hora: "16:45"},
        {grupo:"C4", casa:"Luxemburgo", fora:"Estónia" , hora: "16:45"},
        {grupo:"D1", casa:"Andorra", fora:"Gibraltar" , hora: "16:45"},
        
      ]},
      { data:"Sábado, 14 de Novembro", jogos:[
        {grupo:"B3", casa:"Kosovo", fora:"Israel", hora:"11:00"},
        {grupo:"B3", casa:"Áustria", fora:"Irlanda", hora: "16:45"},
        {grupo:"B2", casa:"Irl. do Norte", fora:"Ucrânia", hora: "16:45"},
        {grupo:"B2", casa:"Geórgia", fora:"Hungria", hora:"14:00"},
        {grupo:"A4", casa:"Noruega", fora:"País de Gales", hora:"14:00"},
        {grupo:"A4", casa:"Portugal", fora:"Dinamarca", hora: "16:45"},
        {grupo:"B4", casa:"Roménia", fora:"Polónia", hora: "16:45"},
        {grupo:"B4", casa:"Suécia", fora:"Bósnia e Herz.", hora: "16:45"}
      ]}
    ]
  },
  {
    jornada: 6,
    dias: [
      { data:"Domingo, 15 de Novembro", jogos:[
        {grupo:"C2", casa:"Chipre", fora:"Montenegro", hora:"11:00"},
        {grupo:"C2", casa:"Letónia", fora:"Arménia", hora:"11:00"},
        {grupo:"C1", casa:"Bielorrússia", fora:"Albânia", hora:"14:00"},
        {grupo:"C1", casa:"Finlândia", fora:"San Marino", hora:"14:00"},
        {grupo:"A1", casa:"Bélgica", fora:"Itália", hora: "16:45"},
        {grupo:"A1", casa:"França", fora:"Turquia" , hora: "16:45"},
        {grupo:"A3", casa:"Croácia", fora:"Chéquia" , hora: "16:45"},
        {grupo:"A3", casa:"Espanha", fora:"Inglaterra" , hora: "16:45"}
      ]},
      { data:"Segunda-feira, 16 de Novembro", jogos:[
        {grupo:"C3", casa:"Ilhas Faroé", fora:"Moldávia", hora:"12:00"},
        {grupo:"C3", casa:"Cazaquistão", fora:"Eslováquia", hora:"12:00"},
        {grupo:"D2", casa:"Lituânia", fora:"Liechtenstein", hora:"14:00"},
        {grupo:"C4", casa:"Estónia", fora:"Bulgária", hora:"14:00"},
        {grupo:"C4", casa:"Islândia", fora:"Luxemburgo", hora:"14:00"},
        {grupo:"B1", casa:"Macedónia", fora:"Eslovénia" , hora:"16:45"},
        {grupo:"B1", casa:"Suíça", fora:"Escócia" , hora:"16:45"},
        {grupo:"A2", casa:"Alemanha", fora:"Holanda" , hora:"16:45"},
        {grupo:"A2", casa:"Grécia", fora:"Sérvia", hora:"16:45"},
        {grupo:"D1", casa:"Gibraltar", fora:"Malta" , hora:"16:45"}
      ]},
      { data:"Terça-feira, 17 de Novembro", jogos:[
        {grupo:"A4", casa:"Dinamarca", fora:"Noruega" , hora:"16:45"},
        {grupo:"A4", casa:"País de Gales", fora:"Portugal" , hora:"16:45"},
        {grupo:"B2", casa:"Hungria", fora:"Irl. do Norte" , hora:"16:45"},
        {grupo:"B2", casa:"Ucrânia", fora:"Geórgia" , hora:"16:45"},
        {grupo:"B3", casa:"Israel", fora:"Áustria" , hora:"16:45"},
        {grupo:"B3", casa:"Irlanda", fora:"Kosovo" , hora:"16:45"},
        {grupo:"B4", casa:"Bósnia e Herz.", fora:"Roménia" , hora:"16:45"},
        {grupo:"B4", casa:"Polónia", fora:"Suécia" , hora:"16:45"}
      ]}
    ]
  }
];

function matchKey(jornada, grupo, casa, fora){
  return `${grupo}::${casa}::${fora}::J${jornada}`;
}

/* Nota: computeStandings (em nations.js) lê a chave no formato
   "grupo::casa::fora" — ignoramos o sufixo da jornada ao separar. */

let jornadaAtual = 1;

function renderJornadaTabs(){
  const container = document.getElementById("jornadaTabs");
  if(!container) return;
  let html = "";
  FIXTURES.forEach(j=>{
    html += `<button class="jornada-btn ${jornadaAtual===j.jornada?'active':''}" data-jornada="${j.jornada}">Jornada ${j.jornada}</button>`;
  });
  container.innerHTML = html;
}

const jornadaTabsEl = document.getElementById("jornadaTabs");
if(jornadaTabsEl){
  jornadaTabsEl.addEventListener("click",(e)=>{
    const btn = e.target.closest(".jornada-btn");
    if(!btn) return;
    jornadaAtual = parseInt(btn.dataset.jornada);
    document.querySelectorAll(".jornada-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderJogos();
  });
}

const TOTAL_JOGOS = 156;

function jogoDisputado(key){
  const r = matchResults[key];
  if(!r) return false;
  if(r.golsCasa === "" || r.golsFora === "" || r.golsCasa === undefined || r.golsFora === undefined) return false;
  return !isNaN(parseInt(r.golsCasa)) && !isNaN(parseInt(r.golsFora));
}

function contarJogosDisputados(){
  let count = 0;
  FIXTURES.forEach(j=>{
    j.dias.forEach(dia=>{
      dia.jogos.forEach(m=>{
        const key = matchKey(j.jornada, m.grupo, m.casa, m.fora);
        if(jogoDisputado(key)) count++;
      });
    });
  });
  return count;
}

function updateProgressoJogos(){
  const el = document.getElementById("progressoJogos");
  if(!el) return;
  const disputados = contarJogosDisputados();
  const pct = Math.round((disputados / TOTAL_JOGOS) * 100);
  el.innerHTML = `
    <div class="texto">${disputados} de ${TOTAL_JOGOS} jogos disputados (${pct}%)</div>
    <div class="barra"><div class="barra-interna" style="width:${pct}%"></div></div>
  `;
}

function statusIconHtml(key){
  return jogoDisputado(key)
    ? `<span class="status-icon disputado" title="Jogo disputado">✔</span>`
    : `<span class="status-icon pendente" title="Ainda por disputar">⏳</span>`;
}

function renderJogos(){
  const container = document.getElementById("jogosContainer");
  if(!container) return; // HTML sem a aba Jogos atualizada — nada a fazer
  const aviso = document.getElementById("buscaJogosAviso");
  const jornadaNav = document.getElementById("jornadaTabs");

  updateProgressoJogos();

  /* ---- Modo busca: lista todos os jogos da seleção pesquisada,
     de todas as jornadas, ignorando a jornada selecionada ---- */
  if(buscaAtual){
    if(jornadaNav) jornadaNav.style.display = "none";
    const q = normaliza(buscaAtual);
    let encontrados = [];
    FIXTURES.forEach(j=>{
      j.dias.forEach(dia=>{
        dia.jogos.forEach(m=>{
          if(normaliza(m.casa).includes(q) || normaliza(m.fora).includes(q)){
            encontrados.push({ jornada:j.jornada, data:dia.data, ...m });
          }
        });
      });
    });

    if(encontrados.length === 0){
      if(aviso){ aviso.style.display = "block"; aviso.textContent = `Nenhum jogo encontrado para "${buscaAtual}".`; }
      container.innerHTML = "";
      return;
    }

    if(aviso){ aviso.style.display = "block"; aviso.textContent = `${encontrados.length} jogo(s) encontrado(s) para "${buscaAtual}"`; }

    let html = `<div class="date-block">`;
    encontrados.forEach(m=>{
      const key = matchKey(m.jornada, m.grupo, m.casa, m.fora);
      const saved = matchResults[key] || {};
      const buscaCasa = timeCorrespondeBusca(m.casa);
      const buscaFora = timeCorrespondeBusca(m.fora);
      html += `
        <div class="match-row ${(buscaCasa||buscaFora)?'row-buscada':''}" data-key="${key}">
          <div class="group-badge">${m.grupo}</div>
          <div class="team home">${flagImg(m.casa)} <span>${m.casa}</span></div>
          <div class="score-inputs">
            <input type="number" min="0" max="99" class="gol-casa" value="${saved.golsCasa ?? ""}" aria-label="Golos ${m.casa}">
            <span>-</span>
            <input type="number" min="0" max="99" class="gol-fora" value="${saved.golsFora ?? ""}" aria-label="Golos ${m.fora}">
          </div>
          <div class="team away"><span>${m.fora}</span> ${flagImg(m.fora)}</div>
          <div class="match-time">Jornada ${m.jornada}<br>${m.hora ?? ""}${statusIconHtml(key)}</div>
        </div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
    return;
  }

  /* ---- Modo normal: jogos da jornada selecionada ---- */
  if(jornadaNav) jornadaNav.style.display = "";
  if(aviso) aviso.style.display = "none";

  const jornadaObj = FIXTURES.find(j=>j.jornada === jornadaAtual);
  if(!jornadaObj){ container.innerHTML = ""; return; }

  let html = "";
  jornadaObj.dias.forEach(dia=>{
    html += `<div class="date-block"><h4>${dia.data}</h4>`;
    dia.jogos.forEach(m=>{
      const key = matchKey(jornadaAtual, m.grupo, m.casa, m.fora);
      const saved = matchResults[key] || {};
      html += `
        <div class="match-row" data-key="${key}">
          <div class="group-badge">${m.grupo}</div>
          <div class="team home">${flagImg(m.casa)} <span>${m.casa}</span></div>
          <div class="score-inputs">
            <input type="number" min="0" max="99" class="gol-casa" value="${saved.golsCasa ?? ""}" aria-label="Golos ${m.casa}">
            <span>-</span>
            <input type="number" min="0" max="99" class="gol-fora" value="${saved.golsFora ?? ""}" aria-label="Golos ${m.fora}">
          </div>
          <div class="team away"><span>${m.fora}</span> ${flagImg(m.fora)}</div>
          <div class="match-time">${m.hora ? m.hora : ""}${statusIconHtml(key)}</div>
        </div>`;
    });
    html += `</div>`;
  });

  container.innerHTML = html;
}

/* Escuta alterações nos inputs de placar (delegação de eventos) */
safeOn("jogosContainer", "input", (e)=>{
  const input = e.target;
  if(!input.matches(".gol-casa, .gol-fora")) return;
  const row = input.closest(".match-row");
  const key = row.dataset.key;
  const golsCasa = row.querySelector(".gol-casa").value;
  const golsFora = row.querySelector(".gol-fora").value;

  matchResults[key] = { golsCasa, golsFora };

  updateProgressoJogos();

  // Atualiza só o ícone de status desta linha, sem re-renderizar tudo
  const timeCell = row.querySelector(".match-time");
  if(timeCell){
    const statusEl = timeCell.querySelector(".status-icon");
    const novoIcon = jogoDisputado(key)
      ? `<span class="status-icon disputado" title="Jogo disputado">✔</span>`
      : `<span class="status-icon pendente" title="Ainda por disputar">⏳</span>`;
    if(statusEl) statusEl.outerHTML = novoIcon;
  }

  // Atualiza a classificação em tempo real, se a aba estiver visível
  if(document.getElementById("classificacao")?.classList.contains("active")){
    renderStandings();
  }

  // Se a Final Four já estiver a usar dados de standings, atualiza-a também
  if(typeof renderFinal4 === "function" &&
     document.getElementById("final4") &&
     document.getElementById("final4").classList.contains("active")){
    renderFinal4();
  }
});

document.addEventListener("DOMContentLoaded", ()=>{
  renderJornadaTabs();
  renderJogos();
});
