

if (window.innerWidth > 992) {
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

}