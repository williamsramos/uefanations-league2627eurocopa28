/* =======================================================================
   COMMON.JS
   Código compartilhado entre nations.html e euro.html: bandeiras, tema
   claro/escuro, botão voltar ao topo, e o utilitário de sub-abas.
   ======================================================================= */

/* Utilitário: só regista o listener se o elemento existir (evita que a
   página inteira quebre se algum HTML estiver desatualizado/faltando) */
function safeOn(id, event, handler){
  const el = document.getElementById(id);
  if(el) el.addEventListener(event, handler);
  return el;
}

/* ---------- Bandeiras (código ISO usado no flagcdn.com) ---------- */
const FLAGS = {
  "França":"fr", "Itália":"it", "Bélgica":"be", "Turquia":"tr",
  "Alemanha":"de", "Países Baixos":"nl", "Sérvia":"rs", "Grécia":"gr",
  "Espanha":"es", "Croácia":"hr", "Inglaterra":"gb-eng", "Chéquia":"cz",
  "Portugal":"pt", "Dinamarca":"dk", "Noruega":"no", "País de Gales":"gb-wls",
  "Escócia":"gb-sct", "Suíça":"ch", "Eslovénia":"si", "Macedónia do Norte":"mk",
  "Hungria":"hu", "Ucrânia":"ua", "Geórgia":"ge", "Irlanda do Norte":"gb-nir",
  "Israel":"il", "Áustria":"at", "República da Irlanda":"ie", "Kosovo":"xk",
  "Polónia":"pl", "Bósnia e Herzegovina":"ba", "Roménia":"ro", "Suécia":"se",
  "Albânia":"al", "Finlândia":"fi", "Bielorrússia":"by", "San Marino":"sm",
  "Chipre":"cy", "Montenegro":"me", "Arménia":"am", "Letónia":"lv",
  "Ilhas Faroé":"fo", "Cazaquistão":"kz", "Eslováquia":"sk", "República da Moldávia":"md",
  "Islândia":"is", "Bulgária":"bg", "Estónia":"ee", "Luxemburgo":"lu",
  "Gibraltar":"gi", "Malta":"mt", "Andorra":"ad",
  "Azerbaijão":"az", "Lituânia":"lt", "Liechtenstein":"li"
};

function flagUrl(team){
  const code = FLAGS[team];
  return code ? `https://flagcdn.com/w80/${code}.png` : "";
}

function flagImg(team, cls="flag"){
  if(!FLAGS[team]) return "";
  return `<img class="${cls}" src="${flagUrl(team)}" alt="Bandeira de ${team}" loading="lazy">`;
}

function normaliza(str){
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* =======================================================================
   SUB-ABAS GENÉRICAS (Classificação / Jogos / Final Four / Campeões)
   Funciona tanto na página da Nations League como na da Eurocopa —
   cada uma passa o id do seu próprio <nav>.
   ======================================================================= */
function bindSubTabs(navId){
  const nav = document.getElementById(navId);
  if(!nav) return;
  nav.addEventListener("click",(e)=>{
    const btn = e.target.closest(".sub-tab-btn");
    if(!btn) return;
    nav.querySelectorAll(".sub-tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const parent = nav.parentElement;
    parent.querySelectorAll(".sub-section").forEach(s=>s.classList.remove("active"));
    document.getElementById(btn.dataset.sub)?.classList.add("active");

    // Atualiza o conteúdo da aba ao entrar nela (só existe a função na
    // página certa — nas outras o typeof simplesmente não faz nada)
    if(btn.dataset.sub === "classificacao" && typeof renderStandings === "function") renderStandings();
    if(btn.dataset.sub === "jogos" && typeof renderJogos === "function") renderJogos();
    if(btn.dataset.sub === "final4" && typeof renderFinal4 === "function") renderFinal4();
    if(btn.dataset.sub === "euroCampeoes" && typeof renderEuroChampions === "function") renderEuroChampions();
  });
}

/* =======================================================================
   TEMA CLARO / ESCURO
   ======================================================================= */
const themeToggleBtn = document.getElementById("themeToggle");
if(themeToggleBtn){
  themeToggleBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeToggleBtn.textContent = isLight ? "☀️" : "🌙";
  });
}

/* =======================================================================
   BOTÃO VOLTAR AO TOPO (só aparece quando chega ao fim da página)
   ======================================================================= */
const voltarTopoBtn = document.getElementById("voltarTopoBtn");
if(voltarTopoBtn){
  function estaNoFimDaPagina(){
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const alturaVisivel = window.innerHeight;
    const alturaTotal = document.documentElement.scrollHeight;
    // pequena margem de tolerância (20px) para telas/zoom que não fecham exatamente no pixel
    return (scrollY + alturaVisivel) >= (alturaTotal - 20);
  }

  window.addEventListener("scroll", ()=>{
    voltarTopoBtn.classList.toggle("show", estaNoFimDaPagina());
  });
  window.addEventListener("resize", ()=>{
    voltarTopoBtn.classList.toggle("show", estaNoFimDaPagina());
  });

  // Reavalia quando o conteúdo da página muda de tamanho (troca de aba,
  // preenchimento de placares, etc.), já que isso muda onde é "o fim"
  const observadorConteudo = new MutationObserver(()=>{
    voltarTopoBtn.classList.toggle("show", estaNoFimDaPagina());
  });
  observadorConteudo.observe(document.body, { childList:true, subtree:true });

  voltarTopoBtn.addEventListener("click", ()=>{
    window.scrollTo({ top:0, behavior:"smooth" });
  });
}
