(()=>{'use strict';
const dialog=document.getElementById('contact-dialog');if(!dialog)return;
const close=dialog.querySelector('.contact-modal-close');
document.querySelectorAll('[data-contact-trigger]').forEach(link=>{
  link.addEventListener('click',event=>{
    if(typeof dialog.showModal!=='function')return; // Let the mailto: link work on old browsers.
    event.preventDefault();dialog.showModal();
  });
});
close.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
const copy=dialog.querySelector('.contact-copy'),status=dialog.querySelector('.contact-feedback');
copy.addEventListener('click',async()=>{
 const email='tupas.leandro.lt@gmail.com';let ok=false;
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(email);ok=true;}}catch(_){ok=false;}
 if(!ok){
   const input=document.createElement('textarea');input.value=email;input.setAttribute('readonly','');
   input.style.position='fixed';input.style.opacity='0';document.body.append(input);input.select();
   try{ok=document.execCommand('copy');}catch(_){ok=false;}input.remove();
 }
 status.textContent=ok?'Email copied — see you in my inbox!':'Select the email address above to copy it, or use Gmail.';
 if(ok){const label=copy.firstChild;label.textContent='COPIED! ';}
});
})();