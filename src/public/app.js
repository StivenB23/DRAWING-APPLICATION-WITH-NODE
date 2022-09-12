// page load
function init(){
    
    // object actions what can to do the user
    let mouse = {
        click: false,
        move: false,
        position: {
            x: 0,
            y: 0
        },
        positionPreview: false
    };

    // Canvas
    const canvas = document.getElementById('drawing');
    const context = canvas.getContext('2d')
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const socket =  io();

    canvas.addEventListener('mousedown', (event)=>{
       mouse.click = true; 
    //    console.log(mouse)
    });
    canvas.addEventListener('mouseup', (event)=>{
        mouse.click = false; 
        // console.log(mouse)
    });

    canvas.addEventListener('mousemove', (event)=>{
       mouse.position.x = event.clientX / width;
       mouse.position.y = event.clientY / height;
        mouse.move = true;
        console.log(mouse); 
     });

     socket.on('draw_line', data =>{
       const line = data.line;
       context.beginPath();
        context.lineWidth = 2;
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
       context.stroke();
     })

     function mainLoop(){
         if(mouse.click && mouse.move && mouse.positionPreview ){
            socket.emit('draw_line',{line:[mouse.position, mouse.positionPreview]});
            mouse.move = false;
         }
         mouse.positionPreview = {x: mouse.position.x, y:mouse.position.y}
         setTimeout(mainLoop, 25);
     }
     mainLoop();

}
document.addEventListener('DOMContentLoaded',  init());