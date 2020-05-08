

// if (window.innerWidth > 992) {}
var myFullpage = new fullpage('#fullpage', {
    //Navigation
    menu: '#menu',
    lockAnchors: true,
    anchors: ['intro', 'features', 'gamemodes', 'resources'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Intro', 'Features', 'Game Modes', 'Resources'],

    //Scrolling

    fixedElements: '#header, .footer',
    responsiveWidth: 1,
    responsiveHeight: 1,
    responsiveSlides: true,

    //Custom selectors
    sectionSelector: '.slide-section',
    slideSelector: '.slide',

    lazyLoading: true,

    //events
    onLeave: function (origin, destination, direction) { },
    afterLoad: function (origin, destination, direction) { },
    afterRender: function () { },
    afterResize: function (width, height) { },
    afterReBuild: function () { },
    afterResponsive: function (isResponsive) { },
    afterSlideLoad: function (section, origin, destination, direction) { },
    onSlideLeave: function (section, origin, destination, direction) { }
});


// * Particles


var dbParticles = document.querySelector('.particle-overlay'),
    particleStartPoint = 2000;

function initParticles(){
    setTimeout(
        function(){
            console.log('started');
            moveParticles();
        }, 60000
    )
}

function moveParticles(){
    initParticles();
    dbParticles.style = "background-position:"+particleStartPoint+"px center;background-size:auto 110%:";
    particleStartPoint  += particleStartPoint;
}

moveParticles()