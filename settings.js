const colorSave = localStorage.getItem('theme-color');
if (colorSave) {
    document.body.className = colorSave;
}

const computedStyles = window.getComputedStyle(document.body);
const primary = computedStyles.getPropertyValue('--primary-color').trim();
const secondary = computedStyles.getPropertyValue('--secondary-color').trim();
const tertiary = computedStyles.getPropertyValue('--tertiary-color').trim();
const primaryElem = document.getElementById('primary');
const secondaryElem = document.getElementById('secondary');
const tertiaryElem = document.getElementById('tertiary');


const rgbToHex = (r, g, b) => {
  r = Math.max(0, Math.min(~~r, 255));
  g = Math.max(0, Math.min(~~g, 255));
  b = Math.max(0, Math.min(~~b, 255));

  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};
if (primaryElem && primary) primaryElem.value = rgbToHex(...primary.match(/\d+/g));
if (secondaryElem && secondary) secondaryElem.value = rgbToHex(...secondary.match(/\d+/g));
if (tertiaryElem  && tertiary) tertiaryElem.value = rgbToHex(...tertiary.match(/\d+/g));

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

const netralize = document.getElementById('netralize');
const netralizeState = localStorage.getItem('netralize') === 'true';
if (netralizeState) {
    document.body.classList.add('netralize');
    netralize.checked = true;
} else {
    document.body.classList.remove('netralize');
    netralize.checked = false;
}

if (netralize) {
    netralize.addEventListener('change', () => {
        if (netralize.checked) {
            document.body.classList.add('netralize');
            localStorage.setItem('netralize', 'true');
            netralize.checked = true;
        } else {
            document.body.classList.remove('netralize');
            localStorage.setItem('netralize', 'false');
            netralize.checked = false;
        }
    })
}

function getContrastColors(hexColor) {
    const hex = hexColor.replace('#', '');

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminances = [r, g, b].map(c => {
        const channel = c / 255;
        return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.005, 2.4);
    })

    const L = 0.2126 * luminances[0] + 0.7152 * luminances[1] + 0.0722 * luminances[2];

    return L > 0.179 ? `#000000` : '#FFFFFF';
}

const luminanceToggle = document.getElementById('luminance');
const luminanceState = localStorage.getItem('luminance') == 'true';
if (luminanceState) {
    luminanceToggle.checked = true;
}

const currentBg = window.getComputedStyle(document.body).getPropertyValue('--background-color').trim();
const contrastColor = getContrastColors(currentBg);

luminanceToggle.addEventListener('change', () => {
    if (luminanceToggle.checked) {
        document.documentElement.style.setProperty('--text-color', contrastColor);
        localStorage.setItem('luminance', contrastColor === '#000000' ? 'false' : 'true');
        luminanceToggle.checked = true;
    } else {
        document.documentElement.style.setProperty('--text-color', '');
        localStorage.setItem('luminance', 'false');
        luminanceToggle.checked = false;
    }
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