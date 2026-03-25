import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

/* ─────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');

  .kk-auth *, .kk-auth *::before, .kk-auth *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .kk-auth { font-family: 'DM Sans', sans-serif; }

  .kk-page {
    min-height: calc(100vh - 80px);
    background: transparent;
    display: flex; align-items: center; justify-content: center;
    padding: 20px; position: relative; overflow: visible;
  }
  .kk-page::before { display: none; }

  .kk-card {
    display: flex; width: min(940px, 100%); min-height: 580px;
    border-radius: 20px; overflow: hidden;
    position: relative; z-index: 1;
    border: 1px solid rgba(249,115,22,0.25);
    box-shadow: 0 20px 60px rgba(249,115,22,0.15), 0 4px 20px rgba(0,0,0,0.08);
    animation: kk-rise .7s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes kk-rise {
    from { opacity:0; transform: translateY(36px) scale(.96); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }

  /* LEFT */
  .kk-left {
    width: 420px; flex-shrink: 0; background: #fff;
    padding: 24px 36px 20px;
    display: flex; flex-direction: column;
    border-right: 1px solid rgba(249,115,22,0.15);
  }

  .kk-logo {
    font-family: 'Playfair Display', serif;
    font-size: 18px; letter-spacing: 1.5px; margin-bottom: 10px; line-height: 1;
  }
  .kk-logo-sub {
    font-size: 9px; font-family: 'DM Sans', sans-serif;
    letter-spacing: 3.5px; text-transform: uppercase;
    display: block; margin-top: 4px; color: rgba(184,100,0,0.5);
  }

  .kk-type-toggle {
    display: flex; background: #fff7ed;
    border: 1px solid rgba(249,115,22,0.2);
    border-radius: 50px; padding: 3px; margin-bottom: 8px; gap: 3px;
  }
  .kk-type-btn {
    flex: 1; padding: 6px 0; border: none; border-radius: 50px;
    font-size: 11px; font-weight: 500; cursor: pointer;
    transition: all .3s; background: transparent; color: #9a7050;
    font-family: 'DM Sans', sans-serif; letter-spacing: .5px;
  }
  .kk-type-btn.active-cust { background: linear-gradient(135deg,#f97316,#b86000); color:#fff; }
  .kk-type-btn.active-vend { background: linear-gradient(135deg,#f59e0b,#d97706); color:#fff; }

  /* ── EXACT ORIGINAL YETI CONTAINER STYLES ── */
  .svgContainer {
    position: relative; width: 150px; height: 150px;
    margin: 0 auto 6px; border-radius: 50%; pointer-events: none;
  }
  .svgContainer > div {
    position: relative; width: 100%; height: 0;
    overflow: hidden; border-radius: 50%; padding-bottom: 100%;
  }
  .svgContainer .mySVG {
    position: absolute; left: 0; top: 0;
    width: 100%; height: 100%; pointer-events: none;
  }
  .svgContainer::after {
    content: ''; position: absolute; top: 0; left: 0; z-index: 10;
    width: 100%; height: 100%; box-sizing: border-box;
    border: solid 2.5px #f97316; border-radius: 50%;
  }

  .kk-tabs {
    display: flex; border-bottom: 1px solid rgba(249,115,22,0.15); margin-bottom: 8px;
  }
  .kk-tab {
    flex: 1; padding: 6px 0; border: none; background: transparent;
    font-size: 11px; font-weight: 500; cursor: pointer; color: #c4a882;
    font-family: 'DM Sans', sans-serif;
    border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: all .25s; letter-spacing: .3px;
  }
  .kk-tab.ac { color: #f97316; border-bottom-color: #f97316; }
  .kk-tab.av { color: #d97706; border-bottom-color: #d97706; }

  .kk-panels-outer { flex: 1; overflow: hidden; position: relative; }
  .kk-panels {
    display: flex; width: 200%; height: 100%;
    transition: transform .55s cubic-bezier(.77,0,.18,1);
  }
  .kk-panels.show-signup { transform: translateX(-50%); }
  .kk-panel { width: 50%; display: flex; flex-direction: column; gap: 7px; padding-right: 2px; }

  .kk-lbl {
    font-size: 9px; color: #b86000; letter-spacing: .6px;
    margin-bottom: 2px; text-transform: uppercase;
  }

  .kk-inp {
    width: 100%; padding: 8px 12px;
    border: 1px solid rgba(249,115,22,0.3); border-radius: 7px;
    font-size: 12px; font-family: 'DM Sans', sans-serif;
    color: #4a3520; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
    background: #fff7ed; display: block;
  }
  .kk-inp::placeholder { color: #c4a882; }
  .kk-inp:focus { background: #fff; }
  .kk-inp.cust:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
  .kk-inp.vend:focus { border-color: #d97706; box-shadow: 0 0 0 3px rgba(217,119,6,0.1); }

  /* eye button inside password field */
  .kk-pw-wrap { position: relative; }
  .kk-eye-btn {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; padding: 2px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(184,100,0,0.4); transition: color .2s; line-height: 1;
  }
  .kk-eye-btn:hover { color: rgba(184,100,0,0.85); }
  .kk-pw-wrap .kk-inp { padding-right: 34px; }

  .kk-submit {
    width: 100%; padding: 9px; border: none; border-radius: 8px;
    font-size: 12px; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; letter-spacing: .5px;
    transition: all .2s; position: relative; overflow: hidden; color: #fff;
  }
  .kk-submit::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,0.15); transform: translateX(-100%);
    transition: transform .35s ease;
  }
  .kk-submit:hover::after { transform: translateX(0); }
  .kk-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.35); }
  .kk-submit:active { transform: translateY(0); }
  .kk-submit.cust { background: linear-gradient(135deg,#f97316,#b86000); }
  .kk-submit.vend { background: linear-gradient(135deg,#f59e0b,#d97706); }

  /* RIGHT */
  .kk-right {
    flex: 1; background: linear-gradient(135deg, #fff7ed, #fef3c7);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; min-height: 580px;
  }
  .kk-centre { position: relative; z-index: 10; text-align: center; padding: 20px; }
  .kk-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 2.1rem; color: #b86000; line-height: 1.15; letter-spacing: 1px;
  }
  .kk-brand-tagline {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: 1rem; color: rgba(184,100,0,0.6); margin-top: 6px; letter-spacing: 1px;
  }
  .kk-divider { display: flex; align-items: center; gap: 8px; margin: 10px auto; width: 180px; }
  .kk-divider-line { flex: 1; height: 1px; background: rgba(249,115,22,0.3); }
  .kk-divider-gem { color: #f97316; font-size: 12px; }
  .kk-glow {
    position: absolute; width: 260px; height: 260px; border-radius: 50%;
    background: radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    pointer-events: none; z-index: 5;
  }
  @keyframes kk-spin-slow { to { transform: translate(-50%,-50%) rotate(360deg); } }
  .kk-ring {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%); border-radius: 50%;
    border: 1px solid rgba(249,115,22,0.12); pointer-events: none;
  }
  .kk-ring1 { width: 230px; height: 230px; animation: kk-spin-slow 30s linear infinite; }
  .kk-ring2 { width: 310px; height: 310px; animation: kk-spin-slow 45s linear infinite reverse; }
  .kk-ring3 { width: 400px; height: 400px; animation: kk-spin-slow 60s linear infinite; border-style: dashed; }
`

/* ─────────────────────────────────────────────────────
   EXACT DARIN SENNEFF YETI JS — adapted for React
   Source: gist.github.com/mattdavenport (exact copy)
   Key values: coverEyes x:-93 y:10, uncoverEyes y:220 rotation:±105
   Face tracking uses caretCoords to follow email cursor
───────────────────────────────────────────────────── */
const YETI_JS = `
(function() {
  function boot() {
    if (!window.TweenMax) { setTimeout(boot, 60); return; }

    var emailInput       = document.getElementById('kkEmail'),
        passwordInput    = document.getElementById('kkPassword'),
        showPwCheck      = document.getElementById('kkShowPw'),
        showPwToggle     = document.getElementById('kkShowPwLabel'),
        twoFingers       = document.querySelector('.twoFingers'),
        armL             = document.querySelector('.armL'),
        armR             = document.querySelector('.armR'),
        eyeL             = document.querySelector('.eyeL'),
        eyeR             = document.querySelector('.eyeR'),
        nose             = document.querySelector('.nose'),
        mouth            = document.querySelector('.mouth'),
        mouthBG          = document.querySelector('.mouthBG'),
        mouthSmallBG     = document.querySelector('.mouthSmallBG'),
        mouthMediumBG    = document.querySelector('.mouthMediumBG'),
        mouthLargeBG     = document.querySelector('.mouthLargeBG'),
        mouthMaskPath    = document.querySelector('#mouthMaskPath'),
        mouthOutline     = document.querySelector('.mouthOutline'),
        tooth            = document.querySelector('.tooth'),
        tongue           = document.querySelector('.tongue'),
        chin             = document.querySelector('.chin'),
        face             = document.querySelector('.face'),
        eyebrow          = document.querySelector('.eyebrow'),
        outerEarL        = document.querySelector('.earL .outerEar'),
        outerEarR        = document.querySelector('.earR .outerEar'),
        earHairL         = document.querySelector('.earL .earHair'),
        earHairR         = document.querySelector('.earR .earHair'),
        hair             = document.querySelector('.hair'),
        bodyBG           = document.querySelector('.bodyBGnormal'),
        bodyBGchanged    = document.querySelector('.bodyBGchanged'),
        svgContainer     = document.querySelector('.svgContainer');

    if (!emailInput || !armL) { setTimeout(boot, 150); return; }

    var activeElement, curEmailIndex, screenCenter, svgCoords, emailCoords,
        emailScrollMax, chinMin = 0.5, dFromC,
        mouthStatus = 'small', blinking, eyeScale = 1,
        eyesCovered = false, showPasswordClicked = false;
    var eyeLCoords, eyeRCoords, noseCoords, mouthCoords;
    var eyeLAngle, eyeLX, eyeLY, eyeRAngle, eyeRX, eyeRY;
    var noseAngle, noseX, noseY, mouthAngle, mouthX, mouthY, mouthR;
    var chinX, chinY, chinS, faceX, faceY, faceSkew, eyebrowSkew;
    var outerEarX, outerEarY, hairX, hairS;

    function getPosition(el) {
      var xPos = 0, yPos = 0;
      while (el) {
        if (el.tagName === 'BODY') {
          var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
          var yScroll = el.scrollTop  || document.documentElement.scrollTop;
          xPos += (el.offsetLeft - xScroll + el.clientLeft);
          yPos += (el.offsetTop  - yScroll + el.clientTop);
        } else {
          xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
          yPos += (el.offsetTop  - el.scrollTop  + el.clientTop);
        }
        el = el.offsetParent;
      }
      return { x: xPos, y: yPos };
    }

    function getAngle(x1, y1, x2, y2) {
      return Math.atan2(y1 - y2, x1 - x2);
    }

    function initCoords() {
      svgCoords    = getPosition(svgContainer);
      emailCoords  = getPosition(emailInput);
      screenCenter = svgCoords.x + svgContainer.offsetWidth / 2;
      emailScrollMax = emailInput.offsetWidth;

      eyeLCoords  = { x: svgCoords.x + 85,  y: svgCoords.y + 78 };
      eyeRCoords  = { x: svgCoords.x + 115, y: svgCoords.y + 78 };
      noseCoords  = { x: svgCoords.x + 100, y: svgCoords.y + 80 };
      mouthCoords = { x: svgCoords.x + 100, y: svgCoords.y + 100 };
    }

    function calculateFaceMove() {
      var carPos = emailInput.selectionEnd;
      if (carPos == null || carPos === 0) carPos = emailInput.value.length;

      var div  = document.createElement('div');
      var span = document.createElement('span');
      var copyStyle = getComputedStyle(emailInput);
      [].forEach.call(copyStyle, function(prop) { div.style[prop] = copyStyle[prop]; });
      div.style.position = 'absolute';
      div.style.visibility = 'hidden';
      document.body.appendChild(div);
      div.textContent = emailInput.value.substr(0, carPos);
      span.textContent = emailInput.value.substr(carPos) || '.';
      div.appendChild(span);

      var caretCoords = getPosition(span);

      if (emailInput.scrollWidth <= emailScrollMax) {
        dFromC      = screenCenter - (caretCoords.x + emailCoords.x);
        eyeLAngle   = getAngle(eyeLCoords.x,  eyeLCoords.y,  emailCoords.x + caretCoords.x, emailCoords.y + 25);
        eyeRAngle   = getAngle(eyeRCoords.x,  eyeRCoords.y,  emailCoords.x + caretCoords.x, emailCoords.y + 25);
        noseAngle   = getAngle(noseCoords.x,  noseCoords.y,  emailCoords.x + caretCoords.x, emailCoords.y + 25);
        mouthAngle  = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + caretCoords.x, emailCoords.y + 25);
      } else {
        eyeLAngle   = getAngle(eyeLCoords.x,  eyeLCoords.y,  emailCoords.x + emailScrollMax, emailCoords.y + 25);
        eyeRAngle   = getAngle(eyeRCoords.x,  eyeRCoords.y,  emailCoords.x + emailScrollMax, emailCoords.y + 25);
        noseAngle   = getAngle(noseCoords.x,  noseCoords.y,  emailCoords.x + emailScrollMax, emailCoords.y + 25);
        mouthAngle  = getAngle(mouthCoords.x, mouthCoords.y, emailCoords.x + emailScrollMax, emailCoords.y + 25);
      }

      eyeLX = Math.cos(eyeLAngle) * 20;  eyeLY = Math.sin(eyeLAngle) * 10;
      eyeRX = Math.cos(eyeRAngle) * 20;  eyeRY = Math.sin(eyeRAngle) * 10;
      noseX = Math.cos(noseAngle) * 23;  noseY = Math.sin(noseAngle) * 10;
      mouthX = Math.cos(mouthAngle) * 23; mouthY = Math.sin(mouthAngle) * 10;
      mouthR = Math.cos(mouthAngle) * 6;
      chinX  = mouthX * 0.8; chinY = mouthY * 0.5;
      chinS  = 1 - ((dFromC * 0.15) / 100);
      if (chinS > 1) { chinS = 1 - (chinS - 1); if (chinS < chinMin) chinS = chinMin; }
      faceX  = mouthX * 0.3;   faceY  = mouthY * 0.4;
      faceSkew    = Math.cos(mouthAngle) * 5;
      eyebrowSkew = Math.cos(mouthAngle) * 25;
      outerEarX   = Math.cos(mouthAngle) * 4;
      outerEarY   = Math.cos(mouthAngle) * 5;
      hairX = Math.cos(mouthAngle) * 6; hairS = 1.2;

      TweenMax.to(eyeL,     1, { x: -eyeLX,  y: -eyeLY,  ease: Expo.easeOut });
      TweenMax.to(eyeR,     1, { x: -eyeRX,  y: -eyeRY,  ease: Expo.easeOut });
      TweenMax.to(nose,     1, { x: -noseX,  y: -noseY,  rotation: mouthR, transformOrigin: 'center center', ease: Expo.easeOut });
      TweenMax.to(mouth,    1, { x: -mouthX, y: -mouthY, rotation: mouthR, transformOrigin: 'center center', ease: Expo.easeOut });
      TweenMax.to(chin,     1, { x: -chinX,  y: -chinY,  scaleY: chinS, ease: Expo.easeOut });
      TweenMax.to(face,     1, { x: -faceX,  y: -faceY,  skewX: -faceSkew,    transformOrigin: 'center top', ease: Expo.easeOut });
      TweenMax.to(eyebrow,  1, { x: -faceX,  y: -faceY,  skewX: -eyebrowSkew, transformOrigin: 'center top', ease: Expo.easeOut });
      TweenMax.to(outerEarL,1, { x:  outerEarX, y: -outerEarY, ease: Expo.easeOut });
      TweenMax.to(outerEarR,1, { x:  outerEarX, y:  outerEarY, ease: Expo.easeOut });
      TweenMax.to(earHairL, 1, { x: -outerEarX, y: -outerEarY, ease: Expo.easeOut });
      TweenMax.to(earHairR, 1, { x: -outerEarX, y:  outerEarY, ease: Expo.easeOut });
      TweenMax.to(hair,     1, { x: hairX, scaleY: hairS, transformOrigin: 'center bottom', ease: Expo.easeOut });

      document.body.removeChild(div);
    }

    function onEmailInput() {
      calculateFaceMove();
      var value = emailInput.value;
      if (value.length > 0) {
        if (mouthStatus === 'small') {
          mouthStatus = 'medium';
          TweenMax.to([eyeL, eyeR], 1, { scaleX: .85, scaleY: .85, ease: Expo.easeOut });
          eyeScale = .85;
        }
        if (value.includes('@')) {
          mouthStatus = 'large';
          TweenMax.to([eyeL, eyeR], 1, { scaleX: .65, scaleY: .65, ease: Expo.easeOut, transformOrigin: 'center center' });
          eyeScale = .65;
        } else {
          mouthStatus = 'medium';
          TweenMax.to([eyeL, eyeR], 1, { scaleX: .85, scaleY: .85, ease: Expo.easeOut });
          eyeScale = .85;
        }
      } else {
        mouthStatus = 'small';
        TweenMax.to([eyeL, eyeR], 1, { scaleX: 1, scaleY: 1, ease: Expo.easeOut });
        eyeScale = 1;
      }
    }

    function onEmailFocus() {
      activeElement = 'email';
      initCoords();
      onEmailInput();
    }

    function onEmailBlur() {
      activeElement = null;
      setTimeout(function() {
        if (activeElement === 'email') return;
        resetFace();
      }, 100);
    }

    function onPasswordFocus() {
      activeElement = 'password';
      if (!eyesCovered) coverEyes();
    }

    function onPasswordBlur() {
      activeElement = null;
      setTimeout(function() {
        if (activeElement === 'toggle' || activeElement === 'password') return;
        uncoverEyes();
      }, 100);
    }

    function onToggleFocus() {
      activeElement = 'toggle';
      if (!eyesCovered) coverEyes();
    }

    function onToggleBlur() {
      activeElement = null;
      if (!showPasswordClicked) {
        setTimeout(function() {
          if (activeElement === 'password' || activeElement === 'toggle') return;
          uncoverEyes();
        }, 100);
      }
    }

    function onToggleMouseDown() { showPasswordClicked = true; }
    function onToggleMouseUp()   { showPasswordClicked = false; }

    function onToggleChange() {
      setTimeout(function() {
        if (showPwCheck.checked) {
          spreadFingers();
        } else {
          closeFingers();
        }
      }, 100);
    }

    function spreadFingers() {
      TweenMax.to(twoFingers, .35, { transformOrigin: 'bottom left', rotation: 30, x: -9, y: -2, ease: Power2.easeInOut });
    }
    function closeFingers() {
      TweenMax.to(twoFingers, .35, { transformOrigin: 'bottom left', rotation: 0, x: 0, y: 0, ease: Power2.easeInOut });
    }

    function coverEyes() {
      TweenMax.killTweensOf([armL, armR]);
      TweenMax.set([armL, armR], { visibility: 'visible' });
      TweenMax.to(armL, .45, { x: -93, y: 10, rotation: 0, ease: Quad.easeOut });
      TweenMax.to(armR, .45, { x: -93, y: 10, rotation: 0, ease: Quad.easeOut, delay: .1 });
      eyesCovered = true;
    }

    function uncoverEyes() {
      TweenMax.killTweensOf([armL, armR]);
      TweenMax.to(armL, 1.35, { y: 220, ease: Quad.easeOut });
      TweenMax.to(armL, 1.35, { rotation: -105, ease: Quad.easeOut, delay: .1 });
      TweenMax.to(armR, 1.35, { y: 220, ease: Quad.easeOut });
      TweenMax.to(armR, 1.35, { rotation:  105, ease: Quad.easeOut, delay: .1,
        onComplete: function() { TweenMax.set([armL, armR], { visibility: 'hidden' }); }
      });
      eyesCovered = false;
    }

    function resetFace() {
      TweenMax.to([eyeL, eyeR], 1, { x: 0, y: 0, ease: Expo.easeOut });
      TweenMax.to(nose,   1, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Expo.easeOut });
      TweenMax.to(mouth,  1, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
      TweenMax.to(chin,   1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
      TweenMax.to([face, eyebrow], 1, { x: 0, y: 0, skewX: 0, ease: Expo.easeOut });
      TweenMax.to([outerEarL, outerEarR, earHairL, earHairR, hair], 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
    }

    function startBlinking(delay) {
      var d = delay ? Math.floor(Math.random() * delay) : 1;
      blinking = TweenMax.to([eyeL, eyeR], .1, {
        delay: d, scaleY: 0, yoyo: true, repeat: 1,
        transformOrigin: 'center center',
        onComplete: function() { startBlinking(12); }
      });
    }

    /* mouse cursor tracking — runs when no input is active */
    function onMouseMove(e) {
      if (activeElement || eyesCovered) return;
      initCoords();
      var mouseX = e.clientX + window.scrollX;
      var mouseY = e.clientY + window.scrollY;

      eyeLAngle  = getAngle(eyeLCoords.x,  eyeLCoords.y,  mouseX, mouseY);
      eyeRAngle  = getAngle(eyeRCoords.x,  eyeRCoords.y,  mouseX, mouseY);
      noseAngle  = getAngle(noseCoords.x,  noseCoords.y,  mouseX, mouseY);
      mouthAngle = getAngle(mouthCoords.x, mouthCoords.y, mouseX, mouseY);

      dFromC = screenCenter - mouseX;

      eyeLX = Math.cos(eyeLAngle) * 20;  eyeLY = Math.sin(eyeLAngle) * 10;
      eyeRX = Math.cos(eyeRAngle) * 20;  eyeRY = Math.sin(eyeRAngle) * 10;
      noseX = Math.cos(noseAngle) * 23;  noseY = Math.sin(noseAngle) * 10;
      mouthX = Math.cos(mouthAngle) * 23; mouthY = Math.sin(mouthAngle) * 10;
      mouthR = Math.cos(mouthAngle) * 6;
      chinX = mouthX * 0.8; chinY = mouthY * 0.5;
      chinS = 1 - ((dFromC * 0.15) / 100);
      if (chinS > 1) { chinS = 1 - (chinS - 1); if (chinS < chinMin) chinS = chinMin; }
      faceX = mouthX * 0.3; faceY = mouthY * 0.4;
      faceSkew    = Math.cos(mouthAngle) * 5;
      eyebrowSkew = Math.cos(mouthAngle) * 25;
      outerEarX   = Math.cos(mouthAngle) * 4;
      outerEarY   = Math.cos(mouthAngle) * 5;
      hairX = Math.cos(mouthAngle) * 6; hairS = 1.2;

      TweenMax.to(eyeL,      .5, { x: -eyeLX,  y: -eyeLY,  ease: Expo.easeOut });
      TweenMax.to(eyeR,      .5, { x: -eyeRX,  y: -eyeRY,  ease: Expo.easeOut });
      TweenMax.to(nose,      .5, { x: -noseX,  y: -noseY,  rotation: mouthR, transformOrigin: 'center center', ease: Expo.easeOut });
      TweenMax.to(mouth,     .5, { x: -mouthX, y: -mouthY, rotation: mouthR, transformOrigin: 'center center', ease: Expo.easeOut });
      TweenMax.to(chin,      .5, { x: -chinX,  y: -chinY,  scaleY: chinS, ease: Expo.easeOut });
      TweenMax.to(face,      .5, { x: -faceX,  y: -faceY,  skewX: -faceSkew,    transformOrigin: 'center top', ease: Expo.easeOut });
      TweenMax.to(eyebrow,   .5, { x: -faceX,  y: -faceY,  skewX: -eyebrowSkew, transformOrigin: 'center top', ease: Expo.easeOut });
      TweenMax.to(outerEarL, .5, { x:  outerEarX, y: -outerEarY, ease: Expo.easeOut });
      TweenMax.to(outerEarR, .5, { x:  outerEarX, y:  outerEarY, ease: Expo.easeOut });
      TweenMax.to(earHairL,  .5, { x: -outerEarX, y: -outerEarY, ease: Expo.easeOut });
      TweenMax.to(earHairR,  .5, { x: -outerEarX, y:  outerEarY, ease: Expo.easeOut });
      TweenMax.to(hair,      .5, { x: hairX, scaleY: hairS, transformOrigin: 'center bottom', ease: Expo.easeOut });
    }
    document.addEventListener('mousemove', onMouseMove);

    /* bind events */
    emailInput.addEventListener('focus',  onEmailFocus);
    emailInput.addEventListener('blur',   onEmailBlur);
    emailInput.addEventListener('input',  onEmailInput);
    emailInput.addEventListener('click',  calculateFaceMove);
    emailInput.addEventListener('keyup',  calculateFaceMove);

    passwordInput.addEventListener('focus', onPasswordFocus);
    passwordInput.addEventListener('blur',  onPasswordBlur);

    /* eye button: spread fingers when pw is revealed, close when hidden
       We watch the kkPassword input's type attribute via a MutationObserver */
    var pwInput = document.getElementById('kkPassword');
    if (pwInput) {
      var pwObserver = new MutationObserver(function() {});
      /* simpler: watch clicks on eye buttons */
    }
    /* listen for eye btn clicks to trigger finger spread */
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.kk-eye-btn');
      if (!btn) return;
      /* check resulting input type after React re-renders (~50ms) */
      setTimeout(function() {
        var inp = btn.parentElement ? btn.parentElement.querySelector('input[type]') : null;
        if (!inp) return;
        if (inp.type === 'text') { spreadFingers(); }
        else { closeFingers(); }
      }, 60);
    });

    /* set initial arm positions off-screen */
    TweenMax.set(armL, { x: 0, y: 0, rotation: 0, visibility: 'hidden' });
    TweenMax.set(armR, { x: 0, y: 0, rotation: 0, visibility: 'hidden' });

    /* start blinking */
    startBlinking(12);

    window.addEventListener('resize', initCoords);
    initCoords();
  }

  boot();
})();
`

/* ─────────────────────────────────────────────────────
   RIGHT PANEL — INDIAN SCULPTURE SCENE
───────────────────────────────────────────────────── */
const IndiaScene = () => (
  <div className="kk-right">
    <div className="kk-glow"/>
    <div className="kk-ring kk-ring1"/>
    <div className="kk-ring kk-ring2"/>
    <div className="kk-ring kk-ring3"/>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:2}}
      viewBox="0 0 480 590" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.22" transform="translate(160,20)">
        <ellipse cx="80" cy="58" rx="28" ry="32" fill="none" stroke="#d4a855" strokeWidth="1.2"/>
        <path d="M52 58 L52 100 L108 100 L108 58" fill="none" stroke="#d4a855" strokeWidth="1"/>
        <line x1="80" y1="26" x2="80" y2="20" stroke="#d4a855" strokeWidth="1"/>
        <circle cx="80" cy="20" r="2.5" fill="#d4a855"/>
        <path d="M60 100 Q65 80 70 100" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <path d="M90 100 Q95 80 100 100" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <rect x="20" y="50" width="10" height="50" rx="3" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <ellipse cx="25" cy="50" rx="5" ry="8" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <rect x="130" y="50" width="10" height="50" rx="3" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <ellipse cx="135" cy="50" rx="5" ry="8" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <rect x="10" y="100" width="140" height="8" rx="2" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
      </g>
      <g opacity="0.25" transform="translate(18,80)">
        <ellipse cx="30" cy="50" rx="14" ry="10" fill="none" stroke="#4a9e6a" strokeWidth="1"/>
        <path d="M30 40 Q32 28 35 22" stroke="#4a9e6a" strokeWidth="1.5" fill="none"/>
        <circle cx="35" cy="20" r="5" fill="none" stroke="#4a9e6a" strokeWidth="1"/>
        <circle cx="35" cy="10" r="2" fill="#4a9e6a"/>
        {[-30,-18,-6,6,18,30].map((a,i)=>(
          <g key={i} transform={`rotate(${a} 30 50)`}>
            <line x1="30" y1="50" x2="30" y2="12" stroke="#4a9e6a" strokeWidth="0.8"/>
            <ellipse cx="30" cy="10" rx="4" ry="6" fill="none" stroke="#4a9e6a" strokeWidth="0.7"/>
            <circle cx="30" cy="10" r="1.5" fill="#4a9e6a" opacity="0.6"/>
          </g>
        ))}
      </g>
      <g opacity="0.18" transform="translate(8,180)">
        <path d="M0 0 Q20 30 10 80 Q0 130 20 180" stroke="#c8782a" strokeWidth="1.5" fill="none"/>
        <path d="M12 0 Q32 30 22 80 Q12 130 32 180" stroke="#c8782a" strokeWidth="1" fill="none"/>
        {[0,20,40,60,80,100,120,140,160].map((y,i)=>(<circle key={i} cx="6" cy={y+10} r="2" fill="#c8782a" opacity="0.5"/>))}
      </g>
      <g opacity="0.22" transform="translate(20,450)">
        {[0,45,90,135,180,225,270,315].map((a,i)=>(
          <g key={i} transform={`rotate(${a} 40 40)`}><path d="M40 40 Q50 20 40 5 Q30 20 40 40" fill="none" stroke="#c8782a" strokeWidth="0.9"/></g>
        ))}
        <circle cx="40" cy="40" r="8" fill="none" stroke="#c8782a" strokeWidth="1"/>
        <circle cx="40" cy="40" r="3" fill="#c8782a" opacity="0.5"/>
      </g>
      <g opacity="0.20" transform="translate(360,150)">
        <circle cx="40" cy="50" r="48" fill="none" stroke="#d4a855" strokeWidth="0.8" strokeDasharray="3,3"/>
        <ellipse cx="40" cy="55" rx="9" ry="14" fill="none" stroke="#d4a855" strokeWidth="1.2"/>
        <circle cx="40" cy="37" r="7" fill="none" stroke="#d4a855" strokeWidth="1"/>
        <path d="M33 32 L37 22 L40 30 L43 22 L47 32" stroke="#d4a855" strokeWidth="0.8" fill="none"/>
        <path d="M31 48 Q18 36 12 28" stroke="#d4a855" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M49 48 Q62 36 68 28" stroke="#d4a855" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M31 52 Q16 55 10 62" stroke="#d4a855" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M49 52 Q64 55 70 62" stroke="#d4a855" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M40 68 Q36 80 30 90" stroke="#d4a855" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M40 68 Q50 82 55 95" stroke="#d4a855" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i)=>(
          <path key={i} d={`M ${40+48*Math.cos(a*Math.PI/180)} ${50+48*Math.sin(a*Math.PI/180)} Q ${40+56*Math.cos((a+8)*Math.PI/180)} ${50+56*Math.sin((a+8)*Math.PI/180)} ${40+52*Math.cos((a+15)*Math.PI/180)} ${50+52*Math.sin((a+15)*Math.PI/180)}`} stroke="#d4a855" strokeWidth="0.6" fill="none"/>
        ))}
      </g>
      <g opacity="0.20" transform="translate(340,420)">
        <ellipse cx="50" cy="45" rx="38" ry="28" fill="none" stroke="#8888b0" strokeWidth="1.2"/>
        <circle cx="20" cy="32" r="18" fill="none" stroke="#8888b0" strokeWidth="1.1"/>
        <path d="M10 42 Q2 56 8 70 Q14 82 6 90" stroke="#8888b0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M8 44 Q0 50 4 60" stroke="#d4d4c8" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M30 18 Q48 12 50 32 Q48 46 30 46" stroke="#8888b0" strokeWidth="0.9" fill="none"/>
        <line x1="28" y1="70" x2="28" y2="90" stroke="#8888b0" strokeWidth="4" strokeLinecap="round"/>
        <line x1="44" y1="72" x2="44" y2="92" stroke="#8888b0" strokeWidth="4" strokeLinecap="round"/>
        <line x1="62" y1="72" x2="62" y2="92" stroke="#8888b0" strokeWidth="4" strokeLinecap="round"/>
        <line x1="76" y1="70" x2="76" y2="90" stroke="#8888b0" strokeWidth="4" strokeLinecap="round"/>
        <rect x="28" y="18" width="50" height="14" rx="3" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
      </g>
      <g opacity="0.10" transform="translate(240,295)">
        {[60,90,120].map((r,i)=>(<circle key={i} cx="0" cy="0" r={r} fill="none" stroke="#d4a855" strokeWidth="0.7"/>))}
        {[0,22.5,45,67.5,90,112.5,135,157.5,180,202.5,225,247.5,270,292.5,315,337.5].map((a,i)=>(
          <line key={i} x1={0} y1={0} x2={120*Math.cos(a*Math.PI/180)} y2={120*Math.sin(a*Math.PI/180)} stroke="#d4a855" strokeWidth="0.4"/>
        ))}
      </g>
      <g opacity="0.18" transform="translate(360,30)">
        <ellipse cx="25" cy="70" rx="18" ry="22" fill="none" stroke="#c8782a" strokeWidth="1"/>
        <ellipse cx="25" cy="30" rx="8" ry="10" fill="none" stroke="#c8782a" strokeWidth="0.8"/>
        <line x1="25" y1="20" x2="25" y2="48" stroke="#c8782a" strokeWidth="2"/>
        {[-3,-1,1,3].map((x,i)=>(<line key={i} x1={25+x} y1="22" x2={25+x} y2="88" stroke="#c8782a" strokeWidth="0.5" opacity="0.7"/>))}
      </g>
      <g opacity="0.16" transform="translate(0,330)">
        <rect x="8" y="20" width="24" height="140" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        <path d="M2 20 Q20 8 38 20" fill="none" stroke="#d4a855" strokeWidth="1"/>
        <rect x="2" y="158" width="36" height="10" rx="2" fill="none" stroke="#d4a855" strokeWidth="0.8"/>
        {[40,80,120].map((y,i)=>(<rect key={i} x="8" y={y} width="24" height="6" rx="1" fill="none" stroke="#d4a855" strokeWidth="0.5"/>))}
      </g>
      {[[70,130,0.14],[400,200,0.12],[60,380,0.13],[420,380,0.11],[200,50,0.10],[300,520,0.12]].map(([x,y,op],i)=>(
        <g key={i} opacity={op} transform={`translate(${x},${y})`}>
          <path d="M0 0 C-8 -20 8 -35 16 -20 C24 -5 10 12 0 0 Z" fill="none" stroke="#c8782a" strokeWidth="0.9"/>
          <circle cx="4" cy="-12" r="3" fill="none" stroke="#c8782a" strokeWidth="0.7"/>
        </g>
      ))}
      <g opacity="0.22" transform="translate(110,500)">
        <path d="M20 25 Q17 15 20 5 Q23 15 20 25" fill="#d4a855" opacity="0.6"/>
        <line x1="20" y1="25" x2="20" y2="30" stroke="#888" strokeWidth="1"/>
        <path d="M5 30 Q8 48 20 50 Q32 48 35 30 Z" fill="none" stroke="#c8782a" strokeWidth="1"/>
        <path d="M5 30 Q20 26 35 30" fill="none" stroke="#c8782a" strokeWidth="1.2"/>
        <path d="M32 40 Q42 38 44 32" stroke="#c8782a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      </g>
      <g opacity="0.13" transform="translate(170,460)">
        {[0,60,120,180,240,300].map((a,i)=>(
          <g key={i} transform={`rotate(${a} 40 40)`}>
            <line x1="40" y1="40" x2="40" y2="10" stroke="#c8782a" strokeWidth="0.7"/>
            <circle cx="40" cy="10" r="3" fill="none" stroke="#c8782a" strokeWidth="0.7"/>
          </g>
        ))}
        <circle cx="40" cy="40" r="6" fill="none" stroke="#c8782a" strokeWidth="0.8"/>
        <circle cx="40" cy="40" r="2" fill="#c8782a" opacity="0.5"/>
      </g>
    </svg>
    <div className="kk-centre">
      <div className="kk-divider"><div className="kk-divider-line"/><span className="kk-divider-gem">✦</span><div className="kk-divider-line"/></div>
      <div className="kk-brand-name">Kalakriti</div>
      <div className="kk-brand-tagline">Handcrafted with Love</div>
      <div className="kk-divider" style={{marginTop:10}}><div className="kk-divider-line"/><span className="kk-divider-gem">✦</span><div className="kk-divider-line"/></div>
    </div>
  </div>
)

/* ─────────────────────────────────────────────────────
   MAIN AUTH COMPONENT
───────────────────────────────────────────────────── */
const Auth = () => {
  const { token, setToken, setRole, role, navigate, backendUrl } = useContext(ShopContext)
  const location = useLocation()

  const [userType,     setUserType]     = useState('customer')
  const [tab,          setTab]          = useState('login')
  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showLoginPw,  setShowLoginPw]  = useState(false)
  const [showSignupPw, setShowSignupPw] = useState(false)

  const gsapReady = useRef(false)
  const accent = userType === 'customer' ? 'cust' : 'vend'
  const ic = `kk-inp ${accent}`

  /* Load TweenMax (GSAP v1 — same version original uses) then boot yeti */
  useEffect(() => {
    if (gsapReady.current) return
    gsapReady.current = true

    const load = (src, cb) => {
      const s = document.createElement('script')
      s.src = src; s.onload = cb
      document.head.appendChild(s)
    }

    const runYeti = () => {
      const s = document.createElement('script')
      s.textContent = YETI_JS
      document.body.appendChild(s)
    }

    if (window.TweenMax) { runYeti(); return; }
    load('https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.4/TweenMax.min.js', runYeti)
  }, [])

  const switchType = (type) => {
    setUserType(type); setTab('login')
    setName(''); setEmail(''); setPassword('')
    setShowLoginPw(false); setShowSignupPw(false)
  }
  const switchTab = (t) => {
    setTab(t); setName(''); setPassword('')
    setShowLoginPw(false); setShowSignupPw(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tab === 'signup') {
        if (userType === 'vendor') { navigate('/vendor'); return }
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
        if (data.success) {
          setToken(data.token); setRole('customer')
          toast.success('Customer account created!')
        } else toast.error(data.message)
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
        if (!data.success) return toast.error(data.message)
        if (userType === 'vendor' && data.role !== 'vendor' && data.role !== 'admin')
          return toast.error('Not a vendor account')
        if (userType === 'customer' && data.role === 'vendor')
          return toast.error('Please use vendor login')
        setToken(data.token); setRole(data.role)
        if      (data.role === 'vendor') navigate('/vendor-dashboard')
        else if (data.role === 'admin')  navigate('/admin')
        else toast.success('Welcome back!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  useEffect(() => {
    if (!token) return
    if      (role === 'admin')  navigate('/admin')
    else if (role === 'vendor') navigate('/vendor-dashboard')
    else {
      const from = location.state?.from || '/'
      navigate(from)
    }
  }, [token, role, navigate])

  return (
    <div className="kk-auth">
      <style>{STYLES}</style>
      <div className="kk-page">
        <div className="kk-card">

          {/* ════ LEFT ════ */}
          <div className="kk-left">

            <div className="kk-logo" style={{ color: userType==='customer'?'#f97316':'#d97706' }}>
              Kalakriti
              <span className="kk-logo-sub">Handcrafted India</span>
            </div>

            <div className="kk-type-toggle">
              <button className={`kk-type-btn ${userType==='customer'?'active-cust':''}`} onClick={()=>switchType('customer')}>Customer</button>
              <button className={`kk-type-btn ${userType==='vendor'?'active-vend':''}`}   onClick={()=>switchType('vendor')}>Vendor</button>
            </div>

            {/* ── EXACT ORIGINAL YETI SVG ── */}
            <div className="svgContainer">
              <div>
                <svg className="mySVG" xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200">
                  <defs><circle id="armMaskPath" cx="100" cy="100" r="100"/></defs>
                  <clipPath id="armMask"><use xlinkHref="#armMaskPath" overflow="visible"/></clipPath>
                  <circle cx="100" cy="100" r="100" fill="#fde68a"/>
                  <g className="body">
                    <path className="bodyBGchanged" style={{display:'none'}} fill="#fff7ed" d="M200,122h-35h-14.9V72c0-27.6-22.4-50-50-50s-50,22.4-50,50v50H35.8H0l0,91h200L200,122z"/>
                    <path className="bodyBGnormal" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#fff7ed" d="M200,158.5c0-20.2-14.8-36.5-35-36.5h-14.9V72.8c0-27.4-21.7-50.4-49.1-50.8c-28-0.5-50.9,22.1-50.9,50v50 H35.8C16,122,0,138,0,157.8L0,213h200L200,158.5z"/>
                    <path fill="#fef3c7" d="M100,156.4c-22.9,0-43,11.1-54.1,27.7c15.6,10,34.2,15.9,54.1,15.9s38.5-5.8,54.1-15.9 C143,167.5,122.9,156.4,100,156.4z"/>
                  </g>
                  <g className="earL">
                    <g className="outerEar" fill="#fef3c7" stroke="#b86000" strokeWidth="2.5">
                      <circle cx="47" cy="83" r="11.5"/>
                      <path d="M46.3 78.9c-2.3 0-4.1 1.9-4.1 4.1 0 2.3 1.9 4.1 4.1 4.1" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <g className="earHair">
                      <rect x="51" y="64" fill="#fff7ed" width="15" height="35"/>
                      <path d="M53.4 62.8C48.5 67.4 45 72.2 42.8 77c3.4-.1 6.8-.1 10.1.1-4 3.7-6.8 7.6-8.2 11.6 2.1 0 4.2 0 6.3.2-2.6 4.1-3.8 8.3-3.7 12.5 1.2-.7 3.4-1.4 5.2-1.9" fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  </g>
                  <g className="earR">
                    <g className="outerEar">
                      <circle fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" cx="153" cy="83" r="11.5"/>
                      <path fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M153.7,78.9 c2.3,0,4.1,1.9,4.1,4.1c0,2.3-1.9,4.1-4.1,4.1"/>
                    </g>
                    <g className="earHair">
                      <rect x="134" y="64" fill="#fff7ed" width="15" height="35"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M146.6,62.8 c4.9,4.6,8.4,9.4,10.6,14.2c-3.4-0.1-6.8-0.1-10.1,0.1c4,3.7,6.8,7.6,8.2,11.6c-2.1,0-4.2,0-6.3,0.2c2.6,4.1,3.8,8.3,3.7,12.5 c-1.2-0.7-3.4-1.4-5.2-1.9"/>
                    </g>
                  </g>
                  <path className="chin" d="M84.1 121.6c2.7 2.9 6.1 5.4 9.8 7.5l.9-4.5c2.9 2.5 6.3 4.8 10.2 6.5 0-1.9-.1-3.9-.2-5.8 3 1.2 6.2 2 9.7 2.5-.3-2.1-.7-4.1-1.2-6.1" fill="none" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path className="face" fill="#fef3c7" d="M134.5,46v35.5c0,21.815-15.446,39.5-34.5,39.5s-34.5-17.685-34.5-39.5V46"/>
                  <path className="hair" fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M81.457,27.929 c1.755-4.084,5.51-8.262,11.253-11.77c0.979,2.565,1.883,5.14,2.712,7.723c3.162-4.265,8.626-8.27,16.272-11.235 c-0.737,3.293-1.588,6.573-2.554,9.837c4.857-2.116,11.049-3.64,18.428-4.156c-2.403,3.23-5.021,6.391-7.852,9.474"/>
                  <g className="eyebrow">
                    <path fill="#fff7ed" d="M138.142,55.064c-4.93,1.259-9.874,2.118-14.787,2.599c-0.336,3.341-0.776,6.689-1.322,10.037 c-4.569-1.465-8.909-3.222-12.996-5.226c-0.98,3.075-2.07,6.137-3.267,9.179c-5.514-3.067-10.559-6.545-15.097-10.329 c-1.806,2.889-3.745,5.73-5.816,8.515c-7.916-4.124-15.053-9.114-21.296-14.738l1.107-11.768h73.475V55.064z"/>
                    <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M63.56,55.102 c6.243,5.624,13.38,10.614,21.296,14.738c2.071-2.785,4.01-5.626,5.816-8.515c4.537,3.785,9.583,7.263,15.097,10.329 c1.197-3.043,2.287-6.104,3.267-9.179c4.087,2.004,8.427,3.761,12.996,5.226c0.545-3.348,0.986-6.696,1.322-10.037 c4.913-0.481,9.857-1.34,14.787-2.599"/>
                  </g>
                  <g className="eyeL">
                    <circle cx="85.5" cy="78.5" r="3.5" fill="#b86000"/>
                    <circle cx="84" cy="76" r="1" fill="#fff7ed"/>
                  </g>
                  <g className="eyeR">
                    <circle cx="114.5" cy="78.5" r="3.5" fill="#b86000"/>
                    <circle cx="113" cy="76" r="1" fill="#fff7ed"/>
                  </g>
                  <g className="mouth">
                    <path className="mouthBG" fill="#f97316" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
                    <path style={{display:'none'}} className="mouthSmallBG" fill="#f97316" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
                    <path style={{display:'none'}} className="mouthMediumBG" d="M95,104.2c-4.5,0-8.2-3.7-8.2-8.2v-2c0-1.2,1-2.2,2.2-2.2h22c1.2,0,2.2,1,2.2,2.2v2 c0,4.5-3.7,8.2-8.2,8.2H95z"/>
                    <path style={{display:'none'}} className="mouthLargeBG" d="M100 110.2c-9 0-16.2-7.3-16.2-16.2 0-2.3 1.9-4.2 4.2-4.2h24c2.3 0 4.2 1.9 4.2 4.2 0 9-7.2 16.2-16.2 16.2z" fill="#f97316" stroke="#b86000" strokeLinejoin="round" strokeWidth="2.5"/>
                    <defs>
                      <path id="mouthMaskPath" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
                    </defs>
                    <clipPath id="mouthMask"><use xlinkHref="#mouthMaskPath" overflow="visible"/></clipPath>
                    <g clipPath="url(#mouthMask)">
                      <g className="tongue">
                        <circle cx="100" cy="107" r="8" fill="#e05c00"/>
                        <ellipse className="tongueHighlight" cx="100" cy="100.5" rx="3" ry="1.5" opacity=".1" fill="#fff7ed"/>
                      </g>
                    </g>
                    <path clipPath="url(#mouthMask)" className="tooth" style={{fill:'#FFFFFF'}} d="M106,97h-4c-1.1,0-2-0.9-2-2v-2h8v2C108,96.1,107.1,97,106,97z"/>
                    <path className="mouthOutline" fill="none" stroke="#b86000" strokeWidth="2.5" strokeLinejoin="round" d="M100.2,101c-0.4,0-1.4,0-1.8,0c-2.7-0.3-5.3-1.1-8-2.5c-0.7-0.3-0.9-1.2-0.6-1.8 c0.2-0.5,0.7-0.7,1.2-0.7c0.2,0,0.5,0.1,0.6,0.2c3,1.5,5.8,2.3,8.6,2.3s5.7-0.7,8.6-2.3c0.2-0.1,0.4-0.2,0.6-0.2 c0.5,0,1,0.3,1.2,0.7c0.4,0.7,0.1,1.5-0.6,1.9c-2.6,1.4-5.3,2.2-7.9,2.5C101.7,101,100.5,101,100.2,101z"/>
                  </g>
                  <path className="nose" d="M97.7 79.9h4.7c1.9 0 3 2.2 1.9 3.7l-2.3 3.3c-.9 1.3-2.9 1.3-3.8 0l-2.3-3.3c-1.3-1.6-.2-3.7 1.8-3.7z" fill="#b86000"/>
                  <g className="arms" clipPath="url(#armMask)">
                    <g className="armL" style={{visibility:'hidden'}}>
                      <polygon fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" points="121.3,98.4 111,59.7 149.8,49.3 169.8,85.4"/>
                      <path fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M134.4,53.5l19.3-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-10.3,2.8"/>
                      <path fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M150.9,59.4l26-7c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-21.3,5.7"/>
                      <g className="twoFingers">
                        <path fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M158.3,67.8l23.1-6.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-23.1,6.2"/>
                        <path fill="#fde68a" d="M180.1,65l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L180.1,65z"/>
                        <path fill="#fef3c7" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M160.8,77.5l19.4-5.2c2.7-0.7,5.4,0.9,6.1,3.5v0c0.7,2.7-0.9,5.4-3.5,6.1l-18.3,4.9"/>
                        <path fill="#fde68a" d="M178.8,75.7l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L178.8,75.7z"/>
                      </g>
                      <path fill="#fde68a" d="M175.5,55.9l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L175.5,55.9z"/>
                      <path fill="#fde68a" d="M152.1,50.4l2.2-0.6c1.1-0.3,2.2,0.3,2.4,1.4v0c0.3,1.1-0.3,2.2-1.4,2.4l-2.2,0.6L152.1,50.4z"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M123.5,97.8 c-41.4,14.9-84.1,30.7-108.2,35.5L1.2,81c33.5-9.9,71.9-16.5,111.9-21.8"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M108.5,60.4 c7.7-5.3,14.3-8.4,22.8-13.2c-2.4,5.3-4.7,10.3-6.7,15.1c4.3,0.3,8.4,0.7,12.3,1.3c-4.2,5-8.1,9.6-11.5,13.9 c3.1,1.1,6,2.4,8.7,3.8c-1.4,2.9-2.7,5.8-3.9,8.5c2.5,3.5,4.6,7.2,6.3,11c-4.9-0.8-9-0.7-16.2-2.7"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M94.5,103.8 c-0.6,4-3.8,8.9-9.4,14.7c-2.6-1.8-5-3.7-7.2-5.7c-2.5,4.1-6.6,8.8-12.2,14c-1.9-2.2-3.4-4.5-4.5-6.9c-4.4,3.3-9.5,6.9-15.4,10.8 c-0.2-3.4,0.1-7.1,1.1-10.9"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M97.5,63.9 c-1.7-2.4-5.9-4.1-12.4-5.2c-0.9,2.2-1.8,4.3-2.5,6.5c-3.8-1.8-9.4-3.1-17-3.8c0.5,2.3,1.2,4.5,1.9,6.8c-5-0.6-11.2-0.9-18.4-1 c2,2.9,0.9,3.5,3.9,6.2"/>
                    </g>
                    <g className="armR" style={{visibility:'hidden'}}>
                      <path fill="#fef3c7" stroke="#b86000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M265.4 97.3l10.4-38.6-38.9-10.5-20 36.1z"/>
                      <path fill="#fef3c7" stroke="#b86000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.5" d="M252.4 52.4L233 47.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l10.3 2.8M226 76.4l-19.4-5.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l18.3 4.9M228.4 66.7l-23.1-6.2c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l23.1 6.2M235.8 58.3l-26-7c-2.7-.7-5.4.9-6.1 3.5-.7 2.7.9 5.4 3.5 6.1l21.3 5.7"/>
                      <path fill="#fde68a" d="M207.9 74.7l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM206.7 64l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM211.2 54.8l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8zM234.6 49.4l-2.2-.6c-1.1-.3-2.2.3-2.4 1.4-.3 1.1.3 2.2 1.4 2.4l2.2.6 1-3.8z"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M263.3 96.7c41.4 14.9 84.1 30.7 108.2 35.5l14-52.3C352 70 313.6 63.5 273.6 58.1"/>
                      <path fill="#fff7ed" stroke="#b86000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M278.2 59.3l-18.6-10 2.5 11.9-10.7 6.5 9.9 8.7-13.9 6.4 9.1 5.9-13.2 9.2 23.1-.9M284.5 100.1c-.4 4 1.8 8.9 6.7 14.8 3.5-1.8 6.7-3.6 9.7-5.5 1.8 4.2 5.1 8.9 10.1 14.1 2.7-2.1 5.1-4.4 7.1-6.8 4.1 3.4 9 7 14.7 11 1.2-3.4 1.8-7 1.7-10.9M314 66.7s5.4-5.7 12.6-7.4c1.7 2.9 3.3 5.7 4.9 8.6 3.8-2.5 9.8-4.4 18.2-5.7.1 3.1.1 6.1 0 9.2 5.5-1 12.5-1.6 20.8-1.9-1.4 3.9-2.5 8.4-2.5 8.4"/>
                    </g>
                  </g>
                </svg>
              </div>
            </div>
            {/* ── END YETI ── */}

            <div className="kk-tabs">
              <button className={`kk-tab ${tab==='login'?(accent==='cust'?'ac':'av'):''}`}  onClick={()=>switchTab('login')}>Login</button>
              {userType==='customer' && <button className={`kk-tab ${tab==='signup'?'ac':''}`} onClick={()=>switchTab('signup')}>Sign Up</button>}
            </div>

            <div className="kk-panels-outer">
              <div className={`kk-panels ${tab==='signup'?'show-signup':''}`}>

                {/* LOGIN PANEL */}
                <div className="kk-panel">
                  <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:7}}>
                    <div>
                      <div className="kk-lbl">Email</div>
                      {/* id="kkEmail" is what the GSAP script targets */}
                      <input id="kkEmail" className={ic} type="email" placeholder="you@example.com"
                        value={email} onChange={e=>setEmail(e.target.value)} required/>
                    </div>
                    <div className="kk-pw-wrap">
                      <div className="kk-lbl">Password</div>
                      <input id="kkPassword" className={ic}
                        type={showLoginPw?'text':'password'}
                        placeholder="••••••••"
                        value={password} onChange={e=>setPassword(e.target.value)} required/>
                      <button type="button" id="kkShowPwLabel" className="kk-eye-btn"
                        id="kkShowPwLabel"
                        onMouseDown={e=>e.preventDefault()}
                        onClick={()=>setShowLoginPw(v=>!v)}>
                        {showLoginPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        }
                      </button>
                    </div>
                    <button type="submit" className={`kk-submit ${accent}`}>
                      {userType==='vendor'?'Sign In as Vendor':'Sign In'}
                    </button>
                  </form>
                </div>

                {/* SIGNUP PANEL */}
                <div className="kk-panel">
                  <form onSubmit={onSubmit} style={{display:'flex',flexDirection:'column',gap:7}}>
                    <div>
                      <div className="kk-lbl">{userType==='vendor'?'Business Name':'Full Name'}</div>
                      <input className={ic} type="text"
                        placeholder={userType==='vendor'?'Business name':'Full name'}
                        value={name} onChange={e=>setName(e.target.value)} required/>
                    </div>
                    <div>
                      <div className="kk-lbl">Email</div>
                      <input id="kkEmailSignup" className={ic} type="email" placeholder="you@example.com"
                        value={email} onChange={e=>setEmail(e.target.value)} required/>
                    </div>
                    <div className="kk-pw-wrap">
                      <div className="kk-lbl">Password</div>
                      <input className={ic}
                        type={showSignupPw?'text':'password'}
                        placeholder="••••••••"
                        value={password} onChange={e=>setPassword(e.target.value)}
                        onFocus={()=>{
                          if(window.TweenMax){
                            var aL=document.querySelector('.armL'),aR=document.querySelector('.armR');
                            if(aL&&aR){
                              window.TweenMax.killTweensOf([aL,aR]);
                              window.TweenMax.set([aL,aR],{visibility:'visible'});
                              window.TweenMax.to(aL,.45,{x:-93,y:10,rotation:0,ease:window.Quad&&window.Quad.easeOut});
                              window.TweenMax.to(aR,.45,{x:-93,y:10,rotation:0,ease:window.Quad&&window.Quad.easeOut,delay:.1});
                            }
                          }
                        }}
                        onBlur={()=>{
                          setShowSignupPw(false);
                          if(window.TweenMax){
                            var aL=document.querySelector('.armL'),aR=document.querySelector('.armR');
                            if(aL&&aR){
                              window.TweenMax.killTweensOf([aL,aR]);
                              window.TweenMax.to(aL,1.35,{y:220,ease:window.Quad&&window.Quad.easeOut});
                              window.TweenMax.to(aL,1.35,{rotation:105,ease:window.Quad&&window.Quad.easeOut,delay:.1});
                              window.TweenMax.to(aR,1.35,{y:220,ease:window.Quad&&window.Quad.easeOut});
                              window.TweenMax.to(aR,1.35,{rotation:-105,ease:window.Quad&&window.Quad.easeOut,delay:.1,onComplete:function(){window.TweenMax.set([aL,aR],{visibility:'hidden'});}});
                            }
                          }
                        }}
                        required/>
                      <button type="button" className="kk-eye-btn"
                        onMouseDown={e=>e.preventDefault()}
                        onClick={()=>setShowSignupPw(v=>!v)}>
                        {showSignupPw
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        }
                      </button>
                    </div>
                    <button type="submit" className={`kk-submit ${accent}`}>
                      {userType==='vendor'?'Apply as Vendor →':'Create Account'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <IndiaScene/>

        </div>
      </div>
    </div>
  )
}

export default Auth