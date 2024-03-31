
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
var today = new Date()
var meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

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

loadContent("Home")

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
        frames = document.querySelector('#form-for-frames')
        frames.innerHTML = `<h1>${cat}</h1>`       
        if(resolve.trim() != ""){
            const json = JSON.parse(resolve);

            if(localStorage.getItem('access')=='10'){
                newFrame = createFrame({content:'plus',background:'#f0a70a'})
                frames.appendChild(newFrame.html)
                eval(newFrame.script)

            }

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
        out.html.style =  `text-align : ${frm.justify}; font-size: ${frm.font}px; color:${frm.color};`
    }else if(frm.content == 'pic'){
        out.html.innerHTML = `<img src="files/pictures/${frm.filename}" alt="">`
        if(frm.text.trim() != ''){
            out.html.title = frm.text
            const txt = document.createElement('div')
            txt.innerHTML = frm.text
            txt.style =  `position:absolute; text-align : ${frm.justify}; font-size: ${frm.font}px; color:${frm.color};`
            out.html.appendChild(txt)
        }
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


function dateTransform(dt, format='db'){

    day = dt.getDate()
    month = dt.getMonth() + 1
    year = dt.getFullYear()

    return format='db'? `${year}-${month}-${day}` : `${day}/${month}/${year}`
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

function valCPF(edt){
    let ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    var num = edt.value;
    var count = 0;
    var out = '';

    for(i=0;i<num.length;i++){
        chr = num[i]
        if(ok_chr.includes(chr)){
            count++;
            if(count == 4 || count == 7){
                out += '.' ;
            }else if(count == 10){
                out += '-' ;
            }
            out += chr;	
        }
		
    }
    edt.value = out;
}

function horario(edt){
    let ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    var num = edt.value;
    var count = 0;
    var out = '';

    for(i=0;i<num.length;i++){
        chr = num[i]
        if(ok_chr.includes(chr)){

            count++;
            if(count == 3 ){
                out += ':' ;
            }
            out += chr;	
        }
		
    }

    if(out.length == 1){
        out = parseInt(out)<3 ? out : ''
    }else if(out.length == 2){
        out = parseInt(out)<24 ? out : out.substring(0,1)
    }else if(out.length == 4){
        out = parseInt(out.substring(3,4))< 6 ? out : out.substring(0,3)
    }

    edt.value = out;
}

function fillTime(param){
    
    if(param.value.length<5){
        alert('Favor preencher o campo corretamente')
        param.focus()
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

function checkField(fields){
    
    for(let i=0; i< fields.length; i++){
        if(document.getElementById(fields[i]).value.trim() == ''){
            alert('Favor preencher todos os campos obrigatórios.')
            document.getElementById(fields[i]).focus()
            return false
        }
    }
    return true
}

function getNum(V){
    const ok_chr = ['1','2','3','4','5','6','7','8','9','0'];
    let out = ''
    for(let i=0; i< V.length; i++){
        if(ok_chr.includes(V[i])){
            out+=V[i]
        }
    }
    return out
}

function valCPF(edt){
    edt.value = getCPF(getNum(edt.value))
}

function getCPF(V){
    V = getNum(V)
    let out = ''
    for(let i=0; i< V.length; i++){
        if(i==3 || i==6){
            out+='.'
        }else if(i==9){
            out+='-'
        }
        out+=V[i]            
    }
    return out
}


function contrato_pdf(data){

    var sign_day = new Date(data.fat_data == '' ? today.getFormatDate() : data.fat_data)
        sign_day.setDate(sign_day.getDate() + 1);

    var imgData = new Image()
        imgData.src = 'assets/logo.png'

    var doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4'
        })  

    var txt = new Object
            txt.heigth = 5
            txt.x = 25
            txt.y = 46
            txt.width = doc.internal.pageSize.getWidth() - txt.x
            txt.alt = 285
            txt.text 

    function addLine(N=1){
        txt.y += txt.heigth * N
    }

    function frame(){
        doc.rect(5,5,200,286)
    }

    function logo(){
        doc.addImage(imgData, 'png', 14, 7, 36, 25);
    }

    function center_text(T=''){
        let text = T==''? txt.text : T
        xOffset = (doc.internal.pageSize.getWidth() - text.length * (doc.internal.getFontSize() / 4.6)) /2;         
        doc.text(text.toUpperCase(), xOffset, txt.y);
        addLine()
    }

    function block_text(T=''){
        const text = T==''? txt.text.split(' ') : T.split(' ')
        let line = ''

        function print(){

            if(line.length > 0){
                doc.text(line.trim(), txt.x, txt.y);
            }
            addLine()
            line = ''
            if (txt.y >= txt.alt){
                doc.addPage();
                frame()
                logo()
                txt.y = 46 
            }                
        }

        for(let i=0; i< text.length; i++){

            if(text[i].includes('\n')){
                line = line.trim() + ' ' + text[i].trim()
                print()
            }else if(text[i] != ''){
                line = line.trim() + ' ' + text[i].trim()
            }
            
            length = line.length * (doc.internal.getFontSize() / 4.6)
            if(length > txt.width-4){
                print()
            }                
        }
        print()
    }

    function countHora(A, B){
        hora = new Object
            hora.A_h = parseInt(A.substring(0,2))
            hora.A_m = parseInt(A.substring(3,5))
            hora.B_h = parseInt(B.substring(0,2))
            hora.B_m = parseInt(B.substring(3,5))
        return (hora.B_h - hora.A_h) +','+ Math.floor(((hora.B_m - hora.A_m) < 0 ? (hora.B_m - hora.A_m) + 60 : (hora.B_m - hora.A_m))/0.6)

    }

    frame()
    logo()

    
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    center_text('CONTRATO DE LOCAÇÃO DE BRINQUEDOS PARA FESTAS E EVENTOS')
    center_text(`${data.nome} - ${formatData(data.data)}`)

    addLine(2)

    txt.text = `FVL SB LTDA ME, CNPJ 25.308.185/0001-27, sediada a Av. Lineu de Moura, n.805, São José dos Campos/SP, doravante denominado LOCADORA. 
    
    ${data.fat_nome}, CPF ${data.fat_cpf}, residente a ${data.fat_end}, n.${data.fat_num},${data.fat_comp.trim()} ${data.fat_cidade}/${data.fat_estado} doravante denominado LOCATÁRIO. 
    
    As partes acima qualificadas, tem entre si, justo e acertado os seguintes termos e condições do contrato de locação de brinquedos, conforme a seguir.`

    doc.setFont(undefined,'normal')
    block_text()

            
    doc.setFont(undefined, 'bold')
    
    addLine()

    block_text(`${data.kit} ${data.monitoria=='1' ? '+ MONITORA' : '' }`) 
    addLine()    
    block_text('Descrição dos Itens Locados:')     
    addLine()
    txt.text = ''
    for(let i=0; i<data.myToys.length; i++){
        txt.text += `${data.myToys[i].qtd}  ${data.myToys[i].nome} - tam ${data.myToys[i].tamanho}   
        `
    }

    doc.setFont(undefined,'normal')
    block_text()

    preco = parseFloat(data.valor)

    txt.text =`O kit será acompanhado por tapete de EVA cor madeira e lousa. 
 
    O valor da locação é de ${preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}, frete incluso, que deverão ser pagos através de depósito em conta corrente no banco NU BANK (Banco 260 - Nu Pagamentos S.A.), AG 0001, C/C 80940970-1, titularidade de Michele de Souza Lopes, CPF 286.193.928-16 ou via PIX - Chaves de acesso: "12981736952" ou "casadogeppetto@gmail.com" 
     
    50% (${(preco/2).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}) no recebimento do contrato para reserva de vaga. 
    50% (${(preco/2).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}) até o dia da festa ${formatData(data.data)}
    
    
    Contratam, sob as cláusulas e condições seguintes: 
 
     
    I - A locação dos brinquedos vigerá pelo período de ${countHora(data.montagem,data.desmontagem)}hrs, caso necessite de mais tempo consultar disponibilidade com antecedência e o valor da hora adicional, devendo o locatário restituí-lo findo o prazo; 
 
    II - Fica estabelecido o sinal de 50% (cinquenta por cento) do valor monetário total da locação para reserva de datas. O saldo restante deverá ser pago até a data da festa já mencionada acima.  
 
    III - A desistência por parte do LOCATÁRIO implica na perda total do valor pago pela locação do(s) item(s) acima descrito(s) na seguinte proporção: 
 
    III.1 - Cancelamento com antecedência inferior ou igual a 15 dias do evento, será cobrado o valor integral deste contrato, dada a impossibilidade de locação para novo cliente;
 
    III.2 - Cancelamento com antecedência superior a 15 e inferior a 30 dias, será cobrado 50% do valor do contrato;
 
    III.3 - Cancelamento superior a 30 dias, será retido a 20% sobre o valor do contrato
 
    IV - O LOCATÁRIO assume a responsabilidade que usará o(s) brinquedo(s) de forma a não prejudicar as condições estéticas e de segurança do(s) mesmo(s); 
 
    V - O LOCATÁRIO assume também a responsabilidade de proporcionar um local adequado para o(s) brinquedo(s) locado(s), devendo ser plano e uniforme, caso na data do evento o tempo esteja chuvoso, pois não é possível a montagem dos brinquedos expostos à chuva por motivo de segurança das crianças e a impossibilidade por este motivo não obriga o LOCADOR a fazer a devolução do valor monetário dado como sinal; locais de difícil acesso para a montagem dos brinquedos será cobrada uma adicional de grau de dificuldade. 
 
    VI - O LOCATÁRIO, indica que o local, data e hora do evento 
 
    Local: ${data.local}
    Endereço: ${data.endereco}, ${data.bairro} - ${data.cidade}-${data.estado}
    Data: ${formatData(data.data)}       
    Início do evento: ${data.inicio}
    Montagem: ${data.montagem}   
    Desmontagem: ${data.desmontagem}
    Responsável: ${data.responsavel}
    Tel: ${data.cel}
    Observações importantes: ${data.obs} 
 
 
    VII - O LOCADOR se compromete a montar o(s) brinquedo(s) uma hora antes do início do evento (horário do evento estabelecido no início deste contrato) e 1 monitor se contratado. 
 
    VIII - Caso, antes do evento, ocorra algum defeito ou dano no item alugado, o LOCADOR reserva o direito de substituí-lo SEM AVISO PREVIO, por outro brinquedo de mesma categoria; 
 
    IX - O LOCADOR, por si ou por preposto, poderá visitar o local do evento durante a locação, para garantir o bom funcionamento do(s) brinquedo(s) e verificar o exato cumprimento das cláusulas deste contrato; 
 
    X - BENS MÓVEIS: O termo Bens Móveis refere-se a todo o mobiliário fornecido pela LOCADORA ao LOCATÁRIO. 
 
    X.1- A LOCADORA possui propriedade dos Bens Móveis sendo de exclusivo uso do LOCATÁRIO e deverão ser devolvidos pelo LOCATÁRIO, ao término ou no caso de rescisão parcial ou total deste contrato. 
 
    X.2 - É vedado ao LOCATÁRIO ceder, emprestar ou sublocar, total ou parcialmente, o objeto locado sem a anuência, por escrito, do locador. 
 
    XI - A entrega dos bens locados caberá à LOCADORA, ou a quem por ela for indicado, na localização estipulada pelo LOCATÁRIO no Pedido de Locação, contabilizando desde assinatura e aceitação do LOCATÁRIO. 
 
    XI.1 - Se houver interesse do LOCATÁRIO na prorrogação do prazo de Locação deste contrato, caberá às partes no prazo improrrogável de 72 (setenta e duas) horas anteriores ao seu evento, manifestar seu desejo, por escrito, em continuar com a locação por prazo igual ou superior. 
 
    XI. 2 - O LOCATÁRIO deverá ter a posse legal do local em que forem entregues e instalados os bens, sendo que sem o prévio consentimento, por escrito da LOCADORA, tais bens, não poderão ser instalados em outro local que não o estabelecido no respectivo contrato. 
 
    XI.3 - A responsabilidade de averiguação se os bens entregues pela LOCADORA atendem às especificações solicitadas será do LOCATÁRIO, que deverá no ato do recebimento assinar o termo de entrega e vistoria, que servirá como comprovante do recebimento e aceitação dos bens. 
 
    XI.4 - A continuação da utilização dos bens móveis após o término do Contrato implicará a concordância imediata do LOCATÁRIO com a sua renovação por prazo igual. 
 
    XII - Em caso de avaria, extravio, danos e/ou furto do material locado, a LOCADORA se reserva o direito de emitir cobrança bancária o LOCATÁRIO, que desde já autoriza tal cobrança no valor correspondente ao reparo e/ou substituição do material. 
 
    XII.1 - Todo e qualquer conserto e/ou reparo será efetuado única e exclusivamente pela LOCADORA, caso contrário o LOCATÁRIO será automaticamente responsabilizada pelos danos eventualmente causados. 
 
    XII.2 - A conservação dos bens locados será de responsabilidade do LOCATÁRIO. 
 
    XII.3 - Não é permitido o LOCATÁRIO adaptar os bens locados, instalando peças, modificando sua aparência, estrutura ou funcionamento, a não ser que a LOCADORA, por escrito, consinta previamente. 
 
    XIII - A infração de qualquer das cláusulas deste contrato faz incorrer ao infrator na multa irredutível de 20% (vinte por cento), sobre o valor monetário da locação e importa na sua rescisão de pleno direito, sujeitando-se a parte infratora ao pagamento das perdas e danos que posteriormente forem apuradas; 
 
    Fica eleito do foro da cidade de São José dos Campos, para dirimir qualquer litígio. 
 
    E por estarem justos e contratados, lavraram o presente instrumento em 02 (duas) vias de igual teor e forma para as finalidades de direito. 
 
    São José dos Campos, ${sign_day.getDate()} de ${meses[sign_day.getMonth()]} de ${sign_day.getFullYear()}. 
    `

    block_text()

    addLine(2)
    doc.text('Locador',txt.x, txt.y)
    doc.setFontSize(15)
    doc.setTextColor(38,99,108);
    doc.text('Michele S. Lopes / Natalia Savassa',txt.x + 20, txt.y)
    addLine(3)
    doc.setFontSize(11)
    doc.setTextColor(0,0,0);
    doc.text('Locatário',txt.x, txt.y)
    doc.setFontSize(15)
    doc.setTextColor(38,99,108);
    doc.text(data.fat_nome,txt.x + 20, txt.y)

    doc.save('contrato.pdf')

}
