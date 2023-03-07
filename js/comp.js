var cercaTaula = {};
cercaTaula.nombreResultats = 0;
cercaTaula.numCerca = 0;  

function cercaRef(value){
  cercaTaula.nombreResultats = 0;
  cercaTaula.numCerca = 0; 
  activaTema ($('.cerca__result'), 'acces', $('#cerca-inp').val(), 10); 
  activaTema ($('.cerca__result'), 'parcel', $('#cerca-inp').val(), 10); 
  return false;
}

function activaTema (listview, nomTema, value, elements) {
  $ ('#cerca-input').blur ();
  $ ('#dades-input').blur ();
 // $ ('.cerca__result').html('Cercant resultats..');

  switch (nomTema) {

    case 'parcel':
      cercaGenericJSON (
        'https://aplicacions.mataro.org:444/apex/rest/dobertes/elements_detall?dataset=DS_PARCELARI200&par1=REFCAD&val1=' +
        value,
        listview,
        nomTema,
        'fa fa-map fa-2X',
        value,
        'DS_PARCELARI200',
        'REFCAD',
        'REFCAD',
        'NOM_ACCES',
        'REFCAD',
        'REFCAD',        
        'WKT',
        100
      );
      break;

    case 'acces':
      var value1 = value.replace (/[0-9]/g, ''); // Només pot buscar sobre el carrer. Filtra per número després
      cercaGenericJSON (
        'https://aplicacions.mataro.org:444/apex/rest/dobertes/elements_detall?dataset=DS_PARCELARI200&par1=NOM_ACCES&val1=' +
        value1,
        listview,
        nomTema,
        'fa fa-map-marker fa-2x',
        value,
        'DS_PARCELARI200',
        'REFCAD',
        'NOM_ACCES',
        'NOM_ACCES',
        'REFCAD',
        'REFCAD', // Nota: potser no cal repetir-ho
        'WKT',
        100
      );
      break;
  }
}

function cercaGenericJSON( JSON, listview, temaCerca, faIcon, strCerca, dataset, colCodi, colCerca, colEtiq1, colEtiq2, valCodi,  colWKT, nombre){
  var accesJSON;
  cercaTaula.numCerca += 1; 
  $.getJSON( JSON, 
    function ( response ) { 
      accesJSON = response;   
      var numResposta = 0;
      var html = '';
      var html1 = '';

      $.each(accesJSON.equipaments, function(i, equip) { // sobre equipament
        if ( equip.hasOwnProperty(colEtiq2) ) {
          var cerca = strCerca.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().split(' ').filter(Boolean);  // paraules de cerca treient els blanks
          if ( contains(equip[colCerca].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase(), cerca) ) { // si compleix amb totes les paraules de cerca
              if (numResposta == 0) {
                html += "<div class ='cerca__title'>" + temaCerca + "</div>";
              } 

              cercaTaula.nombreResultats += 1;
              
              html += 
                     "      <div class='cerca__bl' style='margin-left:0.4em;'>" 
                  +  "        <div class='cerca__line__elem--text'  > "                                        
                  +  "          <div class='cerca__line cerca__line__elem--titol' onclick=\"recuperaWKT( '" + 'DS_PARCELARI200'+ "' ,'" + colCodi + "','" + equip[valCodi] + "'  ); \"  > "
                  +                 equip[colEtiq1]
                  +  "          </div>" 
                  +  "          <div class='cerca__line cerca__line__elem--subtitol' > "
                  +  "             &nbsp Ref. Cadastral &nbsp" +  equip[colEtiq2] 
                  +  "          </div>" ; //   El div principal es tanca després       
              html += "</div> </div>"; 

              listview.html( html );          
            } 
          }
          if ( cercaTaula.nombreResultats > nombre ){  // En el cas que es superi el màxin d'elements 
                    html += 
                    +  "     <div class='cerca__title'> "
                    +  "       Resultats parcials"
                    +  "     </div>" ;        
            return false;
          }                   
      });


      if (cercaTaula.nombreResultats == 0 && cercaTaula.numCerca == 2) {

        html  = 
                 "          <div class='cerca__line cerca__line__elem--titol' style='margin-left:2em'  > "
              +  "             No s'han obtingut resultats "
              +  "          </div>" ;
              +  "          <div class='cerca__line cerca__line__elem--subtitol' > "
//                   +  "            Codi: " +   equip[colEtiq2] 
              +  "          </div>" ; //   El div principal es tanca després         
        
        listview.html( html ); 

      }  
     
               
   });
   
   // sort function callback
    function sort_li(a, b){
        return (     $(b).data('dist')) < ($(a).data('dist')) ? 1 : -1;    
    }
 }

function mostraParcel (refCad) {
  var html = '';
  if ( refCad !== null){
    html =  "<div class='datawrp__line__elem--100' onclick=\"mapJS2.flyToWKT('" +  equip.WKT + "' );mapJS2.searchWKT('" + equip.WKT + "'\' );> Seleccioneu parcel·la associada</div>";
  }
  return html;
}

function contains(target, pattern){
  var value = 0;
  pattern.forEach(function(word){
    value = value + target.includes(word);
  });
  return (value === pattern.length)
}

function recuperaWKT (dataset, par1, val1) {
  var urlJSON =
    'https://aplicacions.mataro.org:444/apex/rest/dobertes/elements_detall_unic?dataset=' +
    dataset +
    '&par1=' +
    par1 +
    '&val1=' +
    val1;

  var WKT = null;

  $.getJSON (urlJSON, function (response) {
    WKT = response.equipaments[0].WKT;
    mapJS1.clearSearchWKT();
    mapJS1.flyToWKT(WKT);
    mapJS1.searchWKT(WKT);
  });
}

function recuperaDades (dataset, par1, val1, par2) {
  var urlJSON =
    'https://aplicacions.mataro.org:444/apex/rest/dobertes/elements_detall_unic?dataset=' +
    dataset +
    '&par1=' +
    par1 +
    '&val1=' +
    val1;

  var WKT = null;

  $.getJSON (urlJSON, function (response) {
    WKT = response.equipaments[0].WKT;
    mapJS1.flyToWKT(WKT);
    mapJS1.searchWKT(WKT);
  });
}
