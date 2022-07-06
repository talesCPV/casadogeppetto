/* HASH */

String.prototype.getHash = function(S){
    let weigth = 0
    let hash = ''
    let str = this.valueOf()

    function getRange(N){ // keeps caracters under ASCII 33 & 126
        while (N > 126 || N < 33){
            N -= 126
            N < 33 ? N += 33 : N
            N == 127 ? N++ : 0
        }
        return N
    }

    for (i = 0; i < str.length; i++) {
        weigth += str.charCodeAt(i) * 5
    }

    while(str.length < S){
        str += String.fromCharCode(str.length + 33)
    }

    for (i = 0; i < str.length; i++) {
        chr = getRange(weigth * str.charCodeAt(i))
        hash += String.fromCharCode(chr)  
    }

    return hash;
}

/* VARIABLES */

var screen = document.querySelector("#form-for-frames");
var modal = document.getElementById("myModal");
var modal_title = document.getElementById("modal-title");
var modal_text = document.querySelector(".modal-text");
var modal_data = document.querySelector(".modal-data");
var btnClose = document.querySelector(".close");

//menu_login()

document.querySelector('.close').addEventListener('click',()=>{
    modal.style.display = "none";
})

menu_item = document.querySelectorAll('.menu-item');
for(let i=0; i< menu_item.length; i++){
    menu_item[i].addEventListener('click',()=>{
        let frame = menu_item[i].innerHTML.toLowerCase().trim()
        closeMenu()
        loadContent(frame)
    })
}

loadContent("brinquedos")

function closeMenu(){
    document.querySelector('#side-menu').checked =  false;
    

}

function loadContent(cat){
    localStorage.setItem("frame",cat);

    const params = new Object;        
        params.category = cat;
        params.access = localStorage.getItem('access');

    const myPromisse = queryDB(params,2)

    myPromisse.then((resolve)=>{
       
        if(resolve.trim() != ""){
            const json = JSON.parse(resolve);
            frames = document.querySelector('#form-for-frames')
            frames.innerHTML = `<h1>${cat}</h1>`
            for(let i=0; i<json.length; i++){
                newFrame = createFrame(json[i])
                frames.appendChild(newFrame.html)
                eval(newFrame.script)
            }   
        }              

    });

}

function createFrame(frm){
    
    function btn_edit(){

        const btn = document.createElement('div')
        btn.classList = 'edit circle'
        btn.innerHTML = 'E'
        btn.addEventListener('click',()=>{
            console.log(frm)
            open = openHTML('edit_frame.html','pop-up','Edição',frm) 
        })
        btn.data = frm


        return btn

    }

    out = new Object
    out.script = ''

    rgb = frm.background.split(',')

    out.html = document.createElement('div')
    out.html.classList = 'frame'

    if(frm.content == 'plus'){
        out.html.innerHTML = '<div id="btnPlus" class="circle">+</div>'
        
        out.script += `
        document.querySelector('#btnPlus').addEventListener('click',()=>{
            openHTML('new_frame.html','pop-up','Novo Quadro')
        })`            

    }else if(frm.content == 'txt'){
        out.html.innerHTML = frm.text
        out.html.style =  `text-align : ${frm.justify}; font-size: ${frm.font}px ;`
    }else if(frm.content == 'pic'){
        out.html.innerHTML = `<img src="files/pictures/${frm.filename}" alt="">`
    }

    out.html.style.background = frm.background;

    if(localStorage.getItem('access') == 10 && frm.content != 'plus'){
        out.html.appendChild(btn_edit())
    }

    return out

}

async function openHTML(template,where="screen",label="", data=""){
    if(template.trim() != ""){
        return await new Promise((resolve,reject) =>{
            fetch( "templates/"+template)
            .then( stream => stream.text())
            .then( text => {
                const temp = document.createElement('div');
                temp.innerHTML = text;
                const body = temp.getElementsByTagName('template')[0];
                const script = temp.getElementsByTagName('script')[0];

                if(body != undefined){
                    if(where == "self"){
                        screen.innerHTML = body.innerHTML;
                    }else if(where == "pop-up"){
                        modal_text.innerHTML = body.innerHTML;
                        modal_title.innerHTML = label;
                        modal.style.display = "block";
                    }else{
                        document.getElementById(where).innerHTML = body.innerHTML;
                    }
                    modal_data.value = data;
                    eval(script.innerHTML);
                }
            }); 
        }); 
    }
}

function queryDB(params,cod){
    const data = new URLSearchParams();        
        data.append("cod", cod);
        data.append("params", JSON.stringify(params));

    const myRequest = new Request("files/query_db.php",{
        method : "POST",
        body : data
    });

    return new Promise((resolve,reject) =>{
        fetch(myRequest)
        .then(function (response){
            if (response.status === 200) { 
                resolve(response.text());                    
            } else { 
                reject(new Error("Houve algum erro na comunicação com o servidor"));                    
            } 
        });
    });      
}

/*
document.querySelector('#menu-agenda').addEventListener('click',()=>{

    openHTML('agenda.html','self','AGENDA')

})

document.querySelector('#menu-login').addEventListener('click',()=>{

    if(localStorage.getItem('access') == null){
        openHTML('login.html','pop-up','LOGIN')
    }else{
        localStorage.clear();
        loadContent("brinquedos")
    }
    menu_login()

})
*/