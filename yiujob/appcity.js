var fs=require('fs');
var file="d:/city2.json";//字母
var file1="d:/one.json";//全套
var result=JSON.parse(fs.readFileSync( file));
var result1=JSON.parse(fs.readFileSync( file1));
/*console.log(result.length)
console.log(result1.length)*/
/*result.forEach(function(e){  
    console.log(e.initial)  
}) */
// fs.writeFileSync('e:/output.json',JSON.stringify(result[0]));
for (var a = result.length - 1; a >= 0; a--) {
	// console.log(result[a].initial+result[a].list.length)
	// result[a].id = a;
	for (var i = result[a].list.length - 1; i >= 0; i--) {
		result[a].list[i].id = a;
		for (var b = result1.length - 1; b >= 0; b--) {
			var ok = true;
			if (result1[b].name.substr(0,2)==result[a].list[i].name) {
				result[a].list[i].code = result1[b].childs[0].code;
				// fs.writeFileSync('d:/numcity/'+result1[b].childs[0].code+'.json',JSON.stringify(result1[b].childs[0].childs));
				ok = false;
			}else{
				for (var c = result1[b].childs.length - 1; c >= 0; c--) {
					if (result1[b].childs[c].name.substr(0,2)==result[a].list[i].name) {
						result[a].list[i].code = result1[b].childs[c].code;
						// fs.writeFileSync('d:/numcity/'+result1[b].childs[c].code+'.json',JSON.stringify(result1[b].childs[c].childs))
						ok = false;
						
					}
				}

			}
			if (ok == false) {
				// console.log(result[a].list[i]);
				break;
			}
		}
	

	}
	
	// if (result[a].initial == 'C') {console.log(result[a].list.length);break}
	if (a==0) {fs.writeFileSync('d:/newcity.json',JSON.stringify(result));}
}