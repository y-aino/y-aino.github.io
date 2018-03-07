class ShapeOverlays {
  constructor(elm) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 85;
    this.duration = 500;
    this.delayPointsArray = [];
    this.delayPointsMax = 300;
    this.delayPerPath = 150;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.elm.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.elm.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] = (1 - ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1))) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 H ${points[0]}` : `M ${points[0]} 0`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${points[i]} ${cp} ${points[i + 1]} ${cp} ${points[i + 1]} ${p} `;
    }
    str += (this.isOpened) ? `H 100 V 0` : `H 0 V 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
    }
  }
}

(function() {
  const elmHamburger = document.querySelector('.hamburger');
  const gNavItems = document.querySelectorAll('.global-menu__item');
  const elmOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elmOverlay);

  elmHamburger.addEventListener('click', () => {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();

    //ハンバーガーメニューの処理
    if (overlay.isOpened === true) {
      // 閉じるとき
      elmHamburger.classList.add('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.add('is-opened');
      }
    } else {
      // 開くとき
      elmHamburger.classList.remove('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.remove('is-opened');
      }
    }
  });

  // Nav Event Listener
  const mainBoxes = document.querySelectorAll('.main-box');
  const homeBG = document.querySelector('.home-bg');

  for(let val of gNavItems){
    val.addEventListener('click', (e) => {
      event.preventDefault();
      // メニュー処理
      elmHamburger.click();

      // アクティブなコンテンツのみ表示
      for(let mainBox of mainBoxes){
        let boxItems = mainBox.querySelectorAll(':scope > *'); // :scope 親要素の疑似セレクタ
        // クリックされたリンクの判別
        if ([...mainBox.classList].includes(e.target.dataset.link)) {
          if(e.target.dataset.link === 'home'){
            homeBG.classList.remove('is-hidden');
          }else{
            homeBG.classList.add('is-hidden');
          }
          // parent
          mainBox.classList.add('active');
          mainBox.parentNode.style.minHeight = `${mainBox.scrollHeight}px`; // min-height
          // children
          for(let item of boxItems){
            item.classList.add('is-opened');
          }
        } else {
          // parent
          mainBox.classList.remove('active');
          // children
          for(let item of boxItems){
            item.classList.remove('is-opened');
          }
        }
      }
    });
  }
}());

window.onload = () => {
  const homeMainBox = document.querySelector('.main-box.home')
  const boxItems = homeMainBox.querySelectorAll(':scope > *');

  homeMainBox.classList.add('active');
  for(let item of boxItems){
    item.classList.add('is-opened');
  }
}
