const loader = document.querySelector('loading-component');
        const MIN_DISPLAY_TIME = 2000;
        let pageLoaded = false;
        let minTimeReached = false;

        // Temporizador 
        setTimeout(() => {
            minTimeReached = true;
            if (pageLoaded) {
                loader.hide(); 
            }
        }, MIN_DISPLAY_TIME);

        // Esperar a que la página cargue completamente
        window.addEventListener('load', () => {
            pageLoaded = true;
            if (minTimeReached) {
                loader.hide(); 
            }
        });

class LoadingComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .loader-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: grid;
                    place-items: center;
                    z-index: 9999;
                    overflow: hidden; 
                }
                
                .loader-background {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    height: 0;
                    background-color: rgb(243, 240, 237);
                    border-radius: 50%;
                    transition: 
                        width 1.5s ease-out,
                        height 1.5s ease-out,
                        opacity 0.5s ease-out;
                }
                
                .loader-content {
                    position: relative;
                    z-index: 2;
                    opacity: 1;
                    transition: opacity 0.5s ease-out;
                }
                
                .loader {
                    --dim: 6rem;
                    background-color:#4CAF50;
                    width: var(--dim);
                    height: var(--dim);
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    animation: spin_412 5s infinite;
                }
                
                .loader img {
                    width: 30%;
                    height: auto;
                    animation: pulse 1.5s infinite alternate;
                }
                
                @keyframes spin_412 {
                    0% { transform: rotate(0) scale(1); }
                    50% { transform: rotate(720deg) scale(1.3); }
                    100% { transform: rotate(0) scale(1); }
                }
                
                @keyframes pulse {
                    from { transform: scale(0.9); opacity: 0.8; }
                    to { transform: scale(1.1); opacity: 1; }
                }
            </style>
            <div class="loader-container">
                <div class="loader-background"></div>
                <div class="loader-content">
                    <div class="loader">
                        <img src="${this.getAttribute('image-src') || 'assets/icon_loader.png'}" alt="Loading...">
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => this.expandBackground(), 100);
    }

    expandBackground() {
        const background = this.shadowRoot.querySelector('.loader-background');
        const container = this.shadowRoot.querySelector('.loader-container');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const finalSize = Math.sqrt(screenWidth ** 2 + screenHeight ** 2) * 2;
        background.style.width = `${finalSize}px`;
        background.style.height = `${finalSize}px`;
    }

    hide() {
        const background = this.shadowRoot.querySelector('.loader-background');
        const content = this.shadowRoot.querySelector('.loader-content');
        background.style.width = '0';
        background.style.height = '0';
        background.style.opacity = '0';
        content.style.opacity = '0';
        setTimeout(() => {
            this.shadowRoot.querySelector('.loader-container').style.display = 'none';
        }, 1500);
    }
}

customElements.define('loading-component', LoadingComponent);