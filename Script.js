var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var g = document.getElementById("go");
var r = document.getElementById("rs");
var c = canvas.getContext('2d');
var b = [];
var i = 0;
var flag = 0;
var area = 0;
var s = document.getElementById("sc");
s.innerHTML = null;
var ss = document.getElementById("ss");
ss.innerHTML = null;
var score = 0;
var tt = null;
var colors = ["grey","black","red","green","blue","purple","brown","orange"];
function randomise(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}
var out = 0;
function setout() {
    out = 1;
}
function Bubble(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = randomise(-1, 1);
    this.dy = randomise(-1, 1);
    this.color = colors[randomise(0,7)];
    this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        c.fillStyle = this.color;
        c.fill();
    }
}
var tempa = new Bubble(0, 0, 0);
var tempb = new Bubble(0, 0, 0);
function collision(x1, y1, u1x, u1y, x2, y2, u2x, u2y) {
    tempa.dx = 0;
    tempa.dy = 0;
    tempb.dx = 0;
    tempb.dy = 0;
    var yDist = y2 - y1;
    var xDist = x2 - x1;
    var u1 = Math.sqrt(u1x * u1x + u1y * u1y);
    var u2 = Math.sqrt(u2x * u2x + u2y * u2y);
    if (u1 != 0) {
        var t1 = Math.acos(u1x / u1);
    } else {
        var t1 = 0;
    }
    if (u2 != 0) {
        var t2 = Math.acos(u2x / u2);
    } else {
        var t2 = 0;
    }
    var a = Math.atan(yDist / xDist);

    var v1x = u2 * Math.cos(t2 - a) * Math.cos(a) + u1 * Math.sin(t1 - a) * Math.cos(a + (Math.PI / 2));
    if (Math.abs(v1x) < 0.0000000001) {
        var v1x = 0;
    }
    var v1y = u2 * Math.cos(t2 - a) * Math.sin(a) + u1 * Math.cos(t1 - a) * Math.sin(a + (Math.PI / 2));
    if (Math.abs(v1y) < 0.0000000001) {
        var v1y = 0;
    }
    var v2x = u1 * Math.cos(t1 - a) * Math.cos(a) + u2 * Math.sin(t2 - a) * Math.cos(a + (Math.PI / 2));
    if (Math.abs(v2x) < 0.0000000001) {
        var v2x = 0;
    }
    var v2y = u1 * Math.cos(t1 - a) * Math.sin(a) + u2 * Math.cos(t2 - a) * Math.sin(a + (Math.PI / 2));
    if (Math.abs(v2y) < 0.0000000001) {
        var v2y = 0;
    }
    tempa.dx = v1x; tempa.dy = v1y;  tempb.dx = v2x; tempb.dy = v2y;
}

function distance(a, b, x, y) {
    return (Math.abs(Math.sqrt((x - a) * (x - a) + (y - b) * (y - b))))
}

function generate() {
    let r = randomise(20, 35);
    let x = randomise(r, window.innerWidth - r);
    let y = randomise(r, window.innerHeight - r);
    tt = setInterval(
        function () {
            if (out == 0) {
                if (i != 0) {
                    for (var z = 0; z < i; z++) {
                        if (distance(x, y, b[z].x, b[z].y) < r + b[z].r) {
                            r = randomise(20, 35);
                            x = randomise(r, window.innerWidth - r);
                            y = randomise(r, window.innerHeight - r);
                            z = -1;
                        }
                    }
                }
                b[i] = new Bubble(x, y, r);
                b[i].draw();
                ++i;
            }
        }, 100);
}


generate();

function animate() {
    console.log(i);
    tempa.dx = 0;
    tempa.dy = 0;
    tempb.dx = 0;
    tempb.dy = 0;
    c.clearRect(0, 0, window.innerWidth, window.innerHeight);
    requestAnimationFrame(animate);
    if (out == 0) {
        console.log("in");
        area = 0;
        for (var n = 0; n < b.length; n++) {
            tempa.dx = 0;
            tempa.dy = 0;
            tempb.dx = 0;
            tempb.dy = 0;
            if (b[n].x + b[n].r > window.innerWidth || b[n].x - b[n].r < 0) {
                b[n].dx = -b[n].dx;
            }
            if (b[n].y + b[n].r > window.innerHeight || b[n].y - b[n].r < 0) {
                b[n].dy = -b[n].dy;

            }
            for (var m = 0; m < b.length; m++) {
                tempa.dx = 0;
                tempa.dy = 0;
                tempb.dx = 0;
                tempb.dy = 0;
                if (n != m) {
                    if (distance(b[n].x, b[n].y, b[m].x, b[m].y) <= b[n].r + b[m].r) {
                        collision(b[n].x, b[n].y, b[n].dx, b[n].dy, b[m].x, b[m].y, b[m].dx, b[m].dy);
                        b[n].dx = tempa.dx;  b[n].dy = tempa.dy; b[m].dx = tempb.dx; b[m].dy = tempb.dy;
                    }
                }
            }

            b[n].x += b[n].dx;
            b[n].y += b[n].dy;
            b[n].draw();
            tempa.dx = 0;  tempa.dy = 0;  tempb.dx = 0;  tempb.dy = 0;
            area += Math.PI * b[n].r * b[n].r;
        }
        window.onclick = function () {
            var x = event.clientX;
            var y = event.clientY;

            for (var j = 0; j < b.length; j++) {
                if (x < b[j].x + b[j].r && x > b[j].x - b[j].r && y < b[j].y + b[j].r && y > b[j].y - b[j].r) {
                    score++;
                    b[j].r = 0;
                    b[j].x = 0;
                    b[j].y = 0;
                    b[j].dx = 0;
                    b[j].dy = 0;
                }
            }
        }
        if (area > 0.75 * window.innerHeight * window.innerWidth) {
            setTimeout(setout, 10000);
            console.log("out");
            flag = 1;
        } else if (flag == 1) {
            out = 0
            clearTimeout(setout());
            flag = 0;
        }
    }
    if (out == 1) {
        clearInterval(tt);
        console.log("game over");
        g.innerHTML = "GAME OVER";
        r.innerHTML = "RESET";
        ss.innerHTML = "SCORE:"
        s.innerHTML = score;
        r.onclick = function () {
            console.log('clicked');

            i = 0;
            b.length = 0;
            g.innerHTML = null;
            r.innerHTML = null;
            ss.innerHTML = null;
            s.innerHTML = null;
            out = 0;
            flag = 0;
            generate();
        }
    }

}
animate();