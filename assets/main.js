(function(){
  'use strict';
  const $=(selector,scope=document)=>scope.querySelector(selector);
  const year=$('#year'); if(year)year.textContent=new Date().getFullYear();
  const toggle=$('.mobile-nav-toggle'), mobile=$('.mobile-menu');
  if(toggle && mobile){
    toggle.addEventListener('click',()=>{
      const wasOpen=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!wasOpen));
      toggle.setAttribute('aria-label',wasOpen?'Open menu':'Close menu');
      mobile.classList.toggle('is-open',!wasOpen);
    });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      toggle.setAttribute('aria-expanded','false');mobile.classList.remove('is-open');toggle.setAttribute('aria-label','Open menu');
    }));
  }

  if(document.body.dataset.page==='home'){
    const filters=[...document.querySelectorAll('[data-filter]')];
    const cards=[...document.querySelectorAll('.project-card')];
    const archiveButton=$('#archive-toggle'),archiveControls=$('#archive-controls');
    const status=$('#gallery-status'),sectionBreak=$('#project-break'),galleryIntro=$('#project-gallery-intro');
    let activeCategory='all',archiveOpen=false;
    const names={'case-study':'CASE STUDIES','freelance':'FREELANCE WORK','professional':'PROFESSIONAL WORK','misc':'MISCELLANEOUS WORK'};
    function paint(){
      const visible=cards.filter(card=>{
        const categoryOk=activeCategory==='all'||card.dataset.category.split(' ').includes(activeCategory);
        const allowed=activeCategory!=='all'||archiveOpen||card.dataset.curated==='true';
        card.hidden=!(categoryOk&&allowed);
        return !card.hidden;
      });
      filters.forEach(item=>{const active=item.dataset.filter===activeCategory;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
      if(sectionBreak)sectionBreak.hidden=activeCategory!=='all';
      if(archiveControls)archiveControls.hidden=activeCategory!=='all';
      if(archiveButton){archiveButton.setAttribute('aria-expanded',String(archiveOpen));archiveButton.innerHTML=archiveOpen?'BACK TO SELECTED WORK <span aria-hidden="true">↑</span>':'EXPLORE THE FULL 21-PROJECT ARCHIVE <span aria-hidden="true">↗</span>';}
      const label=activeCategory==='all'?(archiveOpen?'THE FULL PROJECT INDEX':'A HANDPICKED START'):names[activeCategory];
      if(galleryIntro)galleryIntro.firstChild.textContent=label+' ';
      if(status)status.textContent=`${visible.length} ${activeCategory==='all'&&!archiveOpen?'SELECTED ':''}PROJECTS · 21 TOTAL`;
    }
    filters.forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.filter;paint();}));
    if(archiveButton)archiveButton.addEventListener('click',()=>{activeCategory='all';archiveOpen=!archiveOpen;paint();});
    paint();
    return;
  }
  if(document.body.dataset.page!=='project'||!window.PORTFOLIO_PROJECTS) return;
  const projects=window.PORTFOLIO_PROJECTS;
  const requestedSlug=new URLSearchParams(location.search).get('slug')||'advenient';
  // Earlier portfolio releases used a separate, redundant Confidential Project page.
  const slug=requestedSlug==='confidential'?'500d':requestedSlug;
  const p=projects[slug];
  document.body.dataset.project=slug;
  if(!p){location.replace('index.html#work');return;}
  document.title=`${p.name} — Yancy Tupas`;
  const description=document.querySelector('meta[name=description]'); if(description)description.setAttribute('content',`${p.name} — ${p.dek} View design process and selected project work by Yancy Tupas.`);
  const set=(selector,value)=>{const el=$(selector);if(el)el.textContent=value||''};
  set('#project-name',p.name);set('#project-index',`PROJECT / ${p.number}`);
  set('#project-dek',p.dek);set('#project-year',p.year);
  set('#project-discipline',p.discipline);set('#project-tools',p.tools);
  set('#project-brief',p.brief);set('#project-approach',p.approach);set('#project-caption',p.caption); if(!p.featured && p.projectType){$('#project-category').hidden=false;set('#project-category',p.projectType);}
  const hero=$('#project-main-image');hero.src=`assets/images/${p.image}`;hero.alt=`Brand identity and visual work for ${p.name}`;
  const bullets=$('#project-points');(p.points||[]).forEach(v=>{const li=document.createElement('li');li.textContent=v;bullets.append(li)});
  const next=projects[p.next]; if(next){set('#next-project-name',next.name);$('#next-project-link').href=`project.html?slug=${p.next}`;}

  // Standard gallery remains for the other six projects, while the three
  // flagship projects get dedicated image-led design rationale chapters.
  const gallery=$('#project-gallery');
  const lightbox=$('#image-lightbox');
  if(p.featured && p.chapters){
    $('#project-category').hidden=false;
    set('#project-category',p.projectType);
    $('.project-gallery').hidden=true;
    const extended=$('#case-study-extended');extended.hidden=false;
    set('#case-study-introduction',p.introduction);
    set('#case-study-role',p.role);
    set('#case-study-collaborators',p.collaborators);
    set('#case-study-footnote',p.footnote);
    const deliverables=$('#case-study-deliverables');
    (p.deliverables||[]).forEach(str=>{const li=document.createElement('li');li.textContent=str;deliverables.append(li)});
    const contents=$('#case-study-contents-nav');
    (p.contents||[]).forEach((s,i)=>{
      const a=document.createElement('a');a.href=`#chapter-${s.id}`;
      const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');
      a.append(n,document.createTextNode(s.label));contents.append(a);
    });
    const chapters=$('#case-study-chapters');
    p.chapters.forEach(ch=>chapters.append(buildChapter(ch,slug)));
    const source=$('#case-study-source');
    if(source && p.sourcePdf){
      const link=source.querySelector('a');
      link.href=p.sourcePdf;
      link.textContent=p.sourcePdfLabel||'VIEW THE ORIGINAL BRAND GUIDE (PDF) ↗';
      source.hidden=false;
    }
  } else {
    (p.gallery||[]).forEach((imageName,i)=>{
      const b=document.createElement('button');b.type='button';b.className='gallery-item';
      const label=(p.galleryLabels||[])[i]||`${p.name} visual application ${i+1}`;
      const layout=(p.galleryLayouts||[])[i];
      if(layout==='wide') b.classList.add('gallery-item--wide');
      b.setAttribute('aria-label',`Enlarge: ${label}`);
      b.dataset.enlarge='true';
      const img=document.createElement('img');img.src=`assets/images/${imageName}`;
      img.alt=label;img.loading='lazy';img.decoding='async';
      const dimensions=(p.galleryDimensions||[])[i];
      if(dimensions){img.width=dimensions[0];img.height=dimensions[1];}
      b.append(img);
      if(Array.isArray(p.galleryLabels)){
        const note=document.createElement('span');note.className='gallery-caption';
        const index=document.createElement('strong');index.textContent=String(i+1).padStart(2,'0');
        const caption=document.createElement('span');caption.textContent=label;
        note.append(index,caption);b.append(note);
      }
      gallery.append(b);
    });
  }
  // Some freelance projects have a documented design system in addition to their galleries.
  if (p.brandSystem) {
    const system=p.brandSystem, section=$('#project-brand-system');
    if(section){
      section.hidden=false;
      set('#brand-system-intro',system.intro);set('#brand-system-logo-note',system.logoNote);
      const colorGrid=$('#brand-system-colors');
      (system.colors||[]).forEach(c=>{
        const swatch=document.createElement('div');swatch.className='brand-swatch';
        const sample=document.createElement('div');sample.className='brand-swatch-sample';sample.style.backgroundColor=c.hex;
        const name=document.createElement('strong');name.textContent=c.name;
        const code=document.createElement('code');code.textContent=c.hex.toUpperCase();
        swatch.append(sample,name,code);colorGrid.append(swatch);
      });
      const fontGrid=$('#brand-system-fonts');
      (system.fonts||[]).forEach((font,i)=>{
        const item=document.createElement('div');item.className='brand-font-example';
        const index=document.createElement('span');index.textContent=String(i+1).padStart(2,'0');
        const heading=document.createElement('h3');heading.textContent=font.name;
        const specimen=document.createElement('span');specimen.className='font-specimen';specimen.textContent='Aa Bb Cc 123';
        if(font.name.toLowerCase()==='bahnschrift')specimen.style.fontFamily='Bahnschrift,Arial,sans-serif';
        const role=document.createElement('p');role.textContent=font.use;
        item.append(index,heading,specimen,role);fontGrid.append(item);
      });
      const rules=$('#brand-system-rules');
      (system.rules||[]).forEach((r,i)=>{const li=document.createElement('li');
        const n=document.createElement('span');n.textContent=String(i+1).padStart(2,'0');
        li.append(n,document.createTextNode(r));rules.append(li);
      });
    }
  }
  // 500D: a separate, compact archive underneath the curated project gallery.
  if(slug==='500d' && Array.isArray(window.PORTFOLIO_500D)){
    const section=$('#project-production-archive');section.hidden=false;
    const assets=window.PORTFOLIO_500D;
    const grid=$('#production-grid'),more=$('#production-more');
    const filters=[...section.querySelectorAll('[data-production-filter]')];
    let category='all',expanded=false;
    function filtered(){return assets.filter(a=>category==='all'||(category==='t2'?a.origin==='t2':a.category===category));}
    function draw(){
      const entries=filtered(),shown=expanded?entries:entries.slice(0,18);
      grid.replaceChildren();
      shown.forEach((a,i)=>{
        const button=document.createElement('button');button.type='button';button.className='production-card';button.dataset.enlarge='true';
        button.setAttribute('aria-label','Enlarge '+a.title);
        const picture=document.createElement('span');picture.className='production-card-image';
        const img=document.createElement('img');img.src='assets/images/'+a.file;img.loading='lazy';img.alt=a.title;
        img.width=a.width;img.height=a.height;picture.append(img);
        const text=document.createElement('span');text.className='production-card-title';text.textContent=a.title;
        button.append(picture,text);grid.append(button);
      });
      const remains=entries.length-shown.length;
      more.hidden=remains===0;
      if(remains)more.textContent=`SHOW ${remains} MORE IMAGE${remains===1?'':'S'} ↓`;
    }
    filters.forEach(btn=>btn.addEventListener('click',()=>{
      category=btn.dataset.productionFilter;expanded=false;
      filters.forEach(el=>{const selected=el===btn;el.classList.toggle('active',selected);el.setAttribute('aria-pressed',String(selected))});
      draw();
    }));
    more.addEventListener('click',()=>{expanded=true;draw();});
    draw();
  }
  if(lightbox){
    const image=lightbox.querySelector('img');const close=lightbox.querySelector('.lightbox-close');
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-enlarge]');if(!button)return;
      const pic=button.querySelector('img');if(!pic)return;
      image.src=pic.src;image.alt=pic.alt;
      if(typeof lightbox.showModal==='function')lightbox.showModal();
    });
    close.addEventListener('click',()=>lightbox.close());
    lightbox.addEventListener('click',event=>{if(event.target===lightbox)lightbox.close()});
  }

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }
  function buildChapter(ch,projectSlug){
    const section=element('section','case-study-chapter frame');section.id=`chapter-${ch.id}`;
    const head=element('div','case-study-chapter-head');
    const titleCol=element('div','case-study-chapter-title');
    titleCol.append(element('small','',`${ch.number} / ${ch.kicker}`),element('h2','',ch.title));
    const copy=element('div','case-study-chapter-copy');
    (ch.paragraphs||[]).forEach(para=>copy.append(element('p','',para)));
    head.append(titleCol,copy);section.append(head);
    if(ch.colors?.length || ch.typefaces?.length){
      const system=element('div','case-study-system');
      if(ch.colors?.length){
        system.append(element('p','case-study-system-label','COLOR LANGUAGE'));
        const grid=element('div','case-study-color-grid');
        ch.colors.forEach(color=>{
          const swatch=element('div','case-study-color');
          swatch.style.backgroundColor=color.hex;
          const n=parseInt(color.hex.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
          swatch.style.color=((r*.299+g*.587+b*.114)>145)?'#191713':'#fff';
          swatch.append(element('b','',color.name));
          // Hex labels for approximate hues are deliberately omitted.
          if(!color.approx)swatch.append(element('code','',color.hex.toUpperCase()));
          grid.append(swatch);
        });
        system.append(grid);
      }
      if(ch.typefaces?.length){
        const typeGrid=element('div','case-study-typefaces');
        ch.typefaces.forEach(t=>{
          const item=element('div','case-study-typeface');
          item.append(element('small','',t.label.toUpperCase()),element('h3','',t.name),element('p','',t.usage));
          typeGrid.append(item);
        });
        system.append(typeGrid);
      }
      section.append(system);
    }
    if(ch.images?.length){
      const imageGrid=element('div','case-study-visual-grid');
      ch.images.forEach(media=>{
        const figure=element('figure',media.size==='wide'?'wide':'half');
        const button=element('button','case-visual-button');button.type='button';button.dataset.enlarge='true';
        if(media.transparent)button.classList.add('case-visual-button--transparent');
        button.setAttribute('aria-label',`Enlarge: ${media.caption}`);
        const img=document.createElement('img');
        img.src=`assets/case-studies/${projectSlug}/${media.file}`;
        img.alt=media.caption;
        img.loading='lazy';
        if(projectSlug==='wunderbar' && window.WUNDERBAR_IMAGE_SIZES?.[media.file]) {
          const [w,h]=window.WUNDERBAR_IMAGE_SIZES[media.file];img.width=w;img.height=h;
        }
        button.append(img);figure.append(button,element('figcaption','',media.caption));imageGrid.append(figure);
      });
      section.append(imageGrid);
    }
    return section;
  }
})();
