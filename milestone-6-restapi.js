//changing background switcher
function changeBackground(id) {
    var btnValue = document.getElementById(id).value;
    var back = document.getElementsByClassName("background")[0];

    if (id === "background1") {
        back.style.backgroundImage = "url(background1.JPG)";
    }
    else if (id === "background2") {
        back.style.backgroundImage = "url(background2.JPG)";
    }
    else {
        back.style.backgroundImage = "url(background3.JPG)";
    }
}

//font resizer
function resizeFont() {
    document.getElementById("title").style.fontSize = "40px";
}

//global variables
var sections = ['blog1', 'blog2', 'blog3', 'blog4'];
var selected = 0;
var timer;

//stop slides for blogs
function stopSlides() {
    clearInterval(timer)
}

//play slides for blogs
function playSlides() {
    //setInterval takes in two parameters, the function and timer
    timer = setInterval(()=> {
        //set current selected blog to show
        //at first, the first paragraph will show and 2 and 3 will be hidden
        document.getElementById(sections[selected]).style.display = "block";
        switch (selected) {
            case 0:
                document.getElementById(sections[1]).style.display = "none";
                document.getElementById(sections[2]).style.display = "none";
                selected = 1
                break;
            case 1:
                document.getElementById(sections[0]).style.display = "none";
                document.getElementById(sections[2]).style.display = "none";
                selected = 2
                break;
            case 2:
                document.getElementById(sections[0]).style.display = "none";
                document.getElementById(sections[1]).style.display = "none";
                selected = 0
                break;
            default:
                break;
        }
    }, 5000); //pause for 5 seconds
}

