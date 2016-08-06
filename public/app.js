var sock;
var others = [];
var my_id;

function setup(){
    createCanvas(windowWidth,windowHeight);
    background(0);

    sock = io();
    sock.connect('http://localhost:5000')

    sock.on('me', function(id){
        my_id = id;
    })

    sock.on('connected_clients', function(clients){
        console.log('other clients',clients);

        clients.forEach(function(client) {
            addOther(client);
        }, this);
    })

    sock.on('mouse', function(other){
        drawOther(other);
    })

    sock.on('presence', function(id){
        addOther(id);
    })

    sock.on('disconnected', function(id){
        removeOther(id);
    })
}

function addOther(id){
    console.log('presence',id)
    var theNewOne = {
        id:id,
        x: -100,
        y: -100,
        color: [floor(random(255)), floor(random(255)), floor(random(255))]
    };

    others.push(theNewOne)

    //create the member's section div
    var container = document.getElementById('members-container');
    var div = document.createElement('div');
    div.id = 'member_widget_'+theNewOne.id;
    div.classList.add('member');
    div.style.background = rgbToHex(theNewOne.color[0], theNewOne.color[1], theNewOne.color[2]);
    container.appendChild(div);
}

function removeOther(id){
    others = others.filter(function(actual){
        return actual.id !== id;
    })

    // remove the member's div
    var other_element = document.getElementById('member_widget_'+id);
    other_element.parentNode.removeChild(other_element);
}

function drawOther(other){
    for(var i = 0; i< others.length; i++){
        if(others[i].id === other.id){
            others[i].x = other.x;
            others[i].y = other.y;

            fill(others[i].color[0], others[i].color[1], others[i].color[2]);
            rect(others[i].x, others[i].y, 10, 10);
        }
    }

    
}

function mouseDragged(){
    fill(255);
    rect(mouseX,mouseY, 10, 10);
    sock.emit('mouse', {
        id: my_id,
        x: mouseX,
        y: mouseY
    })
}

function draw(){
    //background(color(52, 73, 94));
}


function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}