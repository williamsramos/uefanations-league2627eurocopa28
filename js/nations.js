/* =======================================================================
   NATIONS.JS
   Dados e lógica específicos da página da Nations League: grupos,
   classificação, busca de seleção, modo compacto e campeões.
   (Depende de common.js já carregado antes: safeOn, flagImg, normaliza)
   ======================================================================= */

/* ---------- Grupos da Nations League 2026/2027 ---------- */
const GROUPS = {
  A1: ["França","Itália","Bélgica","Turquia"],
  A2: ["Alemanha","Países Baixos","Sérvia","Grécia"],
  A3: ["Espanha","Croácia","Inglaterra","Chéquia"],
  A4: ["Portugal","Dinamarca","Noruega","País de Gales"],

  B1: ["Escócia","Suíça","Eslovénia","Macedónia do Norte"],
  B2: ["Hungria","Ucrânia","Geórgia","Irlanda do Norte"],
  B3: ["Israel","Áustria","República da Irlanda","Kosovo"],
  B4: ["Polónia","Bósnia e Herzegovina","Roménia","Suécia"],

  C1: ["Albânia","Finlândia","Bielorrússia","San Marino"],
  C2: ["Chipre","Montenegro","Arménia","Letónia"],
  C3: ["Ilhas Faroé","Cazaquistão","Eslováquia","República da Moldávia"],
  C4: ["Islândia","Bulgária","Estónia","Luxemburgo"],

  D1: ["Gibraltar","Malta","Andorra"],
  D2: ["Azerbaijão","Lituânia","Liechtenstein"]
};

const LIGAS = {
  A: ["A1","A2","A3","A4"],
  B: ["B1","B2","B3","B4"],
  C: ["C1","C2","C3","C4"],
  D: ["D1","D2"]
};

function ligaDoGrupo(grupo){ return grupo.charAt(0); }

/* ---------- Histórico de campeões ---------- */
const CHAMPIONS_HISTORY = [
  { edicao:"2018/2019", campeao:"Portugal", vice:"Países Baixos", terceiro:"Inglaterra" },
  { edicao:"2020/2021", campeao:"França", vice:"Espanha", terceiro:"Itália" },
  { edicao:"2022/2023", campeao:"Espanha", vice:"Croácia", terceiro:"Itália" }
];

/* Pódio 2026/2027 definido pelo utilizador (em memória, não persiste
   após recarregar a página) */
let podio2027 = { campeao:"", vice:"", terceiro:"" };

/* ---------- Resultados dos jogos (preenchido em nations_jogos.js) ---------- */
const matchResults = {}; // chave -> {golsCasa, golsFora}

/* =======================================================================
   SUB-ABAS DESTA PÁGINA
   ======================================================================= */
bindSubTabs("nationsSubTabs");

/* =======================================================================
   BUSCA RÁPIDA DE SELEÇÃO
   ======================================================================= */
let buscaAtual = "";
const buscaInput = document.getElementById("buscaSelecao");
const limparBuscaBtn = document.getElementById("limparBuscaBtn");

if(buscaInput){
  buscaInput.addEventListener("input", ()=>{
    buscaAtual = buscaInput.value.trim();
    if(limparBuscaBtn) limparBuscaBtn.classList.toggle("show", buscaAtual.length > 0);
    if(typeof renderStandings === "function") renderStandings();
    if(typeof renderJogos === "function") renderJogos();
  });
}

if(limparBuscaBtn){
  limparBuscaBtn.addEventListener("click", ()=>{
    if(buscaInput) buscaInput.value = "";
    buscaAtual = "";
    limparBuscaBtn.classList.remove("show");
    if(typeof renderStandings === "function") renderStandings();
    if(typeof renderJogos === "function") renderJogos();
  });
}

function grupoContemBusca(grupo){
  if(!buscaAtual) return true;
  const q = normaliza(buscaAtual);
  return GROUPS[grupo].some(t => normaliza(t).includes(q));
}

function timeCorrespondeBusca(time){
  if(!buscaAtual) return false;
  return normaliza(time).includes(normaliza(buscaAtual));
}

/* =======================================================================
   ABA CLASSIFICAÇÃO
   ======================================================================= */
let ligaAtual = "Todos";
let grupoAtual = "Todos";

