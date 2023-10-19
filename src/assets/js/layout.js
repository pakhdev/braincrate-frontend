let lastScrollPos = 0;
let panelState = false;

if (window.innerHeight + window.scrollY > document.getElementById('panel__sticky-container').clientHeight) {
    const panelCopyright = document.getElementById('panel__copyright');
    panelCopyright.style.position = 'sticky';
    panelCopyright.style.bottom = '35px';
}

if (window.innerHeight + window.scrollY > document.getElementById('notes-container').clientHeight) {
    document.getElementById('panel__sticky-container').style.minHeight = 'calc(100vh - 160px)';
}

const handlePanelClasses = () => {

    const viewPortHeight = window.innerHeight + window.scrollY - window.scrollY;
    const panelTopMarginDiv = document.getElementById('panel__top-margin');
    const stickyPanelDiv = document.getElementById('panel__sticky-container');

    const direction = scrollDirection();

    // Если контента меньше панели - НИЧЕГО НЕ ДЕЛАТЬ
    const panelHeight = document.getElementById('panel__sticky-container').clientHeight;
    const contentHeight = document.getElementById('notes-container').clientHeight;
    if (panelHeight > contentHeight) return;

    // Если вьюпорт больше высоты панели - стики топ и убрать маржин (как то клеить копирайт к низу?)
    if (viewPortHeight > document.getElementById('panel__sticky-container').clientHeight) {
        document.getElementById('panel__sticky-container').className = 'panel-top-sticky';
        document.getElementById('panel__top-margin').removeAttribute('style');
        const panelCopyright = document.getElementById('panel__copyright');
        panelCopyright.style.position = 'sticky';
        panelCopyright.style.bottom = '35px';
        return;
    } else {
        document.getElementById('panel-expander').removeAttribute('style');
        document.getElementById('panel__copyright').removeAttribute('style');
    }

    if (direction === 'down') {
        const copyrightOnScreen = document.getElementById('panel__copyright').getBoundingClientRect().top;
        if (panelState !== 'bottom' && copyrightOnScreen <= viewPortHeight) {
            stickyPanelDiv.className = 'panel-bottom-sticky';
            panelTopMarginDiv.className = 'flex-it'
            panelState = 'bottom';
            return;
        } else if (panelState === 'bottom') return;
    } else if (direction === 'up') {
        const panelOnScreen = stickyPanelDiv.getBoundingClientRect().top;
        if (panelState !== 'up' && panelOnScreen >= 0) {
            stickyPanelDiv.className = 'panel-top-sticky';
            panelTopMarginDiv.removeAttribute('style');
            panelState = 'up';
            return;
        } else if (panelState === 'up') return;
    }

    if (panelState !== 'margin') {
        const extraOffset = stickyPanelDiv.offsetTop - panelTopMarginDiv.offsetTop;
        if (extraOffset > 0) {
            panelTopMarginDiv.style.height=`${extraOffset}px`;
            panelTopMarginDiv.removeAttribute('class');
            stickyPanelDiv.removeAttribute('class');
            panelState = 'margin';
        }
    }
};

const openMobilePanel = () => {
    document.body.style.overflow = 'hidden';
    document.querySelector('.content__mobile-header').style.visibility = 'hidden';
    document.querySelector('.mobile-panel-fixer-container').style.display = 'flex';
    document.querySelector('#panel__copyright').style = '';
};

const closeMobilePanel = () => {
    document.body.removeAttribute('style');
    document.querySelector('.content__mobile-header').removeAttribute('style');
    document.querySelector('.mobile-panel-fixer-container').removeAttribute('style');
};

const scrollDirection = () => {
    const direction =
        lastScrollPos === undefined || lastScrollPos === 0 || lastScrollPos < window.scrollY
            ? 'down' : 'up';
    lastScrollPos = window.scrollY;
    return direction;
};

handlePanelClasses();
window.addEventListener('scroll', handlePanelClasses);