
importScripts("classes.js")

onmessage = function(e) {
	
	console.log("<worker_merge2DArrays> started");
	console.log("<worker_merge2DArrays> array count: " + e.data.arrays.length);
	//console.log(e.data);
	
	let totalWidth = 0
	let totalHeight = 0
	for(let i=0; i<e.data.arrays.length; i++) {
		totalWidth += e.data.arrays[i].length;
		if(e.data.arrays[i][0].length > totalHeight) {
			totalHeight = e.data.arrays[i][0].length;
		}
		
	}
	
	console.log({"totalWidth": totalWidth, "totalHeight": totalHeight});
	
	//Create and fill array with nulls
	let resultArray = new Array(totalWidth);
	for(let i=0;i<totalWidth;i++) {
		resultArray[i] = new Array(totalHeight);
		for(let j=0;j<totalHeight;j++) {
			resultArray[i][j] = null;
		}
	}
	
	let x = 0;
	let y = 0;
	for(let ai=0; ai<e.data.arrays.length; ai++) {
		console.log("<worker_merge2DArrays> processing array " + ai);
		console.log("<worker_merge2DArrays> x: " + x);
		for(let i=0; i<e.data.arrays[ai].length; i++) {
			for(let j=0; j<e.data.arrays[ai][0].length; j++) {
				resultArray[i+x][j+y] = e.data.arrays[ai][i][j];
			}
		}
		x += e.data.arrays[ai].length;
	}
	
	
	console.log("<worker_merge2DArrays> Completed. Posting result");
	postMessage({result: resultArray});
	
	self.close()
	
	
}


