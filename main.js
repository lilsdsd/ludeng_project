//import Vue from "vue";
//import App from "./App.vue";

//Vue.config.productionTip = false;
/*
new Vue({
  render: h => h(App)
}).$mount("#app");

*/

function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

function pageTransition() {
    var tl = gsap.timeline();
    tl.to(".loading-screen", {
        duration: 1.2,
        width: "100%",
        left: "0%",
        ease: "Expo.easeInOut",
    });

    tl.to(".loading-screen", {
        duration: 1,
        width: "100%",
        left: "100%",
        ease: "Expo.easeInOut",
        delay: 0.3,
    });
    tl.set(".loading-screen", { left: "-100%" });
}

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".animate-this", { duration: 1, y: 30, opacity: 0, stagger: 0.4, delay: 0.2 });
}

$(function () {
    barba.init({
        sync: true,

        transitions: [
            {
                async leave(data) {
                    const done = this.async();

                    pageTransition();
                    await delay(1000);
                    done();
                },

                async enter(data) {
                    contentAnimation();
                },

                async once(data) {
                    contentAnimation();
                },
            },
        ],
    });
});

var box = document.querySelector('.start-box'),
            
                info = document.querySelector('.info'),
                // a = box.style.top;
                y = 600;
                gravity = 40;
                up = true;
                gasokdo = 0;
                r = 0;
                o = 100;
                gasok = true;
                document.getElementById("mimi_btn1").addEventListener("click", javascript_onclikc);
                function javascript_onclikc() {
                    setInterval(function () {
           
                        
                        // if (y > 420) { gravity = -gravity; }
                       if (up === true) {
                       
                             y = y - (gravity + gasokdo);
                            r = r - 1;
                            box.style.top = (y) + "px";
                            box.style.transform = "rotate"+ "("+(r) + "deg"+")";
                            gasokdo -= 5;
    
                            if (gasokdo < -100 ){
                            o = o - 5;    
                          
                            box.style.opacity =  (o)  +"%";  
                            if (o < 0) {
                                up = false;
                              //  element.parentNode.removeChild(box);
                            }
                        }
                        
                        }
    
    
                        //if (gravity < -10) { up = false;}
                        /*
                        if (up == false) {
                        gravity += 1;
                        y = y + gravity;
                        box.style.top = (y) + "px";
                        }*/
                    }, 50);
    
                }


                var swiper = new Swiper('.swiper-container', {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 'auto',
                    coverflowEffect: {
                      rotate: 30,
                      stretch: 0,
                      depth: 200,
                      modifier: 1,
                      slideShadows: true,
                    },
                    pagination: {
                      el: '.swiper-pagination',
                    },
                  });