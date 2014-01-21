var url = require('url');

GeolocationLog = require('../models/geolocationlog');
Identity = require('../models/identity');

var api_end_point = '/api/mesInfosLogin';
//var host_backoffice = 'localhost.pixarusBackOffice.com';
var host_backoffice = 'pixarus.com';

/**
 * Acces privé => Ca demande l'autentification avant d'y acceder
 * /mobileLogin?token=1235rttytyyYYUuu678
 * Ex: http://localhost:9104/apps/mes1001choses/mobileLogin?token=1234567890azertyyy
 **/
module.exports.login = function(req, res) {
  var srvUrl = url.parse('http://' + req.url);
    
  console.log('/mobileLogin req query : ' + srvUrl.query);
  console.log('/mobileLogin host : ' + req.host);
  
  var token_value = req.query.token;
  console.log('/mobileLogin token_value : ' + token_value);
  
  if(token_value.length >0){
    performSimpleCall('mobileLogin', token_value, req, res);
  }
  else {
    res.send(200, '');
  }
      
};

/**
 * Acces privé => Ca demande l'autentification avant d'y acceder
 * Acces home page => /  
 * Ex: http://localhost:9104/#apps/mes1001choses
 **/
module.exports.home = function(req, res) {
  var srvUrl = url.parse('http://' + req.url);
  
  console.log('HOME req query : ' + srvUrl.query);
  console.log('HOME host : ' + req.host);
  
  var html = render('home');
  res.send(200, html);
};

/**
 * Acces public => Accés sans authentification
 * 
 * Traitement des appel API entre Cozy et l'appli mobile.
 * Format de requete : /public?q=requete&token=12345azerty678ghvbnSDrfff
 * Ex: http://localhost:9104/public/mes1001choses/?q=requete&token=12345azerty678ghvbnSDrfff
 * 
 * REQUESTE (requete) :
 * 1. checkConnection
 * 2. locations
 */
module.exports.api = function(req, res) {
    var data_out = null;    
    var srvUrl = url.parse('http://' + req.url);
    
    console.log('API /public req query : ' + srvUrl.query);
    console.log('API /public host : ' + req.host);
    
    if(req.query.q.length >0 && req.host.length >0){
        
        var hostnames = req.host.split("."); 
        var username = hostnames[0];
        
        console.log('API /public username : ' + username);
        console.log('API /public requete : ' + req.query.q);
        
        var requete = req.query.q;
        var token_value = req.query.token;
        
        console.log('API /public token_value : ' + token_value);
        
        //Test de username et token
        if('cozycloud' != username && token_value.length >0){
        
            //checkConnection
            if('checkConnection' == requete){
                console.log('API /public CHECKCONNECTION');                
                performSimpleCall('checkConnection', token_value, req, res);
            }
            //Locations
            else if('locations' == requete){
                console.log('API /public LOCATIONS');
                
                  GeolocationLog.all(function(err, instances) {
                    if(err != null) {
                      res.end(500, "An error has occurred -- " + err);
                    }
                    else {
                        console.log('API /public LOCATIONS OK');

                        Identity.one(function(err_id, instances_id) {
                            if(err_id != null) {
                              err_id.end(500, "An error has occurred Identity-- " + err_id);
                          }
                          else {
                                console.log('API /public LOCATIONS Identity OK');
                                //var data_id =  {"Identity": instances_id}
                                                                
                                data_out = {                            
                                    code:'OK',
                                    label:'API /public locations valide',
                                    timestamp:Math.round(+new Date()/1000),
                                    token:token_value,
                                    url:req.host,
                                    query:srvUrl.query,
                                    username:username,

                                    identity : {"Identity": instances_id},
                                    data: {"GeolocationLog": instances}
                                    };
                                
                                responseApiCall(data_out, req, res);
                              }
                            });                

                        }
                  });                
            }
        
        }
        else {
            console.log('API /public username ou token non valide');
            data_out = {
                code:'KO',
                label:'API /public username ou token non valide',   
                timestamp:Math.round(+new Date()/1000),
                url:req.host,
                query:srvUrl.query,
                username:username
                };  

            responseApiCall(data_out, req, res);
        }
             
    }
    else {
        console.log('API /public requete non valide');        
        data_out = {
            code:'KO',
            label:'API /public requete non valide',  
            timestamp:Math.round(+new Date()/1000),
            url:req.host,
            query:srvUrl.query        
            };    
        
        responseApiCall(data_out, req, res);
    }
    
};

