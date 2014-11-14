/* 
Paul Kaplan, @ifitdidntwork

Create an ASCII STL file from a THREE.js mesh 
that can be saved save from browser and 3D printed
--------------------------------------------------
See further explanation here:
http://buildaweso.me/project/2013/2/25/converting-threejs-objects-to-stl-files
--------------------------------------------------
Saving the file out of the browser is done using FileSaver.js
find that here: https://github.com/eligrey/FileSaver.js
*/

function stringifyVertex(vec) {
  var x = ((vec.x * 10000) | 0) / 10000;
  var y = ((vec.z * 10000) | 0) / 10000;
  var z = ((vec.y * 10000) | 0) / 10000;
  return (-x) + " " + (y) + " " + (z);
}

// Use FileSaver.js 'saveAs' function to save the string

function saveSTL(geometry, name) {
  var stlString = generateSTL(geometry);

  var blob = new Blob([stlString], {
    type: 'text/plain'
  });

  saveAs(blob, name + '.stl');

}

function generateSTLFromMesh(geometryList, stl) {
  trace("generateSTLFromMesh");
  var geometry, vertices, tris;

  for (var j = 0; j < geometryList.length; j++) {
    geometry = geometryList[j].geometry;
    vertices = geometry.vertices;
    tris = geometry.faces;

    for (var i = 0; i < tris.length; i++) {
      stl += ("facet normal " + stringifyVertex(tris[i].normal) + " \n");
      stl += ("outer loop \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].a]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].b]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].c]) + " \n");
      stl += ("endloop \n");
      stl += ("endfacet \n");

    }
  }

  return stl;
}

function generateSTLFromPlane(geometryList, stl) {
  var geometry, vertices, tris;

  for (var j = 0; j < geometryList.length; j++) {
    geometry = geometryList[j].geometry;
    vertices = geometry.vertices;
    tris = geometry.faces;

    for (var i = 0; i < tris.length; i++) {
      stl += ("facet normal " + stringifyVertex(tris[i].normal) + " \n");
      stl += ("outer loop \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].a]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].b]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].c]) + " \n");
      stl += ("endloop \n");
      stl += ("endfacet \n");

      stl += ("facet normal " + stringifyVertex(tris[i].normal) + " \n");
      stl += ("outer loop \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].c]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].d]) + " \n");
      stl += ("vertex " + stringifyVertex(vertices[tris[i].a]) + " \n");
      stl += ("endloop \n");
      stl += ("endfacet \n");

    }
  }

  return stl;
}

function saveSTLFromCustom(planeGeometryList, name) {
  trace("saveSTLFromCustom");

  var stlString = "";
  stlString = stlString.concat("solid\n");
  stlString = stlString.concat(generateSTLFromPlane(planeGeometryList, ""));
  stlString = stlString.concat("endsolid");

  var blob = new Blob([stlString], {
    type: 'text/plain'
  });

  saveAs(blob, name + '.stl');

}

function saveSTLFromCustom(facetGeometryList, name) {
  trace("saveSTLFromCustom");

  var stlString = "";
  stlString = stlString.concat("solid\n");
  stlString = stlString.concat(generateSTLFromMesh(facetGeometryList, ""));
  stlString = stlString.concat("endsolid");

  var blob = new Blob([stlString], {
    type: 'text/plain'
  });

  saveAs(blob, name + "_" + displayTime() + '.stl');

}


function displayTime() {

    var str = "";

    var currentTime = new Date()
    var month = currentTime.getMonth()
    var day = currentTime.getDate()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    month++;

    if (month < 10)   { month = "0" + month }
    if (day < 10)     { day = "0" + day }
    if (minutes < 10)   { minutes = "0" + minutes }
    if (seconds < 10)   { seconds = "0" + seconds }
    // str += hours + ":" + minutes + ":" + seconds + " ";
    str += month + "" +day + "_" + hours + "" + minutes + "_" + seconds;
    // if(hours > 11){
    // str += "PM"
    // } else {
    // str += "AM"
    // }
    return str;
  }