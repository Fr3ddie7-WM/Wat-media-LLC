(()=>{
 const toggle=document.querySelector('.menu-button'),menu=document.getElementById('mobile-menu');
 const closeMenu=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')};
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open))});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();toggle.focus()}});
 document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target))closeMenu()});
 matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeMenu()});
 document.getElementById('year').textContent=new Date().getFullYear();
 const gallery=document.querySelector('.gallery'),prev=document.querySelector('[data-gallery="-1"]'),next=document.querySelector('[data-gallery="1"]');
 function updateGallery(){prev.disabled=gallery.scrollLeft<2;next.disabled=gallery.scrollLeft+gallery.clientWidth>=gallery.scrollWidth-3}
 function moveGallery(direction){const step=gallery.querySelector('.gallery-item').getBoundingClientRect().width+parseFloat(getComputedStyle(gallery).gap);gallery.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}
 prev.addEventListener('click',()=>moveGallery(-1));next.addEventListener('click',()=>moveGallery(1));gallery.addEventListener('scroll',updateGallery,{passive:true});window.addEventListener('resize',updateGallery);gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();moveGallery(e.key==='ArrowRight'?1:-1)}});updateGallery();
 const form=document.getElementById('contact-form'),button=form.querySelector('button[type=submit]'),error=document.getElementById('form-error'),success=document.getElementById('form-success');
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;button.disabled=true;button.textContent='Sending…';error.textContent='';try{const res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!res.ok)throw new Error('Unable to send');form.hidden=true;success.classList.add('visible');success.focus()}catch{error.textContent='Your request couldn’t be sent. Please try again, or email freddie@watmediallc.com.';error.focus();button.disabled=false;button.textContent='Claim My Free Promo Video →'}});
})();