/**
 * Appel simple
 */
function performSimpleCall(call, token, request, response) {
    var hostnames = request.host.split("."); 
    var username = hostnames[0];
        
    console.log('API /mobileLogin username : ' + username);

    Identity.one(function(err_id, instances_id) {
        if(err_id != null) {
            err_id.end(500, "An error has occurred mobileLogin Identity-- " + err_id);
        }
        else {
            console.log('API /mobileLogin Identity OK');            
            var identity = {"Identity": instances_id};
            
            var firstName = null;
            var lastName = null;
            
            for (idx in identity.Identity) {
                idDetail = identity.Identity[idx];            
                
                firstName = idDetail.firstName;
                lastName = idDetail.lastName;
                
                console.log('API /mobileLogin Identity lastName='+idDetail.lastName); 
                console.log('API /mobileLogin Identity firstName='+idDetail.firstName); 
            }
        
            //on envoie un signal de fin de connexion au BOffice
            if('mobileLogin' == call){
                
                var html = render('mobileLogin', token, username, firstName, lastName);
                response.send(200, html);                
            }
            else if('checkConnection'==call){
                
                var data_out = {                            
                    code:'OK',
                    label:'API /public checkConnection valide',
                    timestamp:Math.round(+new Date()/1000),
                    token:token,
                    username:username,
                    firstName:firstName,
                    lastName:lastName
                    };    
                
                responseApiCall(data_out, request, response);
            }
        }
    });

}


    /**
     * Retour au serveur apres un apple API
     */
function responseApiCall(data, req, res) {
    console.log('responseApiCall');    

    var cb = req.query.callback;
    var jsonP = false;

    console.log('responseApiCall callback : ' + cb);

    if (cb != null) {
        jsonP = true;
        res.writeHead(200, {'Content-Type': 'text/javascript', 'connection' : 'close'});
    } else {res.writeHead(200, {'Content-Type': "application/x-json"});}

    if (jsonP) {res.end(cb +  "(" + JSON.stringify(data) + ");" );}
    else { res.end(JSON.stringify(data));}
}


/**
 * Affichage sur l'écran MesInfos
 */
