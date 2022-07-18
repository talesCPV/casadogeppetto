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
var modal_data;
var btnClose = document.querySelector(".close");

var over_modal = document.getElementById("overModal");
var over_title = document.getElementById("over-title");
var over_text = document.querySelector(".over-text");
var over_close = document.querySelector(".over-close");


 /*  MODAL  */
document.querySelector('.close').addEventListener('click',()=>{
    modal.style.display = "none";
})

document.querySelector('.over-close').addEventListener('click',()=>{
    over_modal.style.display = "none";
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
        frm.origem = 'edit'
        const btn = document.createElement('div')
        btn.classList = 'edit circle'
        btn.innerHTML = 'E'
        btn.addEventListener('click',()=>{
            open = openHTML('new_frame.html','pop-up','Edição',frm) 
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

async function openHTML(template,where="self",label="", data=""){
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
                    }else if(where == "over"){
                        over_text.innerHTML = body.innerHTML;
                        over_title.innerHTML = label;
                        over_modal.style.display = "block";                        
                    }else{
                        document.getElementById(where).innerHTML = body.innerHTML;
                    }
                    modal_data = data;
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

function inteiro(K){
    number(K)
    K.value = K.value.trim() == '' ? 0 : parseInt(K.value)
}

function number(campo){
    var ok_chr = new Array('1','2','3','4','5','6','7','8','9','0');
    var text = campo.value;
    var after_dot = 0;
    var out_text = '';
    for(var i = 0; i<text.length; i++){

        if(after_dot > 0){ // conta quantas casas depois da virgula
            after_dot = after_dot + 1;
        }

        if (after_dot < 4 ){ // se não passou de 2 casas depois da virgula ( conta o ponto + 2 digitos)

            if(ok_chr.includes(text.charAt(i))){
                out_text = out_text + text.charAt(i)

            }
            if((text.charAt(i) == ',' || text.charAt(i) == '.') && after_dot == 0){
                out_text = out_text + '.';
                after_dot = after_dot + 1;
            }
        }


    }     

    campo.value = out_text ;
}  


function getEnter(e, button = ''){
    var keynum;

    if(window.event) { // IE                  
      keynum = e.keyCode;
    } else if(e.which){ // Netscape/Firefox/Opera                 
      keynum = e.which;
    }

    if(keynum == 13){
        document.querySelector('#'+button).click()
    }


}

function phone(param){ // formata a string no padrão TELEFONE
    number(param);
    var num = param.value;
    var out = '';
    var count = 0;

    for(i=0;i<num.length;i++){
        chr = num.substring(i,i+1);
        count++;

        if(count == 1){
            out = '(' + out ;
        }
        if(count == 3){
            out = out + ')';
        }
        if(count == 7){
            out = out + '-';
        }
        if(count == 11){
            out = out.substr(0,5) +" "+out.substr(5,3)+out.substr(9,1)+"-"+out.substr(10,3);
        }		
        out = out + chr;			
    }

    param.value = out;
}

function aspect_ratio(img,cvw=300, cvh=300){
    out = [0,0,cvw,cvh]
    w = img.width
    h = img.height
    
    if(w >= h){
        out[3] = cvh/(w/h)
        out[1] = (cvh - out[3]) / 2
    }else{
        out[2] = cvw/(h/w)
        out[0] = (cvw - out[2]) / 2
    }
    return out
}

function loadImg(filename, id='cnvImg') {

    var ctx = document.getElementById(id);
    if (ctx.getContext) {

        ctx = ctx.getContext('2d');
        var img = new Image();
        img.onload = function () {
            ar = aspect_ratio(img)
            ctx.drawImage(img, 0, 0,img.width,img.height,ar[0],ar[1],ar[2],ar[3]);
        };

        img.src = 'files/pictures/'+filename;
    }
}

function formatData(data){
    return data.substring(8,10)+'/'+data.substring(5,7)+'/'+data.substring(0,4)
}

function money(campo){
    var ok_chr = new Array('1','2','3','4','5','6','7','8','9','0');
    var text = campo.value;
    while (text[0] == '0'){
        text = text.substring(1, text.length)
    }
    var after_dot = 0;
    var out_text = '';
    for(var i = 0; i<text.length; i++){

        if(after_dot > 0){ // conta quantas casas depois da virgula
            after_dot = after_dot + 1;
        }

        if (after_dot < 4 ){ // se não passou de 2 casas depois da virgula ( conta o ponto + 2 digitos)

            if(ok_chr.includes(text.charAt(i))){
                out_text = out_text + text.charAt(i)

            }
            if((text.charAt(i) == ',' || text.charAt(i) == '.') && after_dot == 0){
                out_text = out_text + '.';
                after_dot = after_dot + 1;
            }
        }


    }
    
    campo.value = out_text.trim() == '' ? 0 : out_text
}