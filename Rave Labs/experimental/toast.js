document.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.querySelector('.toast-container');
    let isAnimating = false;

    function loadToastCSS() {
        if (!document.getElementById('toast-css')) {
            const link = document.createElement('link');
            link.id = 'toast-css';
            link.rel = 'stylesheet';
            link.href = '/Rave%20Labs/experimental/ToastNotification.css'; // Adjust path if needed
            document.head.appendChild(link);
        }
    }
    
    function ensureToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.classList.add('toast-container');
            document.body.appendChild(container);
        }
    }

    function createToast(options = {}) {
        const {
            toastType = "error" | "info" | "warning",
            title = "",
            subTitle = "",
            timeoutDuration = 1000
        } = options;
        loadToastCSS();
        ensureToastContainer();

        let newToast;
        
        newToast = document.createElement('div');
        newToast.classList.add('toast-panel');
        
        const titleElem = document.createElement('div');
        titleElem.classList.add('toast-msg');
        titleElem.textContent = title;

        const progElem = document.createElement('div');
        progElem.classList.add('progress-timer');

        newToast.appendChild(titleElem);
        newToast.appendChild(progElem);
        toastContainer.appendChild(newToast);
        newToast = toastContainer.querySelector('.toast-panel');
        newToast.querySelector('.toast-msg').textContent = title;

        function openToast() {
            if (isAnimating) return;
            isAnimating = true;

            requestAnimationFrame(() => {
                newToast.style.animation = 'fadeInUp .3s';

                newToast.addEventListener('animationend', () => {
                    if (newToast.style.animation.includes('fadeInUp')) {
                        newToast.classList.remove('hidden');
                        isAnimating = false;
                    }
                }, {once: true})
            })
        }
        
        function closeToast() {
            if (isAnimating) return;
            isAnimating = true;

            requestAnimationFrame(() => {
                newToast.style.animation = 'fadeOutUp .3s';

                newToast.addEventListener('animationend', () => {
                    if (newToast.style.animation.includes('fadeOutUp')) {
                        newToast.classList.add('hidden');
                        isAnimating = false;
                    }
                }, {once: true})
            })
        }
        
        newToast.classList.remove("info", "warning", "error");
        switch (toastType) {
            case "info":
                newToast.classList.add('info');
                break;
            case "warning":
                newToast.classList.add('warning');
                break;
            case "error":
                newToast.classList.add('error');
                break;
        }

        if (!newToast.querySelector('progress-timer')) {
            const prog = document.createElement('div');
            prog.classList.add('progress-timer');
            newToast.appendChild(prog);
            prog.addEventListener('transitionend', () => {
                newToast.style.animation = 'fadeOutUp .3s';

                newToast.addEventListener('animationend', () => {
                    if (newToast.style.animation.includes('fadeOutUp')) {
                        newToast.classList.add('hidden');
                    }
                }, {once: true})
            }, {once: true});
            prog.style.transition = `width linear ${timeoutDuration}ms`;
            
            setTimeout(() => {
                prog.style.width = "0%";
            }, timeMilliseconds / 100);
        }
        
        if (!newToast.querySelector('.toast-close')) {
            const closeButton = document.createElement('button');
            closeButton.className = 'btn toast-close';
            closeButton.innerHTML = '&times;';
            newToast.appendChild(closeButton);
            closeButton.addEventListener('click', closeToast);
        }

        openToast(newToast);

    }

    function startToast(title, toastType, timeMilliseconds) {
        loadToastCSS();
        ensureToastContainer();

        
    }

    startToast("This is a sample toast notification!", "info", 5000);
})