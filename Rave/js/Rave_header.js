const url = './elements/header.html';

fetch(url).then(response => response.text()).then(html => {
    document.querySelector('header').innerHTML = html;

    function switchToDarkMode(toggleElement, checkbox, iconSelector) {
        const toggle = document.querySelector(toggleElement);
        const cbx = document.querySelector(checkbox);
        const icon = document.querySelector(iconSelector);

        const storage = localStorage.getItem('darkMode');

        if (!toggleElement || !checkbox) return;

        const isDark = storage !== null ? storage === "true" : window.matchMedia('prefers-color-scheme: dark').matches;

        applyTheme(isDark);

        toggle.addEventListener('click', () => {
            const enabled = !document.documentElement.classList.contains('dark-mode');
            applyTheme(enabled)
            localStorage.setItem("darkMode", enabled);
            cbx.checked = enabled;
        })

        function applyTheme(isEnabled) {
            document.documentElement.setAttribute('data-theme', isEnabled ? 'dark' : 'light');
            document.documentElement.classList.toggle("dark-mode", isEnabled); 

            cbx.checked = isEnabled;

            if (icon) {
                icon.classList.toggle('uil-moon', isEnabled);
                icon.classList.toggle('uil-sun', !isEnabled);
            }
        }
    }

    switchToDarkMode('#toggleTheme', '#cbx', '#themeIcon')

}).finally(() => {
    let element = document.querySelectorAll('[data-tooltip]');

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);
    
    element.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            tooltip.textContent = elem.dataset.tooltip || 'No tooltip text';
            tooltip.style.display = 'block';
            tooltip.style.left = '-9999px';
            tooltip.style.top = '-9999px';
            
            requestAnimationFrame(() => {
                const rect = elem.getBoundingClientRect();
                let left = rect.left + window.scrollX;
                let top = rect.top + window.scrollY - tooltip.offsetHeight - 12;
                left += (rect.width - tooltip.offsetWidth) / 2;
                
                if (top < window.scrollY) {
                    top = rect.bottom + window.scrollY + 15;
                }

                if (left < window.scrollX) {
                    left += rect.left + window.scrollX + 15;
                } 
    
                const maxRight = window.scrollX + window.innerWidth;
                const rightEdge = left + tooltip.offsetWidth;
                
                if (rightEdge > maxRight) {
                    left = maxRight - tooltip.offsetWidth - 35;
                }
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`

            })


        })

        elem.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        elem.addEventListener('touchmove', () => {
            tooltip.style.display = "none";
        })
        
    })


    const btns = document.querySelectorAll('.navBtn');
    const pops = document.querySelectorAll('.drop-down');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const rect = btn.getBoundingClientRect();
    
            pops.forEach(pop => {
                pop.style.left = rect.left + 'px';
                pop.style.top = rect.bottom + 'px';

                const popRect = pop.getBoundingClientRect();
                if (popRect.right > window.innerWidth) {
                    const right = rect.right - popRect.width;
                    pop.style.left = right + 'px';
                }
            })
        })

    })

    const searchBtns = document.querySelectorAll('.searchBtn');
    let inputs = document.querySelectorAll('.search-text');
    const prevText = document.querySelector('.prev-search-text');

    searchBtns.forEach((searchBtn) => {
        searchBtn.addEventListener('click', (event) => { 
            event.preventDefault();

            const hasEmpty = Array.from(inputs).filter(input => input.offsetParent !== null && !input.disabled && !input.classList.contains('disabled'))
            const query = hasEmpty[0]?.value.trim() || '';

            if (!query) {
                alert('Please enter a search term');
                return;
            } 
            window.location.href = `./result.html?search=${encodeURIComponent(query)}`;
            prevText.innerHTML = query;
            

        });
    })
    const header = document.querySelector('header');
    const navpane = document.querySelector('.nav-pane');
    const btn = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');
    const menuButtons = document.querySelectorAll('.menuButton');
    const brand = document.querySelector('.nav-pane .footer');
    const previews = document.querySelectorAll('.preview-item');
    let isAnimating = false;
    let menuAnimationDuration = 550;
    let navPaneAnimDuration = 9;

    // Both logics below may seem redundant to some developers, but this is a temporary mitigation to patch a bug with NavPane animations being too slow on mobile. 
    // for desktop, fix a bug when these animation duration aren't set to expected value unless you resizing the window's width less than or equal to 768px and refresh the page.
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            menuAnimationDuration = 0;
            navPaneAnimDuration = 4;
        } else {
            menuAnimationDuration = 550;
            navPaneAnimDuration = 9;
        }
    })

    menuButtons.forEach(btn => {
        const targetItemClass = btn.id + "-item";
        const target = document.querySelector('.' + targetItemClass);
        btn.addEventListener('mouseenter', () => {
            previews.forEach(p => p.classList.remove('show'));
            target.classList.add('show');
        })
        
        btn.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                target.style.animation = 'fadeOut .5s';

                target.addEventListener('animationend', () => {
                    if (target.style.animation.includes('fadeOut')) {
                        target.classList.remove('show')
                        
                    }
                }, {once: true})
            })
        })
    })

    const content = document.querySelector('.nav-pane .content');
    content.addEventListener('mouseleave', () => {
        previews.forEach(p => p.classList.remove('show'));
    })
    
    function openNavPane() {
        if (isAnimating) return;
        isAnimating = true;

        overlay.classList.add('showOverlay');
        brand.classList.remove('fade-out');
        brand.classList.add('fade-in');
        header.classList.add('no-blend');
        btn.classList.add('active');
        
        // for mobile, fix a bug when sometimes these animation duration are still same as desktop's default value. 
        if (window.innerWidth <= 768) {
            menuAnimationDuration = 50;
            navPaneAnimDuration = 4;
        } else {
            menuAnimationDuration = 550;
            navPaneAnimDuration = 9;
        }
        
        requestAnimationFrame(() => { 
            navpane.style.animation = `fadeInUpSmooth .${navPaneAnimDuration}s cubic-bezier(0.475, 0.12, 0.165, 1)`;
            btn.classList.add('no-pointer');
            navpane.classList.remove('hidden');
            setTimeout(() => {
                menuButtons.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.classList.remove('fade-out');
                        btn.classList.add('fade-in');
                    }, index * 60);
                    
                })
            }, menuAnimationDuration)
            navpane.addEventListener('animationend', () => {
                if (navpane.style.animation.includes('fadeIn')) {
                    btn.classList.remove('no-pointer');
                    isAnimating = false;
                }
            });
        });
    }

    function closeNavPane() {
        if (isAnimating) return;
        isAnimating = true;
        btn.classList.add('no-pointer');
        let noPointerDelay = 600;
        if (window.innerWidth <= 768) {
            menuAnimationDuration = 300;
            navPaneAnimDuration = 3;
            noPointerDelay = 250;
        }
        
        requestAnimationFrame(() => {
            btn.classList.remove('active');
            setTimeout(() => {
                navpane.style.animation = `fadeOutUpSmooth .${navPaneAnimDuration}s cubic-bezier(0.8, 0.292, 0.333, 1)`;
            }, menuAnimationDuration);
            
            overlay.classList.remove('showOverlay');
            brand.classList.add('fade-out');
            
            const items = Array.from(menuButtons);
            items.reverse();
            items.forEach((btn, index) => {
                setTimeout(() => {
                    btn.classList.remove('fade-in');
                    btn.classList.add('fade-out');
                    brand.classList.remove('fade-in');
                    brand.classList.add('fade-out');
                }, index * 100);
                
            })
            
            navpane.addEventListener('animationend', () => {
                if (navpane.style.animation.includes('fadeOut')) {
                    isAnimating = false;
                    navpane.classList.add('hidden');
                    header.classList.remove('no-blend');
                    setTimeout(() => {
                        btn.classList.remove('no-pointer');
                    }, noPointerDelay) 
                }
            }, {once: true});
        });
        
    }

    function toggleNavPane() {
        if (navpane.classList.contains('hidden')) {
            openNavPane();
        } else {
            closeNavPane();
        }
    }

    btn.addEventListener('click', toggleNavPane);
    

    
    const body = document.body;

    window.addEventListener('scroll', () => {
        body.scrollTop > 100 || document.documentElement.scrollTop > 100 ? document.querySelector('.header-container').classList.add('scrolled') : document.querySelector('.header-container').classList.remove('scrolled');

    })

    const cart = header.querySelector('#cart');
    const dialogCart = document.getElementById('cart-dialog');
    const dialogClose= document.getElementById('close1');

    cart.addEventListener('click', () => {
        dialogCart.showModal();
    })
    
    dialogClose.addEventListener('click', () => {
        requestAnimationFrame(() => {
            dialogCart.style.animation = 'fadeOut .8s cubic-bezier(0.075, 0.82, 0.165, 1)';
            dialogCart.addEventListener('animationend', () => {
                dialogCart.close();
                dialogCart.style.animation = '';
            }, {once: true});
        })
    })

    function disableAnimation(checkbox) {
    const cbx = document.querySelector(checkbox);
    const isAnimEnabled = localStorage.getItem('anim-mode') === 'enabled';
    

    if (isAnimEnabled) {
        document.body.classList.add('anim-disabled');
        cbx.checked = true;
        
    }
    else {
        document.body.classList.remove('anim-disabled');
        cbx.checked = false;
        localStorage.setItem("anim-mode", "disabled");
    }
    
    cbx.addEventListener('change', () => {
        if (cbx.checked) {
            document.body.classList.add('anim-disabled');
            cbx.checked = true;
            localStorage.setItem("anim-mode", "enabled");
        }
        else {
            document.body.classList.remove('anim-disabled');
            cbx.checked = false;
            localStorage.setItem("anim-mode", "disabled");
        }
    })
}

const dsbAnim = '#dsbAnimCbx';
disableAnimation(dsbAnim);

    const floatMenu = header.querySelector('#labs');
    const dialogAI = document.getElementById('float-menu');
    const dialogClose1 = document.getElementById('close2');

    floatMenu.addEventListener('click', () => {
        dialogAI.showModal();
    })

    dialogAI.addEventListener('scroll', () => {
        if (dialogAI.scrollTop >= 160) {
            dialogAI.querySelector('.dialog-header').classList.add('scrolled');
        } else {
            dialogAI.querySelector('.dialog-header').classList.remove('scrolled');
        }
    })


    dialogClose1.addEventListener('click', () => {
        requestAnimationFrame(() => {
            dialogAI.style.animation = 'fadeOut .4s cubic-bezier(0.075, 0.82, 0.165, 1)';
            dialogAI.addEventListener('animationend', () => {
                dialogAI.close();
                dialogAI.style.animation = '';
                dialogAI.scrollTop = 0;
            }, {once: true});
        })
    })

    const highContrastCbx = document.getElementById('contrastCbx');
    if (!highContrastCbx) return;
    const highContrastState = localStorage.getItem('high-contrast') === 'true';

    document.body.classList.toggle('high-contrast', highContrastState);
    highContrastCbx.checked = highContrastState;
    
    highContrastCbx.addEventListener('change', () => {
        const enabled = highContrastCbx.checked;

        document.body.classList.toggle('high-contrast', enabled);
        localStorage.setItem('high-contrast', enabled);
    })

    const dyslexiaCbx = document.getElementById('dyslexiaCbx');
    if (!dyslexiaCbx) return;
    
    const dyslexiaState = localStorage.getItem('dyslexia') === 'true';

    document.body.classList.toggle('dyslexia', dyslexiaState);
    dyslexiaCbx.checked = dyslexiaState;

    dyslexiaCbx.addEventListener('change', () => {
        const enabled = dyslexiaCbx.checked;

        document.body.classList.toggle('dyslexia', enabled);
        localStorage.setItem('dyslexia', enabled);
    })

    const minimalCbx = document.getElementById('monochromeCbx');
    if (!minimalCbx) return;
    
    const minimalState = localStorage.getItem('mono') === 'true';

    document.body.classList.toggle('mono', minimalState);
    minimalCbx.checked = minimalState;

    minimalCbx.addEventListener('change', () => {
        const enabled = minimalCbx.checked;

        document.body.classList.toggle('mono', enabled);
        localStorage.setItem('mono', enabled);
    })

    const btnRange = document.getElementById('btnRadius');
    const buttons = document.querySelectorAll('.btn, .tab-buttons, .tab-button, input[type="search"]');

    btnRange.addEventListener('input', () => {
        buttons.forEach(btn => {
            if (btnRange.value == 0) {
                btn.style.borderRadius = '0px';
            } else if (btnRange.value == 1) {
                btn.style.borderRadius = '8px';
            } else if (btnRange.value == 2) {
                btn.style.borderRadius = '16px';
            } else if (btnRange.value == 3) {
                btn.style.borderRadius = '50px';
            } else {
                btn.style.borderRadius = '16px';
            }
        })
    })

    for (let i = 0; i < localStorage.length; i++) { 
    const type = localStorage.key(i); 
    const color = localStorage.getItem(type); 
    if (type && color) { 
        document.documentElement.style.setProperty(`--${type}-color`, color) 
    } 
}

function changeColor(type, color) {
    const root = document.documentElement;
    root.style.setProperty(`--${type}-color`, color)

    const themeColor = document.querySelector('meta[type="theme-color"]');
    const head = document.querySelector('head');
    const primaryValue = document.getElementById('primary').value;
    if (!themeColor) {
        const script = document.createElement("meta"); 
        script.type = 'theme-color';
        script.value = primaryValue; 
        head.appendChild(script);
    }
}

function bindColor(e) {
    const type = e.target.dataset.type;
    const value = e.target.value;
    changeColor(type, value);
    localStorage.setItem(type, value);
}

const inputsType = document.querySelectorAll('input[data-type]');
if (inputsType.length > 0) {
    inputsType.forEach(input => {
        const savedColor = localStorage.getItem(input.dataset.type);
        if (savedColor) input.value = savedColor;
        
        input.addEventListener('input', bindColor);
    })
}
const useDaylightModeCbx = document.getElementById("useDaylightModeCbx");
const daylightState = localStorage.getItem('dayLightChecked') === 'true';


if (daylightState) {
    useDaylightModeCbx.checked = true;
    
    preciseInterval();
    checkUpdateMode();
    
} else {
    useDaylightModeCbx.checked = false;
   

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

useDaylightModeCbx.addEventListener("change", () => {
    if (useDaylightModeCbx.checked) {
        localStorage.setItem("dayLightChecked", "true");
        useDaylightModeCbx.checked = true;

        if (!intervalId) {
            preciseInterval();
        }

        checkUpdateMode();
    } else {
        localStorage.setItem("dayLightChecked", "false");
        useDaylightModeCbx.checked = false;

        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }

        checkUpdateMode();
    }
});
const panels = document.querySelectorAll('.panel');
const themes = ["default", "mono", "sarah-olive", "nia-charm"];

const savedTheme = localStorage.getItem('theme-color');
if (savedTheme && themes.includes(savedTheme)) {
    body.classList.add(savedTheme);

    panels.forEach(panel => {
        panel.classList.remove('selected');
        if (panel.dataset.theme === savedTheme) {
            panel.classList.add('selected');
        }
    })
}

panels.forEach(el => {
    el.addEventListener('click', () => {
        const theme = el.dataset.theme;
        themes.forEach(t => body.classList.remove(t))
        panels.forEach(p => p.classList.remove('selected'))

        el.classList.add('selected');
        body.classList.add(theme);

        localStorage.setItem('theme-color', theme);
    })
})

const selectLang = document.getElementById('select-lang');

async function loadLanguage(lang) {
    const res = await fetch(`/json/lang/${lang}.json`);
    if (!res.ok) throw new Error('Language not found.');
    return res.json();
    
}
function applyLang(text) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        const attr = el.dataset.attr;

        if (!text[key] || !(key in text)) return;

        if (attr) {
            el.setAttribute(attr, text[key]);
        } else {
            el.innerHTML = text[key];
        }
    })
}

async function setLang(lang) {
    console.log('settings:', lang)
    try {
        const translate = await loadLanguage(lang);
        applyLang(translate);
        localStorage.setItem('lang', lang)
        selectLang.value = lang;
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const langState = localStorage.getItem('lang');
    const browser = navigator.language.slice(0, 2);
    const lang = langState || browser || 'id'
    
    setLang(lang);
    selectLang.value = lang;
})


selectLang.addEventListener('change', (e) => {
    console.log('changed:', e.target.value)
    setLang(e.target.value);
})

const line = document.getElementById('line-spacing');
document.body.classList.remove('narrow-spacing', 'normal-spacing', 'wide-spacing')

line.addEventListener('change', () => {
    if (line.value === "narrow") {
        document.body.classList.add('narrow-spacing');
        document.body.classList.remove('normal-spacing');
        document.body.classList.remove('wide-spacing');
    }
    else if (line.value === "normal") {
        document.body.classList.remove('narrow-spacing');
        document.body.classList.add('normal-spacing');
        document.body.classList.remove('wide-spacing');
    } else if (line.value === "wide") {
        document.body.classList.remove('narrow-spacing');
        document.body.classList.remove('normal-spacing');
        document.body.classList.add('wide-spacing');
    } else {
        document.body.classList.remove('narrow-spacing');
        document.body.classList.add('normal-spacing');
        document.body.classList.remove('wide-spacing');
    }
})

})
