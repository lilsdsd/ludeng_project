

//slider

const tl = gsap.timeline({ defaults: { ease: "power1.out" } });

tl.to('.text', { y: "0%", duration: 1, stagger: 0.25 });

tl.to('.slider', { y: "-100%", duration: 1.5, delay: 0.5 });
tl.to('.intro', { y: "-100%", duration: 1 }, "-=1");
tl.fromTo('nav', { opacity: 0 }, { opacity: 1 }, { duration: 1 });
tl.fromTo('.big-text', { opacity: 0 }, { opacity: 1 }, { duration: 1 }, '-=1');



// WAVE
class APP {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }
}











/*

function scrollDisable() {
    $('html, body').addClass('hidden');
}
function scrollAble() {
    $('html, body').removeClass('hidden');
}

function scrollDisable() {
    $('body').addClass('scrollDisable').on('scroll touchmove mousewheel', function (e) {
        e.preventDefault();
    });
}
function scrollAble() {
    $('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}
*/