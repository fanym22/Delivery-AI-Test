/* RecruitHub HR Portal - Prototype SPA (hash router, mock data) */
(function(){
  'use strict';

  /* ========= Mock Data ========= */
  const DEPARTMENTS = ['技术中心','产品部','人力资源部','市场部','运营部','设计中心'];
  const LOCATIONS = ['北京','上海','深圳','杭州','广州','远程'];
  const STAGES = [
    {key:'screening',label:'简历筛选',color:'blue'},
    {key:'shortlist',label:'初筛',color:'blue'},
    {key:'interview1',label:'一面',color:'orange'},
    {key:'interview2',label:'二面',color:'orange'},
    {key:'hr_chat',label:'HR面',color:'purple'},
    {key:'offer',label:'Offer',color:'green'},
    {key:'onboarded',label:'已入职',color:'dark'}
  ];
  const STAGE_KEYS = STAGES.map(s=>s.key);

  const JOBS = [
    {id:'j1',title:'高级前端工程师',department:'技术中心',location:'北京',headcount:2,salaryMin:25,salaryMax:40,experience:'3-5年',education:'本科',type:'社招',owner:'李敏',status:'open',jd:'负责公司招聘系统等 HR SaaS 产品的前端研发，参与架构设计、组件库建设和性能优化。',updatedAt:'2026-11-10 09:22',total:24,inPipeline:12,offers:2},
    {id:'j2',title:'后端工程师（Java）',department:'技术中心',location:'上海',headcount:3,salaryMin:22,salaryMax:38,experience:'3-5年',education:'本科',type:'社招',owner:'王强',status:'open',jd:'负责招聘核心业务服务端开发，包括职位、候选人、面试流程等模块。',updatedAt:'2026-11-09 18:04',total:31,inPipeline:15,offers:1},
    {id:'j3',title:'产品经理（招聘方向）',department:'产品部',location:'北京',headcount:1,salaryMin:25,salaryMax:45,experience:'5-10年',education:'本科',type:'社招',owner:'张琳',status:'open',jd:'负责招聘系统产品规划、需求分析和迭代推进。',updatedAt:'2026-11-08 14:30',total:18,inPipeline:8,offers:0},
    {id:'j4',title:'HR 招聘专员',department:'人力资源部',location:'深圳',headcount:2,salaryMin:10,salaryMax:18,experience:'1-3年',education:'本科',type:'社招',owner:'陈晨',status:'paused',jd:'负责技术岗位简历筛选、面试邀约和 offer 跟进。',updatedAt:'2026-11-05 10:10',total:12,inPipeline:5,offers:0},
    {id:'j5',title:'UI/UX 设计师',department:'设计中心',location:'杭州',headcount:1,salaryMin:18,salaryMax:30,experience:'3-5年',education:'本科',type:'社招',owner:'赵雪',status:'open',jd:'负责 B 端 HR SaaS 产品的 UI 设计与交互设计。',updatedAt:'2026-11-04 16:45',total:9,inPipeline:3,offers:0},
    {id:'j6',title:'2027 届校招 - 算法工程师',department:'技术中心',location:'北京',headcount:5,salaryMin:30,salaryMax:50,experience:'应届',education:'硕士',type:'校招',owner:'李敏',status:'draft',jd:'校招算法岗，负责推荐/匹配/NLP 方向。',updatedAt:'2026-11-02 11:20',total:0,inPipeline:0,offers:0},
    {id:'j7',title:'市场品牌经理',department:'市场部',location:'北京',headcount:1,salaryMin:20,salaryMax:35,experience:'5-10年',education:'本科',type:'社招',owner:'周洋',status:'closed',jd:'负责雇主品牌建设与市场活动。',updatedAt:'2026-10-22 09:05',total:14,inPipeline:0,offers:1}
  ];

  const CANDIDATES = [
    {id:'c1',name:'张三',jobId:'j1',stage:'screening',gender:'男',age:28,phone:'138****8821',email:'zhangsan@example.com',education:'本科',school:'北京邮电大学',major:'计算机科学与技术',years:5,currentCompany:'某互联网大厂',currentTitle:'高级前端工程师',tags:['大厂背景','React','急招'],source:'BOSS直聘',updatedAt:'2026-11-10 10:12',stageEnteredAt:'2026-11-09',
      educations:[{school:'北京邮电大学',major:'计算机科学与技术',degree:'本科',time:'2015-2019'}],
      experiences:[{company:'某互联网大厂',title:'高级前端工程师',time:'2022-至今',desc:'负责 B 端中后台系统前端架构，主导组件库建设；React/TypeScript 深度使用。'},{company:'某创业公司',title:'前端工程师',time:'2019-2022',desc:'参与 SaaS 产品从 0 到 1 研发。'}],
      timeline:[{type:'stage',title:'进入简历筛选',time:'2026-11-09 14:20',by:'李敏',desc:'候选人从 BOSS 直聘投递'}]},
    {id:'c2',name:'李婷',jobId:'j1',stage:'shortlist',gender:'女',age:26,phone:'139****2203',email:'liting@example.com',education:'硕士',school:'清华大学',major:'软件工程',years:3,currentCompany:'某头部 SaaS',currentTitle:'前端工程师',tags:['985','TypeScript','Node'],source:'内推',updatedAt:'2026-11-09 16:04',stageEnteredAt:'2026-11-08',
      educations:[{school:'清华大学',major:'软件工程',degree:'硕士',time:'2019-2022'},{school:'武汉大学',major:'计算机科学与技术',degree:'本科',time:'2015-2019'}],
      experiences:[{company:'某头部 SaaS',title:'前端工程师',time:'2022-至今',desc:'负责仪表盘模块性能优化，首屏从 3.8s 降至 1.2s。'}],
      timeline:[{type:'stage',title:'进入简历筛选',time:'2026-11-07 10:00',by:'李敏'},{type:'stage',title:'初筛通过',time:'2026-11-08 15:30',by:'李敏',desc:'简历匹配度高，学历和工作经历契合，安排一面。'}]},
    {id:'c3',name:'王浩然',jobId:'j1',stage:'interview1',gender:'男',age:30,phone:'135****7712',email:'wanghr@example.com',education:'本科',school:'华中科技大学',major:'软件工程',years:7,currentCompany:'某上市公司',currentTitle:'前端技术专家',tags:['架构','Vue','性能'],source:'猎头推荐',updatedAt:'2026-11-10 09:30',stageEnteredAt:'2026-11-06',
      educations:[{school:'华中科技大学',major:'软件工程',degree:'本科',time:'2013-2017'}],
      experiences:[{company:'某上市公司',title:'前端技术专家',time:'2020-至今',desc:'主导前端工程化、微前端架构。'}],
      timeline:[{type:'stage',title:'进入简历筛选',time:'2026-11-02'},{type:'stage',title:'初筛通过',time:'2026-11-04'},{type:'interview',title:'一面已安排',time:'2026-11-06 11:00',by:'李敏',desc:'面试官：技术负责人 张工，2026-11-12 14:00 现场面试。'}]},
    {id:'c4',name:'陈佳怡',jobId:'j1',stage:'interview2',gender:'女',age:27,phone:'137****9988',email:'chenjy@example.com',education:'硕士',school:'上海交通大学',major:'计算机',years:4,currentCompany:'某外企',currentTitle:'前端工程师',tags:['英语流利','跨团队','React'],source:'LinkedIn',updatedAt:'2026-11-08 11:20',stageEnteredAt:'2026-11-05',
      educations:[{school:'上海交通大学',major:'计算机',degree:'硕士',time:'2018-2021'}],
      experiences:[{company:'某外企',title:'前端工程师',time:'2021-至今',desc:'负责国际化产品，协同多地团队。'}],
      timeline:[{type:'stage',title:'一面通过',time:'2026-11-05',by:'张工',desc:'技术基础扎实，进入二面。'}]},
    {id:'c5',name:'刘建国',jobId:'j1',stage:'hr_chat',gender:'男',age:29,phone:'136****4455',email:'liujg@example.com',education:'本科',school:'北京理工大学',major:'软件工程',years:6,currentCompany:'某独角兽',currentTitle:'高级前端',tags:['P7 潜质','沟通好'],source:'内推',updatedAt:'2026-11-07 17:00',stageEnteredAt:'2026-11-07',
      educations:[{school:'北京理工大学',major:'软件工程',degree:'本科',time:'2014-2018'}],
      experiences:[{company:'某独角兽',title:'高级前端',time:'2019-至今'}],
      timeline:[{type:'stage',title:'二面通过',time:'2026-11-07',desc:'技术和业务理解均达标，进入 HR 面。'}]},
    {id:'c6',name:'赵敏',jobId:'j1',stage:'offer',gender:'女',age:28,phone:'138****1100',email:'zhaomin@example.com',education:'硕士',school:'浙江大学',major:'计算机',years:4,currentCompany:'某大厂',currentTitle:'前端工程师',tags:['Offer 审批中'],source:'校招回流',updatedAt:'2026-11-06 14:00',stageEnteredAt:'2026-11-06',
      educations:[{school:'浙江大学',major:'计算机',degree:'硕士',time:'2019-2022'}],
      experiences:[{company:'某大厂',title:'前端工程师',time:'2022-至今'}],
      timeline:[{type:'stage',title:'HR 面通过',time:'2026-11-06',desc:'已进入 Offer 审批，薪酬包 32k×15。'}]},
    {id:'c7',name:'孙悦',jobId:'j1',stage:'onboarded',gender:'女',age:26,phone:'135****6677',email:'sunyue@example.com',education:'本科',school:'复旦大学',major:'软件工程',years:3,currentCompany:'某大厂',currentTitle:'前端工程师',tags:['已入职'],source:'校招',updatedAt:'2026-10-20',stageEnteredAt:'2026-10-20',
      educations:[{school:'复旦大学',major:'软件工程',degree:'本科',time:'2019-2023'}],
      experiences:[{company:'某大厂',title:'前端工程师',time:'2023-2026'}],
      timeline:[{type:'stage',title:'已入职',time:'2026-10-20',desc:'已办理入职并分配 mentor。'}]},
    {id:'c8',name:'周强',jobId:'j1',stage:'screening',gender:'男',age:27,phone:'137****0099',email:'zhouq@example.com',education:'本科',school:'电子科技大学',major:'计算机',years:4,currentCompany:'某中型公司',currentTitle:'前端工程师',tags:['Vue','移动端'],source:'BOSS直聘',updatedAt:'2026-11-10 08:30',stageEnteredAt:'2026-11-10',
      educations:[{school:'电子科技大学',major:'计算机',degree:'本科',time:'2018-2022'}],
      experiences:[{company:'某中型公司',title:'前端工程师',time:'2022-至今'}],
      timeline:[{type:'stage',title:'进入简历筛选',time:'2026-11-10'}]},
    {id:'c9',name:'吴昊',jobId:'j2',stage:'interview1',gender:'男',age:29,phone:'139****3322',email:'wuhao@example.com',education:'硕士',school:'北京大学',major:'计算机',years:5,currentCompany:'某互联网公司',currentTitle:'Java 后端',tags:['高并发','JVM'],source:'猎头推荐',updatedAt:'2026-11-09',stageEnteredAt:'2026-11-09',
      educations:[{school:'北京大学',major:'计算机',degree:'硕士',time:'2017-2020'}],
      experiences:[{company:'某互联网公司',title:'Java 后端',time:'2020-至今',desc:'负责交易系统核心链路。'}],
      timeline:[{type:'stage',title:'初筛通过',time:'2026-11-09'}]},
    {id:'c10',name:'郑璇',jobId:'j3',stage:'shortlist',gender:'女',age:31,phone:'136****7788',email:'zhengx@example.com',education:'本科',school:'中国人民大学',major:'工商管理',years:8,currentCompany:'某 SaaS 公司',currentTitle:'产品经理',tags:['B端','SaaS','招聘领域'],source:'内推',updatedAt:'2026-11-09',stageEnteredAt:'2026-11-08',
      educations:[{school:'中国人民大学',major:'工商管理',degree:'本科',time:'2012-2016'}],
      experiences:[{company:'某 SaaS 公司',title:'产品经理',time:'2018-至今',desc:'负责 HRSaaS 招聘模块，曾主导从 0 到 1 招聘系统建设。'}],
      timeline:[{type:'stage',title:'初筛通过',time:'2026-11-08'}]}
  ];

  // Initialize counts on jobs
  function refreshJobStats(){
    JOBS.forEach(j=>{
      const list = CANDIDATES.filter(c=>c.jobId===j.id);
      j.total = list.length;
      j.inPipeline = list.filter(c=>!['onboarded','rejected'].includes(c.stage)).length;
      j.offers = list.filter(c=>c.stage==='offer').length;
    });
  }
  refreshJobStats();

  /* ========= Utility ========= */
  const $ = (sel, root)=>(root||document).querySelector(sel);
  const $$ = (sel, root)=>(root||document).querySelectorAll(sel);
  function h(tag, attrs, children){
    const el = document.createElement(tag);
    if(attrs){
      for(const k in attrs){
        if(k==='class') el.className=attrs[k];
        else if(k==='style') el.setAttribute('style',attrs[k]);
        else if(k.startsWith('on') && typeof attrs[k]==='function') el.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else if(k==='html') el.innerHTML=attrs[k];
        else el.setAttribute(k, attrs[k]);
      }
    }
    (children||[]).forEach(c=>{
      if(c==null) return;
      el.appendChild(typeof c==='string'?document.createTextNode(c):c);
    });
    return el;
  }
  function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function toast(msg, type='success'){
    let wrap = $('.toast-wrap');
    if(!wrap){ wrap=h('div',{class:'toast-wrap'}); document.body.appendChild(wrap); }
    const ic = {success:'✓',error:'✕',warning:'!'};
    const t = h('div',{class:`toast ${type}`},[
      h('span',{class:'ic'},[ic[type]||'i']),
      h('span',{},[msg])
    ]);
    wrap.appendChild(t);
    setTimeout(()=>{t.style.opacity='0';t.style.transform='translateY(-6px)';setTimeout(()=>t.remove(),250);},2400);
  }
  function confirmModal({title, desc, danger=false, confirmText='确认', cancelText='取消', optionsHtml='', onConfirm}){
    const mask=$('#modal-mask');
    const modal=$('#modal');
    modal.className='modal'+(danger?' danger':'');
    $('#modal-head').textContent=title||'提示';
    $('#modal-body').innerHTML=(desc?`<div style="margin-bottom:${optionsHtml?10:0}px">${escapeHtml(desc)}</div>`:'')+ (optionsHtml||'');
    const foot=$('#modal-foot');
    foot.innerHTML='';
    const cancel=h('button',{class:'btn btn-default',onclick:()=>closeModal()},[cancelText||'取消']);
    const ok=h('button',{class:'btn '+(danger?'btn-danger':'btn-primary'),onclick:()=>{
      const data={};
      $$('#modal-body [data-field]').forEach(el=>{data[el.dataset.field]=el.value;});
      closeModal();onConfirm&&onConfirm(data);
    }},[confirmText||'确认']);
    foot.appendChild(cancel);foot.appendChild(ok);
    mask.classList.add('open');
  }
  function closeModal(){const mask=$('#modal-mask');mask.classList.remove('open');}
  function initials(name){return name?name.slice(-2):'';}
  function statusTag(status){
    const map={open:{cls:'tag-blue',txt:'招聘中'},draft:{cls:'tag-gray',txt:'草稿'},paused:{cls:'tag-orange',txt:'已暂停'},closed:{cls:'tag-dark',txt:'已关闭'}};
    const s=map[status]||{cls:'tag-gray',txt:status};
    return `<span class="tag ${s.cls}">${s.txt}</span>`;
  }
  function stageLabel(key){const s=STAGES.find(x=>x.key===key);return s?s.label:key;}
  function stageTag(key){
    const s=STAGES.find(x=>x.key===key);
    if(!s)return `<span class="tag tag-gray">${key}</span>`;
    const colorMap={blue:'tag-blue',orange:'tag-orange',green:'tag-green',purple:'tag-blue',dark:'tag-dark'};
    return `<span class="tag ${colorMap[s.color]||'tag-blue'}">${s.label}</span>`;
  }

  /* ========= Auth ========= */
  function isAuthed(){return sessionStorage.getItem('recruit_authed')==='1';}
  function setAuthed(v){v?sessionStorage.setItem('recruit_authed','1'):sessionStorage.removeItem('recruit_authed');}

  /* ========= Router ========= */
  let currentPage='';
  function parseHash(){
    const hash=location.hash||'#/jobs';
    const [pathStr='']=hash.slice(1).split('?');
    const parts=pathStr.split('/').filter(Boolean);
    return parts;
  }
  function navigate(href){location.hash=href;}
  function route(){
    if(!isAuthed()){
      if(location.hash&&!location.hash.startsWith('#/login')){
        sessionStorage.setItem('recruit_redirect', location.hash);
      }
      renderPage('login',{});
      return;
    }
    const parts=parseHash();
    const root=parts[0]||'jobs';
    if(root==='login'){navigate('#/jobs');return;}
    if(root==='jobs'){
      if(parts[1]==='new'){renderPage('job-edit',{id:null});return;}
      if(parts[1]&&parts[2]==='edit'){renderPage('job-edit',{id:parts[1]});return;}
      if(parts[1]&&parts[2]==='board'){renderPage('board',{id:parts[1]});return;}
      renderPage('jobs',{});return;
    }
    if(root==='candidates'&&parts[1]){renderPage('candidate',{id:parts[1]});return;}
    if(root==='logout'){setAuthed(false);navigate('#/login');return;}
    navigate('#/jobs');
  }
  window.addEventListener('hashchange',route);

  /* ========= Shell ========= */
  function renderShell(activeSide, crumbs){
    const app=$('#app');app.className='app';app.innerHTML='';
    /* topbar */
    const topnavItems=[
      {key:'jobs',label:'职位管理',active:true},
      {key:'candidates',label:'候选人库',disabled:true},
      {key:'reports',label:'数据报表',disabled:true},
      {key:'settings',label:'系统设置',disabled:true},
    ];
    const topbar=h('header',{class:'topbar'},[
      h('div',{class:'logo'},[
        h('div',{class:'logo-badge'},['R']),
        h('span',{},['RecruitHub'])
      ]),
      h('nav',{class:'topnav'}, topnavItems.map(n=>{
        const a=h('a',{class:(n.active?'active':'')+(n.disabled?' disabled':'')},[n.label]);
        if(n.disabled) a.title='首版暂未开放';
        else a.href=`#/${n.key}`;
        return a;
      })),
      h('div',{class:'top-actions'},[
        h('div',{class:'top-search'},[
          h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':2},[
            document.createElementNS('http://www.w3.org/2000/svg','circle'),
            document.createElementNS('http://www.w3.org/2000/svg','line')
          ]),
        ]),
        h('button',{class:'icon-btn',title:'通知',onclick:()=>toast('首版暂未开放通知中心','warning')},[
          (function(){
            const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.setAttribute('width','18');svg.setAttribute('height','18');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','2');
            svg.innerHTML='<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>';
            return svg;
          })(),
          h('span',{class:'badge-dot'})
        ]),
        h('div',{class:'avatar',title:'李敏（HR）'},['LM'])
      ])
    ]);
    // fix search icon svg path
    const sIcon=topbar.querySelector('.top-search svg');
    sIcon.innerHTML='<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>';
    const searchInput=document.createElement('input');
    searchInput.placeholder='搜索职位 / 候选人 / 简历关键字…';
    topbar.querySelector('.top-search').appendChild(searchInput);

    const sideItems=[
      {key:'jobs',label:'职位列表',icon:'<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/>'},
      {key:'job-new',label:'新建职位',icon:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'},
      {key:'board',label:'候选人看板',icon:'<rect x="3" y="4" width="6" height="16" rx="1"/><rect x="11" y="4" width="6" height="10" rx="1"/><rect x="19" y="4" width="2" height="7" rx="1"/>'},
      {key:'cand-lib',label:'候选人库',icon:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',disabled:true},
      {key:'settings',label:'招聘设置',icon:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',disabled:true},
    ];
    const sidebar=h('aside',{class:'sidebar'},[
      h('div',{class:'side-section'},['工作台']),
      ...sideItems.map(i=>{
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
        svg.setAttribute('width','16');svg.setAttribute('height','16');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','2');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=i.icon;
        const attrs={class:'side-item'+(activeSide===i.key?' active':'')+(i.disabled?' disabled':'')};
        if(i.disabled){attrs.title='首版暂未开放';}
        else{attrs.onclick=()=>navigate(i.key==='job-new'?'#/jobs/new':(i.key==='jobs'?'#/jobs':'#/'+i.key));}
        const item=h('div',attrs,[svg, h('span',{},[i.label])]);
        return item;
      })
    ]);
    const main=h('main',{class:'main',id:'main'},[]);
    app.appendChild(topbar);app.appendChild(sidebar);app.appendChild(main);
    // modal host
    if(!$('#modal-mask')){
      const mask=h('div',{class:'modal-mask',id:'modal-mask',onclick:(e)=>{if(e.target.id==='modal-mask')closeModal();}},[
        h('div',{class:'modal',id:'modal'},[
          h('div',{class:'modal-head',id:'modal-head'},[]),
          h('div',{class:'modal-body',id:'modal-body'},[]),
          h('div',{class:'modal-foot',id:'modal-foot'},[])
        ])
      ]);
      document.body.appendChild(mask);
    }
    return main;
  }

  /* ========= P1: Login ========= */
  function renderPage(name, params){
    currentPage=name;
    const app=$('#app');
    if(name==='login'){
      app.className='app auth';
      app.innerHTML='';
      const wrap=h('div',{class:'login-wrap'},[
        (function(){
          const hero=h('div',{class:'login-hero'},[
            h('div',{class:'brand'},[h('div',{class:'logo-badge'},['R']),h('span',{},['RecruitHub'])]),
            h('div',{},[
              h('h1',{},['高效招聘，从这里开始']),
              h('p',{},['一站式管理职位发布、简历筛选与面试流程。让 HR 聚焦人才，而非流程。'])
            ]),
            h('div',{class:'copyright'},['© 2026 RecruitHub · 企业招聘管理后台'])
          ]);
          const art=document.createElementNS('http://www.w3.org/2000/svg','svg');
          art.setAttribute('class','hero-art');art.setAttribute('viewBox','0 0 200 160');art.setAttribute('fill','none');
          art.innerHTML='<rect x="12" y="26" width="70" height="96" rx="8" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)"/><rect x="22" y="40" width="50" height="6" rx="3" fill="#fff"/><rect x="22" y="54" width="38" height="4" rx="2" fill="rgba(255,255,255,.65)"/><rect x="22" y="64" width="44" height="4" rx="2" fill="rgba(255,255,255,.65)"/><rect x="22" y="82" width="22" height="22" rx="4" fill="rgba(255,255,255,.45)"/><rect x="50" y="82" width="22" height="22" rx="4" fill="rgba(255,255,255,.45)"/><rect x="98" y="18" width="88" height="58" rx="8" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)"/><circle cx="120" cy="48" r="14" fill="rgba(255,255,255,.6)"/><rect x="140" y="38" width="34" height="5" rx="2" fill="#fff"/><rect x="140" y="48" width="28" height="4" rx="2" fill="rgba(255,255,255,.65)"/><rect x="98" y="88" width="88" height="44" rx="8" fill="rgba(255,255,255,.18)" stroke="rgba(255,255,255,.35)"/><polyline points="112,118 124,106 136,116 156,98" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
          hero.appendChild(art);
          return hero;
        })(),
        (function(){
          const form=h('form',{class:'login-form',id:'login-form',onsubmit:(e)=>{e.preventDefault();doLogin();}},[
            h('h2',{},['欢迎回来']),
            h('div',{class:'sub'},['请使用企业账号登录招聘管理后台']),
            h('div',{class:'form-error-alert',id:'login-error'},['账号或密码错误，请重试']),
            (function(){
              const g=h('div',{class:'form-group'},[
                h('label',{class:'form-label'},['账号']),
                h('input',{class:'form-control',id:'login-account',type:'text',placeholder:'请输入企业邮箱 / 工号',autocomplete:'username'})
              ]);return g;
            })(),
            (function(){
              const g=h('div',{class:'form-group'},[
                h('label',{class:'form-label'},['密码']),
                h('input',{class:'form-control',id:'login-password',type:'password',placeholder:'请输入密码',autocomplete:'current-password'})
              ]);return g;
            })(),
            h('div',{class:'foot'},[
              h('label',{style:'display:flex;align-items:center;gap:6px;color:var(--text-2);font-size:13px;'},[
                h('input',{type:'checkbox',checked:'checked'}),h('span',{},['记住我'])
              ]),
              h('a',{href:'#',onclick:(e)=>{e.preventDefault();toast('请联系企业 IT 重置密码','warning');}} ,['忘记密码？'])
            ]),
            h('button',{class:'btn btn-primary btn-lg',id:'login-btn',type:'submit'},[
              h('span',{class:'spinner'}),h('span',{class:'label'},['登 录'])
            ]),
            h('div',{style:'text-align:center;margin-top:14px;color:var(--text-3);font-size:12px'},['提示：任意合法格式账号密码均可登录体验，密码输入 "wrong" 模拟错误。'])
          ]);
          return form;
        })()
      ]);
      app.appendChild(wrap);
      // bind input validation
      const ac=$('#login-account'),pw=$('#login-password'),btn=$('#login-btn');
      function update(){btn.disabled=!(ac.value.trim()&&pw.value.trim());}
      ac.addEventListener('input',update);pw.addEventListener('input',update);update();
      return;
    }

    // authenticated pages
    const main=renderShell(name==='job-edit'?(params.id?'jobs':'job-new'):(name==='board'?'board':(name==='candidate'?'board':'jobs')));
    if(name==='jobs')renderJobsPage(main);
    else if(name==='job-edit')renderJobEditPage(main,params.id);
    else if(name==='board')renderBoardPage(main,params.id);
    else if(name==='candidate')renderCandidatePage(main,params.id);
  }

  function doLogin(){
    const ac=$('#login-account').value.trim();
    const pw=$('#login-password').value;
    const err=$('#login-error');err.classList.remove('show');
    const btn=$('#login-btn');
    if(!ac||!pw){toast('请输入账号和密码','warning');return;}
    btn.classList.add('loading');btn.disabled=true;
    setTimeout(()=>{
      btn.classList.remove('loading');
      if(pw==='wrong'){
        err.classList.add('show');
        btn.disabled=false;
        $('#login-password').value='';$('#login-password').focus();
        return;
      }
      setAuthed(true);
      toast('登录成功，欢迎回来','success');
      const redirect=sessionStorage.getItem('recruit_redirect');
      sessionStorage.removeItem('recruit_redirect');
      navigate(redirect&&!redirect.startsWith('#/login')?redirect:'#/jobs');
    },400);
  }

  /* ========= P2: Jobs list ========= */
  function renderJobsPage(main){
    main.innerHTML='';
    let filters={kw:'',dept:'all',status:'all'};
    const head=h('div',{class:'page-head'},[
      h('div',{},[
        h('h1',{class:'page-title'},['职位管理']),
        h('div',{class:'page-sub'},['集中管理在招职位、跟进候选人进度 · 共 '+JOBS.length+' 个职位'])
      ]),
      h('button',{class:'btn btn-primary',onclick:()=>navigate('#/jobs/new')},[
        iconSvg('plus'),h('span',{},['新建职位'])
      ])
    ]);
    const filterBar=h('div',{class:'filter-bar'},[
      (function(){
        const wrap=h('div',{class:'search'},[iconSvg('search')]);
        const inp=h('input',{class:'form-control',type:'text',placeholder:'搜索职位名称 / 部门 / 负责人'});
        inp.addEventListener('input',(e)=>{filters.kw=e.target.value.trim();renderBody();});
        wrap.appendChild(inp);return wrap;
      })(),
      (function(){
        const sel=h('select',{class:'form-control'},[h('option',{value:'all'},['所有部门']),...DEPARTMENTS.map(d=>h('option',{value:d},[d]))]);
        sel.addEventListener('change',(e)=>{filters.dept=e.target.value;renderBody();});
        return sel;
      })(),
      (function(){
        const sel=h('select',{class:'form-control'},[
          h('option',{value:'all'},['所有状态']),
          h('option',{value:'open'},['招聘中']),
          h('option',{value:'draft'},['草稿']),
          h('option',{value:'paused'},['已暂停']),
          h('option',{value:'closed'},['已关闭'])
        ]);
        sel.addEventListener('change',(e)=>{filters.status=e.target.value;renderBody();});
        return sel;
      })(),
      h('div',{style:'margin-left:auto;color:var(--text-3);font-size:12px'},['提示：点击行进入候选人看板，点击右侧图标可编辑/上下架'])
    ]);
    const table=h('div',{class:'table'},[h('table',{class:'data'},[
      h('thead',{},[h('tr',{},[
        h('th',{},['职位']),h('th',{},['地点']),h('th',{},['招聘人数']),h('th',{},['负责人']),
        h('th',{},['进度']),h('th',{},['状态']),h('th',{},['更新时间']),h('th',{style:'width:140px'},['操作'])
      ])]),
      h('tbody',{id:'jobs-tbody'},[])
    ])]);
    const emptyState=h('div',{class:'empty hidden',id:'jobs-empty'},[
      emptyIllu(),
      h('div',{class:'empty-title'},['没有找到匹配的职位']),
      h('div',{class:'empty-desc'},['试试调整筛选条件，或']),
      h('button',{class:'btn btn-primary',onclick:()=>navigate('#/jobs/new')},['新建职位'])
    ]);
    main.appendChild(head);main.appendChild(filterBar);main.appendChild(table);main.appendChild(emptyState);

    function renderBody(){
      const tbody=$('#jobs-tbody');tbody.innerHTML='';
      const list=JOBS.filter(j=>{
        if(filters.kw){
          const k=filters.kw.toLowerCase();
          if(!(j.title.toLowerCase().includes(k)||j.department.toLowerCase().includes(k)||j.owner.toLowerCase().includes(k)))return false;
        }
        if(filters.dept!=='all'&&j.department!==filters.dept)return false;
        if(filters.status!=='all'&&j.status!==filters.status)return false;
        return true;
      });
      if(list.length===0){table.classList.add('hidden');emptyState.classList.remove('hidden');return;}
      table.classList.remove('hidden');emptyState.classList.add('hidden');
      list.forEach(j=>{
        const tr=h('tr',{class:'row',onclick:()=>navigate('#/jobs/'+j.id+'/board')},[
          h('td',{},[
            h('div',{class:'title-cell'},[
              h('div',{class:'av'},[initials(j.title)]),
              h('div',{},[
                h('div',{class:'name'},[j.title]),
                h('div',{class:'sub'},[j.department+' · '+j.experience+' · '+j.education+' · '+j.type])
              ])
            ])
          ]),
          h('td',{},[j.location]),
          h('td',{},[String(j.headcount)]),
          h('td',{},[j.owner]),
          h('td',{},[h('span',{class:'muted'},[`候选人 ${j.total} · 在面 ${j.inPipeline} · Offer ${j.offers}`])]),
          h('td',{html:statusTag(j.status)}),
          h('td',{class:'muted'},[j.updatedAt]),
          h('td',{},[
            h('div',{class:'row-actions',onclick:e=>e.stopPropagation()},[
              h('button',{class:'icon-btn',title:'编辑',onclick:()=>navigate('#/jobs/'+j.id+'/edit')},[iconSvg('edit')]),
              (function(){
                const btn=h('button',{class:'icon-btn',title:j.status==='open'?'暂停职位':(j.status==='paused'?'重新上架':'重新上架')},[iconSvg(j.status==='open'?'pause':'play')]);
                btn.addEventListener('click',()=>toggleJobStatus(j));
                return btn;
              })(),
              (function(){
                const btn=h('button',{class:'icon-btn',title:'关闭职位'},[iconSvg('x')]);
                btn.addEventListener('click',()=>closeJob(j));
                return btn;
              })()
            ])
          ])
        ]);
        tbody.appendChild(tr);
      });
    }
    renderBody();
  }

  function toggleJobStatus(j){
    if(j.status==='open'){
      confirmModal({title:'暂停职位',desc:`确认暂停"${j.title}"的招聘？暂停后候选人将无法继续投递，但已在流程中的候选人不受影响。`,danger:true,confirmText:'暂停职位',onConfirm:()=>{j.status='paused';j.updatedAt=nowStr();toast('职位已暂停','success');route();}});
    }else if(j.status==='paused'||j.status==='closed'||j.status==='draft'){
      confirmModal({title:'上架职位',desc:`确认将"${j.title}"重新上架招聘？`,confirmText:'上架',onConfirm:()=>{j.status='open';j.updatedAt=nowStr();toast('职位已上架','success');route();}});
    }
  }
  function closeJob(j){
    confirmModal({title:'关闭职位',desc:`确认关闭"${j.title}"？关闭后该职位将从在招列表中移除（可在筛选中查看）。`,danger:true,confirmText:'确认关闭',onConfirm:()=>{j.status='closed';j.updatedAt=nowStr();toast('职位已关闭','success');route();}});
  }
  function nowStr(){
    const d=new Date();const p=n=>String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  /* ========= P3: Job new/edit ========= */
  function renderJobEditPage(main,id){
    main.innerHTML='';
    const editing=id?JOBS.find(j=>j.id===id):null;
    const formState=editing?{...editing}:{title:'',department:DEPARTMENTS[0],location:LOCATIONS[0],headcount:1,salaryMin:'',salaryMax:'',experience:'3-5年',education:'本科',type:'社招',owner:'李敏',jd:'',status:'draft'};
    if(formState.salaryMin==null)formState.salaryMin='';
    if(formState.salaryMax==null)formState.salaryMax='';
    let dirty=false;
    const crumbs=h('div',{class:'breadcrumbs'},[
      h('a',{href:'#/jobs'},['职位管理']),h('span',{class:'sep'},['/']),
      h('span',{},[editing?'编辑职位':'新建职位'])
    ]);
    const head=h('div',{class:'page-head'},[
      h('div',{},[
        crumbs,
        h('h1',{class:'page-title'},[editing?`编辑职位 · ${editing.title}`:'新建职位']),
        editing?h('div',{class:'page-sub'},[`上次编辑于 ${editing.updatedAt}，由 ${editing.owner} 保存`]):h('div',{class:'page-sub'},['完善职位信息后可保存草稿或直接发布'])
      ])
    ]);
    const tipBar=h('div',{class:'tip-bar'},[iconSvg('info'),h('span',{},['带 * 字段为必填项；保存草稿可稍后继续编辑，发布后职位将进入招聘中状态。'])]);
    const form=h('div',{class:'form-layout'},[]);
    const basicSection=h('div',{class:'form-section'},[
      h('div',{class:'form-section-title'},['基础信息']),
      (function(){
        const row=h('div',{class:'form-row'},[
          field('职位名称','title','text','例如：高级前端工程师',true),
          field('所属部门','department','select',null,true,DEPARTMENTS)
        ]);return row;
      })(),
      (function(){
        const row=h('div',{class:'form-row'},[
          field('工作地点','location','select',null,true,LOCATIONS),
          field('招聘人数','headcount','number','1',true)
        ]);return row;
      })(),
      (function(){
        const row=h('div',{class:'form-row'},[
          field('经验要求','experience','select',null,true,['应届','1-3年','3-5年','5-10年','10年以上']),
          field('学历要求','education','select',null,true,['不限','大专','本科','硕士','博士'])
        ]);return row;
      })(),
      (function(){
        const row=h('div',{class:'form-row'},[
          field('薪资范围(K/月) 最低','salaryMin','number','例如 25'),
          field('薪资范围(K/月) 最高','salaryMax','number','例如 40')
        ]);return row;
      })(),
      (function(){
        const row=h('div',{class:'form-row'},[
          field('职位类型','type','select',null,true,['社招','校招','实习']),
          field('招聘负责人','owner','text','例如：李敏',true)
        ]);return row;
      })()
    ]);
    const jdSection=h('div',{class:'form-section'},[
      h('div',{class:'form-section-title'},['职位描述（JD）']),
      (function(){
        const g=h('div',{class:'form-group','data-field-group':'jd'},[
          h('label',{class:'form-label'},['职位描述',h('span',{class:'req'},['*'])]),
          h('textarea',{class:'form-control',id:'f-jd',placeholder:'请输入岗位职责、任职要求、团队介绍等信息'}),
          h('div',{class:'form-error'},['请输入职位描述'])
        ]);
        return g;
      })(),
      (function(){
        const g=h('div',{class:'form-group'},[
          h('label',{class:'form-label'},['发布渠道']),
          h('div',{class:'chips'},['官网','BOSS直聘','猎聘','内推','LinkedIn'].map(c=>{
            const chip=h('span',{class:'chip active'},[c]);
            chip.addEventListener('click',()=>chip.classList.toggle('active'));
            return chip;
          }))
        ]);
        return g;
      })()
    ]);
    form.appendChild(basicSection);form.appendChild(jdSection);

    // mark dirty on change
    form.addEventListener('input',()=>{dirty=true;});

    const bar=h('div',{class:'form-bar'},[
      h('button',{class:'btn btn-default',onclick:()=>{
        if(!dirty){navigate('#/jobs');return;}
        confirmModal({title:'确认离开',desc:'你有未保存的内容，确定离开吗？',danger:true,confirmText:'离开',onConfirm:()=>navigate('#/jobs')});
      }},['取消']),
      h('button',{class:'btn btn-default',onclick:()=>submitForm('draft')},['保存草稿']),
      h('button',{class:'btn btn-primary',onclick:()=>submitForm('publish')},[editing?'保存修改':'发布职位'])
    ]);

    main.appendChild(head);main.appendChild(tipBar);main.appendChild(form);main.appendChild(bar);

    // fill values (must be after append to DOM for id selectors)
    ['title','department','location','headcount','experience','education','salaryMin','salaryMax','type','owner'].forEach(k=>{
      const el=$(`#f-${k}`);if(el)el.value=formState[k]==null?'':formState[k];
    });
    $('#f-jd').value=formState.jd||'';

    function field(label,key,type,ph,required,options){
      const g=h('div',{class:'form-group','data-field-group':key},[
        h('label',{class:'form-label'},[label, required?h('span',{class:'req'},['*']):null]),
        type==='select'?(function(){
          const s=h('select',{class:'form-control',id:`f-${key}`},options.map(o=>h('option',{value:o},[o])));return s;
        })():(function(){
          const i=h('input',{class:'form-control',id:`f-${key}`,type:type||'text',placeholder:ph||''});
          if(type==='number')i.min='0';
          return i;
        })(),
        h('div',{class:'form-error'},['该字段必填'])
      ]);
      return g;
    }
    function validate(isPublish){
      let ok=true;let first=null;
      const required=['title','department','location','headcount','experience','education','type','owner'];
      if(isPublish)required.push('jd');
      required.forEach(k=>{
        const el=$(`#f-${k}`);const g=el.closest('.form-group');
        const v=(el.value||'').toString().trim();
        let err=!v;
        if(k==='headcount'&&v&&(!/^\d+$/.test(v)||parseInt(v,10)<1))err=true;
        if(err){g.classList.add('has-error');ok=false;if(!first)first=g;}
        else{g.classList.remove('has-error');}
      });
      // salary range
      const gmin=$('#f-salaryMin'),gmax=$('#f-salaryMax');
      const ggmin=gmin.closest('.form-group'),ggmax=gmax.closest('.form-group');
      ggmin.classList.remove('has-error');ggmax.classList.remove('has-error');
      const min=parseFloat(gmin.value),max=parseFloat(gmax.value);
      if(gmin.value&&gmax.value&&min>max){ggmin.classList.add('has-error');ggmax.classList.add('has-error');ggmin.querySelector('.form-error').textContent='最低薪资不得高于最高薪资';ok=false;if(!first)first=ggmin;}
      if(first)first.scrollIntoView({behavior:'smooth',block:'center'});
      return ok;
    }
    function submitForm(mode){
      if(!validate(mode==='publish')){toast('请检查表单填写','error');return;}
      const data={};
      ['title','department','location','headcount','experience','education','salaryMin','salaryMax','type','owner'].forEach(k=>{
        data[k]=$(`#f-${k}`).value;
      });
      data.jd=$('#f-jd').value;
      data.headcount=parseInt(data.headcount,10);
      data.salaryMin=data.salaryMin?parseInt(data.salaryMin,10):null;
      data.salaryMax=data.salaryMax?parseInt(data.salaryMax,10):null;
      if(editing){
        Object.assign(editing,data);
        editing.updatedAt=nowStr();
        if(mode==='publish')editing.status='open';
        toast(mode==='draft'?'草稿已保存':'职位修改已保存','success');
      }else{
        const newJob={
          id:'j'+(Date.now()),
          ...data,
          status:mode==='publish'?'open':'draft',
          updatedAt:nowStr(),
          total:0,inPipeline:0,offers:0
        };
        JOBS.unshift(newJob);
        toast(mode==='draft'?'草稿已保存':'职位发布成功','success');
      }
      dirty=false;
      setTimeout(()=>navigate('#/jobs'),800);
    }
  }

  /* ========= P4: Kanban board ========= */
  let boardFilters={kw:'',tag:''};
  let dragState=null;
  function renderBoardPage(main,jobId){
    main.innerHTML='';
    const job=JOBS.find(j=>j.id===jobId)||JOBS[0];
    if(!job){toast('职位不存在','error');navigate('#/jobs');return;}
    boardFilters={kw:'',tag:''};
    const crumbs=h('div',{class:'breadcrumbs'},[
      h('a',{href:'#/jobs'},['职位管理']),h('span',{class:'sep'},['/']),
      h('span',{},[job.title+' · 候选人看板'])
    ]);
    const head=h('div',{class:'page-head'},[
      h('div',{},[crumbs,h('h1',{class:'page-title'},['候选人看板'])]),
      h('div',{style:'display:flex;gap:8px'},[
        h('button',{class:'btn btn-default',onclick:()=>navigate('#/jobs/'+job.id+'/edit')},[iconSvg('edit'),'编辑职位']),
        h('button',{class:'btn btn-primary',onclick:()=>toast('上传简历/添加候选人功能在后续迭代开放','warning')},[iconSvg('plus'),'添加候选人'])
      ])
    ]);
    const funnel=h('div',{class:'funnel',id:'funnel'},[]);
    const brief=h('div',{class:'job-brief'},[
      h('div',{class:'av',style:'width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#C7D2E5,#E8EFFE);color:var(--primary-dark);display:grid;place-items:center;font-weight:700;font-size:15px'},[initials(job.title)]),
      h('div',{},[
        h('div',{class:'job-t'},[job.title,' ',statusTag(job.status)]),
        h('div',{class:'job-m'},[job.department+' · '+job.location+' · '+job.experience+' · '+job.type+' · 负责人：'+job.owner])
      ]),
      funnel
    ]);
    const filterBar=h('div',{class:'filter-bar'},[
      (function(){
        const wrap=h('div',{class:'search'},[iconSvg('search')]);
        const inp=h('input',{class:'form-control',type:'text',placeholder:'按姓名 / 学校 / 公司搜索'});
        inp.addEventListener('input',(e)=>{boardFilters.kw=e.target.value.trim();renderColumns();});
        wrap.appendChild(inp);return wrap;
      })(),
      h('select',{class:'form-control',onchange:(e)=>{boardFilters.tag=e.target.value;renderColumns();}},[
        h('option',{value:''},['全部标签']),
        h('option',{value:'急招'},['急招']),
        h('option',{value:'大厂背景'},['大厂背景']),
        h('option',{value:'985'},['985']),
        h('option',{value:'英语流利'},['英语流利'])
      ]),
      h('div',{class:'chips'},[
        (function(){
          const c=h('span',{class:'chip active',onclick:()=>{c.classList.add('active');c2.classList.remove('active');renderColumns();}},[`在流程 ${job.inPipeline}`]);return c;
        })(),
        (function(){
          const c2=h('span',{class:'chip',onclick:()=>{c2.classList.add('active');document.querySelector('.chips .chip.active:not(:last-child)').classList.remove('active');renderColumns();}},['查看已淘汰']);
          return c2;
        })()
      ]),
      h('div',{style:'margin-left:auto;color:var(--text-3);font-size:12px'},['提示：拖拽卡片到其他列可推进候选人阶段'])
    ]);
    const boardWrap=h('div',{class:'kanban-wrap',id:'kanban'},[]);
    main.appendChild(head);main.appendChild(brief);main.appendChild(filterBar);main.appendChild(boardWrap);
    renderColumns();

    function renderColumns(){
      const kw=boardFilters.kw.toLowerCase();
      const showRejected=document.querySelector('.chips .chip:last-child').classList.contains('active');
      const wrap=$('#kanban');wrap.innerHTML='';
      let stageCounts={};
      STAGE_KEYS.forEach(k=>stageCounts[k]=0);
      STAGES.forEach(s=>{
        const list=CANDIDATES.filter(c=>c.jobId===job.id&&c.stage===s.key);
        stageCounts[s.key]=list.length;
        const col=h('div',{class:'kcol','data-stage':s.key},[
          h('div',{class:'kcol-head'},[h('span',{class:'kt'},[s.label]),h('span',{class:'kc'},[String(list.length)])]),
          h('div',{class:'kcol-body','data-body':s.key},[])
        ]);
        // drag events
        col.addEventListener('dragover',(e)=>{e.preventDefault();col.classList.add('drag-over');});
        col.addEventListener('dragleave',()=>col.classList.remove('drag-over'));
        col.addEventListener('drop',(e)=>{
          e.preventDefault();col.classList.remove('drag-over');
          if(!dragState)return;
          const c=CANDIDATES.find(x=>x.id===dragState);if(!c)return;
          const target=s.key;
          if(c.stage===target)return;
          confirmModal({title:'推进候选人阶段',desc:`确认将「${c.name}」移动到「${stageLabel(target)}」吗？`,optionsHtml:`<div class="form-group" style="margin-top:14px"><label class="form-label">备注（可选）</label><textarea class="form-control" data-field="note" rows="2" placeholder="记录本次推进的原因或面试结论"></textarea></div>`,confirmText:'确认推进',onConfirm:(data)=>{
            c.stage=target;c.stageEnteredAt=new Date().toISOString().slice(0,10);c.updatedAt=nowStr();
            if(data.note){c.timeline.push({type:'stage',title:`进入${stageLabel(target)}`,time:nowStr(),by:'李敏',desc:data.note});}
            else{c.timeline.push({type:'stage',title:`进入${stageLabel(target)}`,time:nowStr(),by:'李敏'});}
            refreshJobStats();
            toast(`已将 ${c.name} 移动到「${stageLabel(target)}」`,'success');
            renderColumns();
          }});
        });
        wrap.appendChild(col);
        const body=col.querySelector('.kcol-body');
        const visible=list.filter(c=>{
          if(kw&&!(c.name.toLowerCase().includes(kw)||(c.school||'').toLowerCase().includes(kw)||(c.currentCompany||'').toLowerCase().includes(kw)))return false;
          if(boardFilters.tag&&!(c.tags||[]).includes(boardFilters.tag))return false;
          return true;
        });
        if(visible.length===0){
          body.appendChild(h('div',{class:'kcol-empty'},[`暂无处于${s.label}的候选人`]));
        }else{
          visible.forEach(c=>body.appendChild(renderCard(c)));
        }
      });
      // rejected column (toggle)
      if(showRejected){
        const rej=CANDIDATES.filter(c=>c.jobId===job.id&&c.stage==='rejected');
        const col=h('div',{class:'kcol','data-stage':'rejected'},[
          h('div',{class:'kcol-head'},[h('span',{class:'kt'},['已淘汰']),h('span',{class:'kc'},[String(rej.length)])]),
          h('div',{class:'kcol-body'},[])
        ]);
        wrap.appendChild(col);
        const body=col.querySelector('.kcol-body');
        if(rej.length===0)body.appendChild(h('div',{class:'kcol-empty'},['暂无已淘汰候选人']));
        else rej.forEach(c=>body.appendChild(renderCard(c)));
      }
      // funnel
      const f=$('#funnel');f.innerHTML='';
      [
        {n:job.total,l:'候选人'},{n:stageCounts.screening+stageCounts.shortlist,l:'初筛中'},
        {n:stageCounts.interview1+stageCounts.interview2,l:'面试中'},{n:stageCounts.hr_chat,l:'HR面'},
        {n:stageCounts.offer,l:'Offer'},{n:stageCounts.onboarded,l:'已入职'}
      ].forEach(x=>{
        f.appendChild(h('div',{class:'f'},[h('div',{class:'n'},[String(x.n)]),h('div',{class:'l'},[x.l])]));
      });
    }
  }
  function renderCard(c){
    const card=h('div',{class:'kcard',draggable:'true','data-cid':c.id},[
      h('div',{class:'kt'},[
        h('span',{class:'av'},[initials(c.name)]),
        h('span',{},[c.name]),
        h('span',{style:'margin-left:auto'}),
        (function(){
          const t=stageTag(c.stage);
          const s=h('span',{html:t});return s;
        })()
      ]),
      h('div',{class:'km'},[`${c.education} · ${c.years}年 · ${c.currentCompany||c.school||''}`]),
      h('div',{class:'kft'},[
        h('div',{class:'tags'},(c.tags||[]).slice(0,3).map(t=>h('span',{class:'tag tag-gray'},[t]))),
        h('span',{class:'time'},[stageDuration(c)])
      ])
    ]);
    card.addEventListener('dragstart',(e)=>{dragState=c.id;card.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    card.addEventListener('dragend',()=>{card.classList.remove('dragging');dragState=null;document.querySelectorAll('.kcol').forEach(x=>x.classList.remove('drag-over'));});
    card.addEventListener('click',()=>openCandidateDrawer(c));
    return card;
  }
  function stageDuration(c){
    if(!c.stageEnteredAt)return '刚刚';
    const d=new Date(c.stageEnteredAt),now=new Date();
    const diff=Math.floor((now-d)/86400000);
    if(diff<=0)return '今天';if(diff===1)return '1天';return diff+'天';
  }
  function openCandidateDrawer(c){
    let drawer=$('#drawer'),mask=$('#drawer-mask');
    if(!drawer){
      mask=h('div',{class:'drawer-mask',id:'drawer-mask',onclick:closeDrawer});
      drawer=h('aside',{class:'drawer',id:'drawer'},[
        h('div',{class:'drawer-head',id:'drawer-head'},[]),
        h('div',{class:'drawer-body',id:'drawer-body'},[]),
        h('div',{class:'drawer-foot',id:'drawer-foot'},[])
      ]);
      document.body.appendChild(mask);document.body.appendChild(drawer);
    }
    const head=$('#drawer-head');head.innerHTML='';
    head.appendChild(h('div',{},[
      h('div',{class:'name'},[c.name,' ',stageTag(c.stage)]),
      h('div',{class:'sub'},[`${c.currentTitle||''} · ${c.currentCompany||c.school||''} · 更新于 ${c.updatedAt}`])
    ]));
    head.appendChild(h('button',{class:'icon-btn',onclick:closeDrawer},[iconSvg('x')]));
    const body=$('#drawer-body');body.innerHTML='';
    body.appendChild(h('div',{class:'section-t'},['基本信息']));
    const grid=h('div',{class:'info-grid'},[
      h('div',{class:'k'},['意向职位']),h('div',{class:'v'},[(JOBS.find(j=>j.id===c.jobId)||{}).title||'-']),
      h('div',{class:'k'},['手机']),h('div',{class:'v'},[c.phone||'-']),
      h('div',{class:'k'},['邮箱']),h('div',{class:'v'},[c.email||'-']),
      h('div',{class:'k'},['学历']),h('div',{class:'v'},[c.education+' · '+c.school]),
      h('div',{class:'k'},['工作年限']),h('div',{class:'v'},[c.years+'年']),
      h('div',{class:'k'},['来源']),h('div',{class:'v'},[c.source||'-']),
      h('div',{class:'k'},['标签']),h('div',{class:'v'},[h('div',{class:'skill-tags'},(c.tags||[]).map(t=>h('span',{class:'tag tag-blue'},[t])))])
    ]);
    body.appendChild(grid);
    body.appendChild(h('div',{class:'section-t'},['最近动态']));
    const tl=h('div',{class:'timeline'},[]);
    (c.timeline||[]).slice(-3).reverse().forEach(it=>{
      tl.appendChild(h('div',{class:'tl-item done'},[
        h('div',{class:'tl-title'},[it.title]),
        h('div',{class:'tl-meta'},[it.time+(it.by?' · '+it.by:'')]),
        it.desc?h('div',{class:'tl-desc'},[it.desc]):null
      ]));
    });
    body.appendChild(tl);
    const foot=$('#drawer-foot');foot.innerHTML='';
    foot.appendChild(h('button',{class:'btn btn-default',onclick:()=>{closeDrawer();navigate('#/candidates/'+c.id);}},['查看完整详情']));
    foot.appendChild(h('button',{class:'btn btn-primary',onclick:()=>{closeDrawer();navigate('#/candidates/'+c.id);}},['推进候选人']));
    mask.classList.add('open');drawer.classList.add('open');
  }
  function closeDrawer(){const m=$('#drawer-mask'),d=$('#drawer');if(m)m.classList.remove('open');if(d)d.classList.remove('open');}

  /* ========= P5: Candidate detail ========= */
  function renderCandidatePage(main,cid){
    main.innerHTML='';
    const c=CANDIDATES.find(x=>x.id===cid);
    if(!c){toast('候选人不存在','error');navigate('#/jobs');return;}
    const job=JOBS.find(j=>j.id===c.jobId);
    const crumbs=h('div',{class:'breadcrumbs'},[
      h('a',{href:'#/jobs'},['职位管理']),h('span',{class:'sep'},['/']),
      h('a',{href:`#/jobs/${c.jobId}/board`},[job?job.title:'职位']),h('span',{class:'sep'},['/']),
      h('span',{},[c.name])
    ]);
    const back=h('button',{class:'btn btn-ghost',onclick:()=>history.length>1?history.back():navigate('#/jobs/'+c.jobId+'/board')},[iconSvg('arrow-left'),'返回']);
    const top=h('div',{class:'cand-top'},[
      h('div',{class:'big-av'},[initials(c.name)]),
      h('div',{class:'ct-info'},[
        h('div',{class:'ct-name'},[c.name, stageTag(c.stage)]),
        h('div',{class:'ct-meta'},[
          h('span',{},[c.currentTitle||'-']),
          h('span',{},[c.currentCompany||c.school||'-']),
          h('span',{},[c.education+' · '+c.years+'年']),
          h('span',{},['手机：'+c.phone]),
          h('span',{},[c.email]),
          h('span',{},['来源：'+c.source])
        ])
      ]),
      h('div',{class:'ct-actions'},[
        h('button',{class:'btn btn-default',onclick:()=>toast('安排面试功能后续迭代开放','warning')},[iconSvg('calendar'),'安排面试']),
        h('button',{class:'btn btn-default',onclick:()=>addNote(c)},['添加备注']),
        h('button',{class:'btn btn-danger',onclick:()=>rejectCandidate(c)},['淘汰候选人'])
      ])
    ]);
    const grid=h('div',{class:'detail-grid'},[
      h('div',{class:'detail-left'},[
        renderResumeBlock(c),
        renderEduBlock(c),
        renderWorkBlock(c)
      ]),
      h('div',{class:'detail-right'},[
        renderActionBlock(c),
        renderTimelineBlock(c)
      ])
    ]);
    main.appendChild(crumbs);main.appendChild(h('div',{style:'margin-bottom:10px'},[back]));main.appendChild(top);main.appendChild(grid);
  }
  function renderResumeBlock(c){
    return h('div',{class:'block'},[
      h('h3',{},['基本信息']),
      h('div',{class:'info-grid'},[
        h('div',{class:'k'},['姓名']),h('div',{class:'v'},[c.name]),
        h('div',{class:'k'},['性别/年龄']),h('div',{class:'v'},[(c.gender||'-')+' · '+(c.age?c.age+'岁':'-')]),
        h('div',{class:'k'},['手机']),h('div',{class:'v'},[c.phone]),
        h('div',{class:'k'},['邮箱']),h('div',{class:'v'},[c.email]),
        h('div',{class:'k'},['意向职位']),h('div',{class:'v'},[(JOBS.find(j=>j.id===c.jobId)||{}).title||'-']),
        h('div',{class:'k'},['当前阶段']),h('div',{class:'v',html:stageTag(c.stage)}),
        h('div',{class:'k'},['技能标签']),h('div',{class:'v'},[h('div',{class:'skill-tags'},(c.tags||[]).map(t=>h('span',{class:'tag tag-blue'},[t])))])
      ])
    ]);
  }
  function renderEduBlock(c){
    return h('div',{class:'block'},[
      h('h3',{},['教育经历']),
      ...((c.educations||[]).map(e=>h('div',{class:'entry'},[
        h('div',{class:'et'},[e.school+' · '+e.major+' · '+e.degree]),
        h('div',{class:'em'},[e.time])
      ])))
    ]);
  }
  function renderWorkBlock(c){
    return h('div',{class:'block'},[
      h('h3',{},['工作经历']),
      ...((c.experiences||[]).map(e=>h('div',{class:'entry'},[
        h('div',{class:'et'},[e.company+' · '+e.title]),
        h('div',{class:'em'},[e.time]),
        e.desc?h('div',{class:'ed'},[e.desc]):null
      ])))
    ]);
  }
  function renderActionBlock(c){
    const idx=STAGE_KEYS.indexOf(c.stage);
    const next=STAGE_KEYS[idx+1];
    const prev=STAGE_KEYS[idx-1];
    return h('div',{class:'block'},[
      h('h3',{},['快捷操作']),
      h('div',{class:'quick-actions'},[
        next?h('button',{class:'btn btn-primary',onclick:()=>advanceStage(c,next)},[`推进到 ${stageLabel(next)}`]):h('div',{class:'muted',style:'text-align:center;padding:6px 0'},['候选人已达终态']),
        prev && c.stage!=='rejected'?h('button',{class:'btn btn-default',onclick:()=>advanceStage(c,prev)},[`回退到 ${stageLabel(prev)}`]):null,
        h('button',{class:'btn btn-default',onclick:()=>toast('简历下载/查看功能后续迭代开放','warning')},['查看原始简历']),
        h('button',{class:'btn btn-danger',onclick:()=>rejectCandidate(c)},['淘汰候选人'])
      ])
    ]);
  }
  function renderTimelineBlock(c){
    return h('div',{class:'block'},[
      h('h3',{},['招聘进度']),
      h('div',{class:'timeline'},(c.timeline||[]).slice().reverse().map(it=>{
        const cls=it.type==='reject'?'tl-item fail':(it.title&&it.title.includes(c.stage)?'tl-item current':'tl-item done');
        return h('div',{class:cls},[
          h('div',{class:'tl-title'},[it.title]),
          h('div',{class:'tl-meta'},[it.time+(it.by?' · '+it.by:'')]),
          it.desc?h('div',{class:'tl-desc'},[it.desc]):null
        ]);
      }))
    ]);
  }
  function advanceStage(c,target){
    confirmModal({title:'推进阶段',desc:`确认将「${c.name}」的阶段调整为「${stageLabel(target)}」？`,
      optionsHtml:`<div class="form-group" style="margin-top:14px"><label class="form-label">评价/备注</label><textarea class="form-control" data-field="note" rows="2" placeholder="简要说明推进原因"></textarea></div>`,
      confirmText:'确认',
      onConfirm:(d)=>{
        c.stage=target;c.stageEnteredAt=new Date().toISOString().slice(0,10);c.updatedAt=nowStr();
        c.timeline.push({type:'stage',title:`进入${stageLabel(target)}`,time:nowStr(),by:'李敏',desc:d.note||''});
        refreshJobStats();
        toast('阶段已更新','success');route();
      }
    });
  }
  function rejectCandidate(c){
    confirmModal({title:'淘汰候选人',desc:`确认淘汰「${c.name}」？淘汰后候选人将从看板默认列中移除。`,danger:true,confirmText:'确认淘汰',
      optionsHtml:`<div class="form-group" style="margin-top:10px"><label class="form-label">淘汰原因<span class="req">*</span></label>
        <select class="form-control" data-field="reason">
          <option value="文化不匹配">文化不匹配</option>
          <option value="技能不匹配">技能不匹配</option>
          <option value="薪资预期不符">薪资预期不符</option>
          <option value="主动放弃">候选人主动放弃</option>
          <option value="其他">其他</option>
        </select></div>
        <div class="form-group"><label class="form-label">备注</label><textarea class="form-control" data-field="note" rows="2" placeholder="详细说明（可选）"></textarea></div>`,
      onConfirm:(d)=>{
        c.stage='rejected';c.updatedAt=nowStr();
        c.timeline.push({type:'reject',title:`已淘汰：${d.reason}`,time:nowStr(),by:'李敏',desc:d.note||''});
        refreshJobStats();
        toast('候选人已淘汰','success');
        setTimeout(()=>navigate('#/jobs/'+c.jobId+'/board'),700);
      }});
  }
  function addNote(c){
    confirmModal({title:'添加备注',desc:`为「${c.name}」添加一条跟进备注：`,confirmText:'保存备注',
      optionsHtml:`<div class="form-group" style="margin-top:10px"><textarea class="form-control" data-field="note" rows="3" placeholder="填写跟进内容"></textarea></div>`,
      onConfirm:(d)=>{
        if(!d.note||!d.note.trim()){toast('备注不能为空','error');return;}
        c.timeline.push({type:'note',title:'跟进备注',time:nowStr(),by:'李敏',desc:d.note});c.updatedAt=nowStr();
        toast('备注已添加','success');route();
      }});
  }

  /* ========= Icons ========= */
  function iconSvg(name){
    const paths={
      plus:'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      search:'<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      edit:'<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      'arrow-left':'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      x:'<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
      pause:'<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
      play:'<polygon points="5 3 19 12 5 21 5 3"/>',
      calendar:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
      info:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
    };
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('width','16');s.setAttribute('height','16');s.setAttribute('viewBox','0 0 24 24');
    s.setAttribute('fill','none');s.setAttribute('stroke','currentColor');s.setAttribute('stroke-width','2');
    s.setAttribute('stroke-linecap','round');s.setAttribute('stroke-linejoin','round');
    s.innerHTML=paths[name]||'';
    return s;
  }
  function emptyIllu(){
    const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('class','empty-illu');s.setAttribute('viewBox','0 0 120 120');s.setAttribute('fill','none');
    s.innerHTML='<rect x="20" y="30" width="80" height="60" rx="8" stroke="#C7D2E5" stroke-width="2"/><path d="M20 50h80" stroke="#C7D2E5" stroke-width="2"/><circle cx="34" cy="40" r="4" fill="#C7D2E5"/><rect x="44" y="38" width="30" height="4" rx="2" fill="#C7D2E5"/><rect x="30" y="60" width="60" height="4" rx="2" fill="#E2E8F0"/><rect x="30" y="70" width="40" height="4" rx="2" fill="#E2E8F0"/><rect x="30" y="80" width="50" height="4" rx="2" fill="#E2E8F0"/>';
    return s;
  }

  /* ========= Unsaved leave guard (custom) ========= */
  // Hash changes are intercepted by individual page (job-edit) as needed.

  /* ========= Boot ========= */
  document.addEventListener('DOMContentLoaded',route);
})();
