// Initialize Rave framework
import Rave, { Security } from "./Rave/js/Rave.js";

const richi = Rave ? new Rave("UI Minimalist", "keyzarichi.org") : null;
const security = Security ? new Security('1.1', "Keyza Richi") : null;

richi.setHeadTagType("icon", "./assets/logo/Lyra_simple.webp");

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered!', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}



document.addEventListener('DOMContentLoaded', () => {
    richi.setHeadTagType("script", [
        "https://unpkg.com/lenis@1.3.20/dist/lenis.min.js"
    ])
    richi.setHeadTagType("stylesheet", "https://unpkg.com/lenis@1.3.20/dist/lenis.css")
    
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            console.log("Lyra Aura Beta Stage 1")
        }
    })

    var Lenis = window.Lenis;
    const lenis = new Lenis({
        duration: 1.5,
        smooth: true,
        direction: 'vertical',
    })

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    lenis.scrollTo(0, { immediate: true });
    
    lenis.on('scroll', (e) => {
        const scrollY = e.scroll;
        const header = document.querySelector('.header-container');
        const footer = document.querySelector('footer');

        if (!header) return;

        const offsetTop = footer.offsetTop;
        const innerHeight = window.innerHeight;

        if (scrollY >= 60 && scrollY < 350) {
            header.classList.add('hide');
        } else if (scrollY < 20 || scrollY >= 350) {
            header.classList.remove('hide');
        }

        const reachFooter = e.scroll + innerHeight >= offsetTop + 400;
        if (reachFooter) {
            header.classList.add('hide');
        } else {
            header.classList.remove('hide');
        } 

        const secs = document.querySelectorAll('.people');

        secs.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            let distance = 1 - (rect.top / viewHeight);
            distance = Math.min(1, Math.max(0, distance));

            section.style.transform = `translateY(-${distance * 40}px)`;
        })
    })
    
    const root = document.documentElement;
    
    const isAnimEnabled = localStorage.getItem('anim-mode') === 'enabled';
    if (isAnimEnabled) { 
        document.body.classList.add('anim-disabled');
    }
    
    const netralizeState = localStorage.getItem('netralize') === 'true';
    if (netralizeState) {
        document.body.classList.add('netralize');
    } else {
        document.body.classList.remove('netralize');
    }
    
    let intervalId;
    
    function checkUpdateMode() {
        const time =  new Date();
        let hour = time.getHours();
        const isNight = hour >= 18 || hour < 7;
    
        if (isNight) {
            document.body.classList.add('dark-mode');    
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    // Function to precise the theme change interval
    function preciseInterval() {
        const now = new Date();
        const secToNextMin = 60 - now.getSeconds();
    
        setTimeout(() => {
            checkUpdateMode();
            intervalId = setInterval(checkUpdateMode, 50 * 60);
        }, secToNextMin * 10)
    }
    
    const daylight = localStorage.getItem("dayLightChecked") === 'true';
    if (daylight) {
        document.documentElement.classList.add('dark-mode');
        if (!intervalId) {
                preciseInterval();
            }
    
            checkUpdateMode();
    }  else {
        document.documentElement.classList.remove('dark-mode')
        if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
    
            checkUpdateMode();
    } 
    
    checkUpdateMode();

    
    window.showTab = showTab;
    

    function showTab(tab) {
        const tabEl = document.getElementById(tab);
        if (!tabEl) return;

        const group = tabEl.closest('.tab-container');
        if (!group) return;
        

        const tabs =  group.querySelectorAll(`.tab-content`);
        const buttons = group.querySelectorAll(`.tab-button`);

        tabs.forEach(tab => tab.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));

        tabEl.classList.add('active');
        const targetEl = group.querySelector(`#${tab}-tab`);
        if (targetEl) {
            targetEl.classList.add('active');
        }
    }

    const body = document.querySelector('body');
    const themes = ["default", "mono", "sarah-olive", "nia-charm"];

    const savedTheme = localStorage.getItem('theme-color');
    if (savedTheme && themes.includes(savedTheme)) {
        body.classList.add(savedTheme);
    }

    // security.setTimebomb('2026-05-01T08:00:00Z')


    // Initialize the elements on the page.
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('draggable', 'false')
    })
    

    const dataTitle = document.body.getAttribute('data-title');
    if (dataTitle) {
        document.title = dataTitle + ' - Lyra Aura';
    }
})