function renderGrupoTabs(){
  const container = document.getElementById("grupoTabs");
  let grupos = [];
  if(ligaAtual === "Todos"){
    container.innerHTML = "";
    grupoAtual = "Todos";
    renderStandings();
    return;
  }
  grupos = LIGAS[ligaAtual];
  let html = `<button class="grupo-btn ${grupoAtual==='Todos'?'active':''}" data-grupo="Todos">Todos</button>`;
  grupos.forEach(g=>{
    html += `<button class="grupo-btn ${grupoAtual===g?'active':''}" data-grupo="${g}">${g}</button>`;
  });
  container.innerHTML = html;
  renderStandings();
}

safeOn("ligaTabs", "click", (e)=>{
  const btn = e.target.closest(".liga-btn");
  if(!btn) return;
  document.querySelectorAll(".liga-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  ligaAtual = btn.dataset.liga;
  grupoAtual = "Todos";
  renderGrupoTabs();
});

safeOn("grupoTabs", "click", (e)=>{
  const btn = e.target.closest(".grupo-btn");
  if(!btn) return;
  document.querySelectorAll(".grupo-btn").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  grupoAtual = btn.dataset.grupo;
  renderStandings();
});

function gruposParaMostrar(){
  let grupos;
  if(ligaAtual === "Todos") grupos = Object.keys(GROUPS);
  else if(grupoAtual === "Todos") grupos = LIGAS[ligaAtual];
  else grupos = [grupoAtual];

  if(buscaAtual){
    grupos = grupos.filter(g => grupoContemBusca(g));
  }
  return grupos;
}

function computeStandings(grupo){
  const teams = GROUPS[grupo];
  const table = {};
  teams.forEach(t=>{
    table[t] = { time:t, j:0, v:0, e:0, d:0, gp:0, gc:0, sg:0, pts:0 };
  });

  Object.keys(matchResults).forEach(key=>{
    const parts = key.split("::");
    const grp = parts[0], home = parts[1], away = parts[2];
    if(grp !== grupo) return;
    const r = matchResults[key];
    if(r.golsCasa === "" || r.golsFora === "" || r.golsCasa === undefined || r.golsFora === undefined) return;
    const gc = parseInt(r.golsCasa), gf = parseInt(r.golsFora);
    if(isNaN(gc) || isNaN(gf)) return;
    if(!table[home] || !table[away]) return;

    table[home].j++; table[away].j++;
    table[home].gp += gc; table[home].gc += gf;
    table[away].gp += gf; table[away].gc += gc;

    if(gc > gf){ table[home].v++; table[home].pts+=3; table[away].d++; }
    else if(gc < gf){ table[away].v++; table[away].pts+=3; table[home].d++; }
    else { table[home].e++; table[away].e++; table[home].pts++; table[away].pts++; }
  });

  const arr = Object.values(table);
  arr.forEach(t=> t.sg = t.gp - t.gc);
  arr.sort((a,b)=> b.pts-a.pts || b.sg-a.sg || b.gp-a.gp || a.time.localeCompare(b.time));
  return arr;
}

const LIGA_SOBE_PARA = { B:"A", C:"B", D:"C" }; // para onde sobe o 1º de cada liga
const LIGA_DESCE_PARA = { A:"B", B:"C", C:"D" }; // para onde desce o último de cada liga

function renderStandings(){
  const container = document.getElementById("standingsContainer");
  const grupos = gruposParaMostrar();

  if(buscaAtual && grupos.length === 0){
    container.innerHTML = `<p class="hint centro">Nenhuma seleção encontrada para "${buscaAtual}".</p>`;
    return;
  }

  let html = "";

  grupos.forEach(g=>{
    const standings = computeStandings(g);
    const liga = ligaDoGrupo(g);
    html += `<div class="group-block">
      <h3>Grupo ${g} <span class="liga-tag">Liga ${liga}</span></h3>
      <div class="table-scroll">
      <table class="standings-table">
        <thead><tr>
          <th>#</th><th style="text-align:left">Seleção</th><th>J</th><th>V</th><th>E</th><th>D</th>
          <th>GP</th><th>GC</th><th>SG</th><th>Pts</th>
        </tr></thead>
        <tbody>`;
    standings.forEach((t,i)=>{
      let rowClass = "";
      let tag = "";
      if(i === 0){
        if(liga === "A"){
          rowClass = "row-final4";
          tag = `<span class="status-tag final4">Final Four</span>`;
        } else {
          rowClass = "row-sobe";
          tag = `<span class="status-tag sobe">Sobe à Liga ${LIGA_SOBE_PARA[liga]}</span>`;
        }
      } else if(i === standings.length - 1 && standings.length > 1 && LIGA_DESCE_PARA[liga]){
        rowClass = "row-desce";
        tag = `<span class="status-tag desce">Desce à Liga ${LIGA_DESCE_PARA[liga]}</span>`;
      }
      if(timeCorrespondeBusca(t.time)) rowClass += " row-buscada";

      html += `<tr class="${rowClass}">
        <td><span class="pos-badge">${i+1}</span></td>
        <td class="team-cell">${flagImg(t.time)} ${t.time}${tag}</td>
        <td>${t.j}</td><td>${t.v}</td><td>${t.e}</td><td>${t.d}</td>
        <td>${t.gp}</td><td>${t.gc}</td><td>${t.sg}</td><td><strong>${t.pts}</strong></td>
      </tr>`;
    });
    html += `</tbody></table></div></div>`;
  });

  container.innerHTML = html;

  // reaplica o modo compacto (se estiver ativo) após recriar as tabelas
  container.classList.toggle("modo-compacto", modoCompactoAtivo);

  // pequena animação de destaque em todos os blocos ao (re)renderizar
  container.querySelectorAll(".group-block").forEach(block=>{
    block.classList.remove("atualizado");
    void block.offsetWidth; // força reflow para reiniciar a animação
    block.classList.add("atualizado");
  });
}

/* =======================================================================
   MODO COMPACTO (posição, seleção, V/E/D e pontos — só no responsivo)
   ======================================================================= */
let modoCompactoAtivo = false;
const modoCompactoBtn = document.getElementById("modoCompactoBtn");
if(modoCompactoBtn){
  modoCompactoBtn.addEventListener("click", ()=>{
    modoCompactoAtivo = !modoCompactoAtivo;
    modoCompactoBtn.classList.toggle("ativo", modoCompactoAtivo);
    document.getElementById("standingsContainer")?.classList.toggle("modo-compacto", modoCompactoAtivo);
  });
}

/* =======================================================================
   ABA CAMPEÕES
   ======================================================================= */
function todasAsSelecoes(){
  return Object.values(GROUPS).flat();
}

function renderChampionsHistory(){
  const container = document.getElementById("championsHistory");
  let list = [...CHAMPIONS_HISTORY];
  if(podio2027.campeao){
    list = [...list, { edicao:"2026/2027", campeao:podio2027.campeao, vice:podio2027.vice, terceiro:podio2027.terceiro }];
  }
  container.innerHTML = list.map(c=>`
    <div class="champion-card">
      <div class="edicao">${c.edicao}</div>
      <div class="podio-line">🥇 ${flagImg(c.campeao)} ${c.campeao}</div>
      <div class="podio-line">🥈 ${flagImg(c.vice)} ${c.vice}</div>
      <div class="podio-line">🥉 ${flagImg(c.terceiro)} ${c.terceiro}</div>
    </div>
  `).join("");
}

function fillPodioSelects(){
  const options = `<option value="">-- selecionar --</option>` +
    todasAsSelecoes().sort((a,b)=>a.localeCompare(b)).map(t=>`<option value="${t}">${t}</option>`).join("");
  ["campeaoSelect","viceSelect","terceiroSelect"].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = options;
  });
}

safeOn("salvarPodioBtn", "click", ()=>{
  const campeao = document.getElementById("campeaoSelect")?.value;
  const vice = document.getElementById("viceSelect")?.value;
  const terceiro = document.getElementById("terceiroSelect")?.value;
  if(!campeao || !vice || !terceiro){
    alert("Seleciona o campeão, o 2º e o 3º lugar antes de guardar.");
    return;
  }
  podio2027 = { campeao, vice, terceiro };
  renderChampionsHistory();
});

/* =======================================================================
   INICIALIZAÇÃO
   ======================================================================= */
document.addEventListener("DOMContentLoaded", ()=>{
  renderGrupoTabs();      // já chama renderStandings() para "Todos"
  fillPodioSelects();
  renderChampionsHistory();
});
