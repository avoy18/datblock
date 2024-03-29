

/****************************
* * Fullpage settings
* * *************************/

var myFullpage;


myFullpage = new fullpage('#fullpage', {
    //Navigation
    menu: '#menu',
    lockAnchors: true,
    anchors: ['intro', 'features', 'gamemodes', 'resources'],
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: ['Intro', 'Features', 'Game Modes', 'Resources'],

    //Custom selectors
    sectionSelector: '.slide-section',
    slideSelector: '.slide',
    // normalScrollElements:'.slide-section',

});






/****************************
* * Particles
* * *************************/

function initParticles() {
    setTimeout(
        function () {
            console.log('started');
            moveParticles();
        }, 30000
    )
}



let dbParticles = document.querySelector('.particle-overlay'),
    spaceToAdd = 1000,
    particleStartPoint = spaceToAdd; // 2000


function moveParticles() {
    initParticles();
    dbParticles.style = "background-position:" + particleStartPoint + "px center;background-size:auto 110%;opacity:0.25;transition: background 30s linear;";
    particleStartPoint += spaceToAdd;
}

function resetParticles() {
    particleStartPoint = spaceToAdd;
    dbParticles.style = "background-position:0px center;background-size:auto 110%;opacity:0.25;transition: background 0s linear;";
    moveParticles();
}

moveParticles();



/****************************
* * Photoswipe Lightbox settings
* * *************************/

var initPhotoSwipeFromDOM = function (gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if (figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML;
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }

        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if (!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
            hideAnimationDuration: 100

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return;
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector);

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');



/****************************
* * Game Modes Slider
* * *************************/

const gmNavitems = document.querySelectorAll('.gm-navitem'),
    gmTextDiv = document.querySelector('.gamemodes-text'),
    gmTitle = document.querySelector('.gamemodes-text .gm-maintitle'),
    gmParagraph = document.querySelector('.gamemodes-text .gm-mainparagraph')
let inTransition = false;




for (let i = 0; i < gmNavitems.length; i++) {
    gmNavitems[i].addEventListener('click', function (e) {
        e.preventDefault();
        const navItem = this,
            bgtrigger = navItem.dataset.bgtrigger,
            activeEl = document.querySelector('[data-background="' + bgtrigger + '"]');
        if (!inTransition) {
            inTransition = true;
            console.log(inTransition)
            gamemovedNav(navItem)
            gamemodesBG(activeEl)
            gamemodesText(navItem)
        } else {
            console.log('clicked too fast boii')
        }

        setTimeout(function () { inTransition = false; }, 600)
    })
}



function gamemovedNav(navItem) {
    // old element
    const previousActive = document.querySelector('.gm-navitem.active');
    previousActive.classList.remove('active');
    // new element
    navItem.classList.add('active')
}

function gamemodesBG(activeBG) {
    // old
    const oldCurrent = document.querySelector('.gamemodes-background.current'),
        oldPrevious = document.querySelector('.gamemodes-background.previous'),
        sameSlide = oldCurrent == activeBG
    if (!sameSlide) {
        if (oldPrevious) {
            oldPrevious.classList.remove('previous');
        }

        // new
        oldCurrent.classList.add('previous')
        setTimeout(function () {
            oldCurrent.classList.remove('current')
            activeBG.classList.add('current')
        }, 300)

    }

}

function gamemodesText(navItem) {
    const currentTitle = navItem.querySelector('.gm-title'),
        currentParagraph = navItem.dataset.text;
    sameSlide = currentTitle.textContent == gmTitle.textContent
    //   gmTitle
    //   gmParagraph
    if (!sameSlide) {
        gmTextDiv.classList.add('hiddentext')
        setTimeout(function () {
            gmTitle.textContent = currentTitle.textContent;
            gmParagraph.textContent = currentParagraph;
            gmTextDiv.classList.remove('hiddentext')
        }, 600)

    }


}