function render(screen, token, username, firstName, lastName) {
    var bodyHtml='';
    var titleHtml1='';
    var titleHtml2='';
    
    titleHtml1='Mes1001Choses';
    
    if('mobileLogin' == screen){        
        titleHtml2='Bienvenue sur l\'application mobile Mes1001Choses';
        
        bodyHtml +=        
        '                              \n' +
        '        <p class="lead" style="margin:5px;"><b>'+firstName+' '+lastName.toUpperCase()+'</b>, vous venez de vous authentifier avec succès à l\'application mobile <b>Mes1001Choses</b> sur la plate-forme MesInfos ! </p>\n' +
        '        <p class="lead" style="margin:5px;">Vous pouvez fermer cet écran en tappant sur le bouton <b>"Fermer"</b> ci-dessous et continuer à utiliser l\'application mobile <b>Mes1001Choses</b> sur votre <b>Smartphone</b>.</p>\n' +
        '                              \n' +        
        '         <button type="button" class="btn btn-custom center-class" onclick="javascript:performAPICallLoginMesInfos();">Fermer</button>\n'      

    }
    else if('home' == screen){        
        titleHtml2='Bienvenue sur l\'application Mes1001Choses';
        
        bodyHtml +=        
        '                              \n' +
        '        <p class="lead" style="margin:5px;">L\'application <b>Mes1001Choses</b> permet de mieux se connaître pour élargir ses horizons. Elle vous révèle vos routines (géographiques, comportementales, …) et vous permet de les évaluer :</p>\n' +
        '        <ul>\n' +        
        '        <li>Est-ce que cela me satisfait ?</li>\n' +        
        '        <li>Ai-je envie de changer mon comportement, de découvrir de nouveaux lieux, de nouveaux horizons, de nouvelles expériences ?</li>\n' +        
        //'        <li>...</li>\n' +        
        '        </ul>\n' +        
        '        <p class="lead" style="margin:5px;">Après tout, la vie c’est bien aussi quand c’est pas toujours pareil, n\'est-ce pas ? ;-)</p>\n' +
        '        <p class="lead" style="margin:5px;">L\'application sera <b>bientôt</b> disponible sur <b>Smartphone iOS</b> et <b>Andoid</b></p>\n' +
        '        <p class="lead" style="margin:5px;"><a href="#" border="0"><img src="img/logo_appstore.jpg" width="100" height="40"/></a></p>\n' +
        '        <p class="lead" style="margin:5px;"><a href="#" border="0"><img src="img/logo_andoid.png" width="100" height="40"/></a></p>\n' +        
        '                              \n' +        
        '         \n'      
        
    }

    var header = 
'<!DOCTYPE html>\n' +
'<html>\n' +
'  <head>\n' +
'    <meta charset="utf-8">\n' +
'    <title>'+titleHtml1+'</title>\n' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'    <!-- Bootstrap -->\n' +
'    <!-- link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" media="screen" -->\n' +
'    <link rel="stylesheet" href="stylesheets/app.css" media="screen">\n' +
    
'    <style type="text/css">\n' +
'    .btn.center-class {width:25%; display:block; margin: 0 auto;}\n' +
'    .btn-custom { background-color: hsl(0, 0%, 85%) !important; background-repeat: repeat-x; filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#d8d8d8", endColorstr="#d8d8d8"); background-image: -khtml-gradient(linear, left top, left bottom, from(#d8d8d8), to(#d8d8d8)); background-image: -moz-linear-gradient(top, #d8d8d8, #d8d8d8); background-image: -ms-linear-gradient(top, #d8d8d8, #d8d8d8); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d8d8d8), color-stop(100%, #d8d8d8)); background-image: -webkit-linear-gradient(top, #d8d8d8, #d8d8d8); background-image: -o-linear-gradient(top, #d8d8d8, #d8d8d8); background-image: linear-gradient(#d8d8d8, #d8d8d8); border-color: #d8d8d8 #d8d8d8 hsl(0, 0%, 85%); color: #333 !important; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.00); -webkit-font-smoothing: antialiased; }\n' +
'    </style>\n' +

'<script type="text/javascript">\n' +        
'function performAPICallLoginMesInfos() {\n' +        
'jQuery.post("http://'+host_backoffice+api_end_point+'",\n' +        
'            {                  \n' +        
'             methode: "API_MES1001CHOSES",\n' +        
'             execute: "loginMesInfosAPI_MES1001CHOSES",\n' +        
'             token: "'+token+'",\n' +        
'             timestamp:'+Math.round(+new Date()/1000)+',\n' +        
'             username:"'+username+'",\n' +        
'             lastName:"'+lastName+'",\n' +        
'             firstName:"'+firstName+'"\n' +        
'                              \n' +        
'            },\n' +        
'            function(msg) {\n' +        
'                window.close();\n' +        
'                }\n' +
'         );\n' +        
'}\n' +        
'</script>\n' +        

'  </head>\n' +

'  <body>\n' +
'    <div class="container">\n' +
'      <h1>'+titleHtml2+'</h1>\n' +
'      <div class="row">\n' ;

    var footer = 
'      </div>\n' +
'    </div>\n' +

'    <!-- jQuery (necessary for Bootstrap s JavaScript plugins) -->\n' +
'    <script src="http://code.jquery.com/jquery.js"></script>\n' +
'    <!-- Latest compiled and minified JavaScript -->\n' +
'    <script src="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>\n' +
'  </body>\n' +
'</html>\n'


    return header + bodyHtml + footer ;
}