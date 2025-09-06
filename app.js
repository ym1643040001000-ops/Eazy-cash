
(function(){
  const $ = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));

  if(location.pathname.endsWith("index.html") || location.pathname=="/" ){
    const introSeen = sessionStorage.getItem("introSeen");
    if(!introSeen){
      const l = document.getElementById("global-loader");
      l.classList.remove("hidden");
      setTimeout(()=>{ l.classList.add("hidden"); sessionStorage.setItem("introSeen","1"); }, 5000);
    }
  }
  $$("a[href$='.html']").forEach(a=>{
    a.addEventListener("click", e=>{
      const l = document.getElementById("global-loader"); if(!l) return;
      l.classList.remove("hidden");
      setTimeout(()=>{}, 200);
    });
  });

  const dict = {
    ar: {home:"الرئيسية", payments:"سحب/إيداع", profile:"الملف", login:"دخول", lang:"EN",
      balance_card_title:"الرصيد الحالي", profit_card_title:"أرباحك من التجارة",
      actions_deposit:"إيداع", actions_withdraw:"سحب", actions_buy:"شراء", actions_sell:"بيع",
      actions_trades:"صفقاتي", actions_spin:"سبين", actions_rewards:"مكافآتي",
      earnings:"أرباح مستخدمين", orders:"عدد طلبات", view_all:"عرض الكل", market:"السوق"},
    en: {home:"Home", payments:"Payments", profile:"Profile", login:"Login", lang:"AR",
      balance_card_title:"Current Balance", profit_card_title:"Your Trading Profit",
      actions_deposit:"Deposit", actions_withdraw:"Withdraw", actions_buy:"Buy", actions_sell:"Sell",
      actions_trades:"My Trades", actions_spin:"Spin", actions_rewards:"Rewards",
      earnings:"Users' Earnings", orders:"Total Orders", view_all:"View all", market:"Market"}
  };
  const langToggle = $("#langToggle");
  const setLang = (lg)=>{
    document.documentElement.dir = (lg==="ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lg);
    $$("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n");
      if(dict[lg][k]) el.textContent = dict[lg][k];
    });
    if(langToggle){ langToggle.textContent = dict[lg].lang; }
  };
  const currentLang = localStorage.getItem("lang") || "ar";
  setLang(currentLang);
  if(langToggle){ langToggle.addEventListener("click", ()=> setLang(localStorage.getItem("lang")==="ar"?"en":"ar")); }

  window.showToast = (msg)=>{
    const t = document.getElementById("toast");
    const el = document.createElement("div"); el.className="toast"; el.textContent = msg;
    t.appendChild(el); setTimeout(()=> el.remove(), 3000);
  };

  const names = ["Ahmed","Mona","Sara","Omar","Ali","Youssef","Hana","Karim","Reem","Nour","Hassan","Lena","Mostafa","Eman","Ziad"];
  function randomTx(){
    const n = names[Math.floor(Math.random()*names.length)];
    const act = Math.random()<0.5 ? "Buy" : "Sell";
    const sym = (window.EAZY_COINS||["BTC","ETH","USDT"])[Math.floor(Math.random()*(window.EAZY_COINS||["BTC","ETH","USDT"]).length)];
    const amt = (Math.floor(Math.random()*9)+1)*1000;
    return `${n} – ${act} ${amt} ${sym}`;
  }
  const ticker = $("#liveTicker");
  if(ticker){
    const runner = ()=>{ ticker.innerHTML = `<span>${randomTx()}</span><span>${randomTx()}</span><span>${randomTx()}</span><span>${randomTx()}</span>`; };
    runner(); setInterval(runner, 5000);
  }

  const STATS_KEY = "eazy_stats";
  function getStats(){ try{ return JSON.parse(localStorage.getItem(STATS_KEY)) || { totalEarnings:392331, totalOrders:84513 }; }catch(e){ return { totalEarnings:392331, totalOrders:84513 }; } }
  function setStats(s){ localStorage.setItem(STATS_KEY, JSON.stringify(s)); }
  function tickStats(){
    const s = getStats();
    s.totalEarnings += Math.floor(Math.random()*200)+50;
    s.totalOrders += Math.floor(Math.random()*3)+1;
    setStats(s);
    const earnEl = document.getElementById("statEarnings");
    const ordEl = document.getElementById("statOrders");
    if(earnEl) earnEl.textContent = s.totalEarnings.toLocaleString();
    if(ordEl) ordEl.textContent = s.totalOrders.toLocaleString();
  }
  if($("#statEarnings") && $("#statOrders")){
    const s = getStats();
    $("#statEarnings").textContent = s.totalEarnings.toLocaleString();
    $("#statOrders").textContent = s.totalOrders.toLocaleString();
    setInterval(tickStats, 60000);
    setTimeout(()=> showToast(currentLang==="ar" ? "أرباحك اليوم: +250 جنيه ✅" : "Today's earnings: +250 EGP ✅"), 1200);
  }

  function renderSix(){
    const grid = $("#sixCoins"); if(!grid || !window.EAZY_COINS) return;
    const picked = [...window.EAZY_COINS].sort(()=>Math.random()-0.5).slice(0,6);
    grid.innerHTML = "";
    picked.forEach(sym=>{
      const price = window.EAZY_PRICES[sym];
      const card = document.createElement("div"); card.className="coin";
      card.innerHTML = `
        <div class="row">
          <div class="name"><span>🪙</span><span>${sym}</span></div>
          <div class="badge ${Math.random()<0.5?'up':'down'}">${price}</div>
        </div>
        <div class="row mt-1"><div class="subtext">Bid</div><div class="subtext">${(price*0.995).toFixed(2)}</div></div>
        <div class="row mt-1"><div class="subtext">Ask</div><div class="subtext">${(price*1.005).toFixed(2)}</div></div>`;
      grid.appendChild(card);
    });
  }
  if($("#sixCoins")){ renderSix(); setInterval(renderSix, 12000); }

  function renderMarket(){
    const wrap = $("#marketGrid"); if(!wrap || !window.EAZY_COINS) return;
    wrap.innerHTML = "";
    window.EAZY_COINS.slice(0,100).forEach(sym=>{
      const price = window.EAZY_PRICES[sym]; const up = Math.random()<0.5;
      const el = document.createElement("div"); el.className="coin";
      el.innerHTML = `
        <div class="row">
          <div class="name"><span>🪙</span><span>${sym}</span></div>
          <div class="badge ${up?'up':'down'}">${price}</div>
        </div>
        <div class="row mt-1"><div class="subtext">Bid</div><div>${(price*0.995).toFixed(2)}</div></div>
        <div class="row mt-1"><div class="subtext">Ask</div><div>${(price*1.005).toFixed(2)}</div></div>
        <div class="row mt-2"><button class="btn buyBtn">Buy</button><button class="chip sellBtn" style="margin-left:8px">Sell</button></div>`;
      el.querySelector(".buyBtn").addEventListener("click", ()=>showToast(`Bought ${sym}`));
      el.querySelector(".sellBtn").addEventListener("click", ()=>showToast(`Sold ${sym}`));
      wrap.appendChild(el);
    });
  }
  if($("#marketGrid")){ renderMarket(); setInterval(renderMarket, 15000); }

  function chart(){
    const c = $("#earnChart"); if(!c) return;
    const ctx = c.getContext("2d"); const w = c.width = c.clientWidth; const h = c.height = 120;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = "rgba(123,215,255,.9)"; ctx.lineWidth = 2; ctx.beginPath();
    let x=10; const step=(w-20)/12; let yBase=h-20;
    for(let i=0;i<12;i++){ const y = yBase - Math.sin((i/12)*Math.PI)*30 - Math.random()*15;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); x+=step; }
    ctx.stroke();
  }
  if($("#earnChart")){ chart(); window.addEventListener("resize", chart); }

  if($("#adminLoginForm")){
    $("#adminLoginForm").addEventListener("submit", (e)=>{
      e.preventDefault();
      const email = e.target.email.value.trim(), pass = e.target.password.value.trim();
      if(email==="admin@eazycash.com" && pass==="123456"){ localStorage.setItem("admin","1"); location.href = "admin_panel.html"; }
      else{ showToast("Wrong credentials"); }
    });
  }
  if(location.pathname.endsWith("admin_panel.html")){
    if(localStorage.getItem("admin")!=="1"){ location.href="admin.html"; }
  }
})();