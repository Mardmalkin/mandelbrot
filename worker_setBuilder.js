

importScripts("classes.js")


onmessage = function(e) {
	
	console.log("<worker_setBuilder> algorithm started");
	console.log(e.data);
	
	
	let id = e.data.id
	
	console.log("<worker_setBuilder> id:" + id);
	
	let GrowthThreshold = e.data.GrowthThreshold;
	let IterationThreshold = e.data.IterationThreshold;
	
	let BoxWidth = e.data.BoxWidth;
	let BoxHeight = e.data.BoxHeight;
	let BoxAspectRatio = BoxWidth / BoxHeight;
	
	let LeftEdge = e.data.LeftEdge;
	let TopEdge = e.data.TopEdge;
	let PlaneWidth = 0.0;
	let Scale = 0.0;
	
	if (e.data.PlaneWidth) {
		console.log("<worker_setBuilder> PlaneWidth provided. Using PlaneWidth");
		PlaneWidth = e.data.PlaneWidth;
		Scale = PlaneWidth / BoxWidth;
	} else if (e.data.Scale) {
		console.log("<worker_setBuilder> Scale provided. Using Scale");
		Scale = e.data.Scale;
		PlaneWidth = BoxWidth * Scale;
	} else {
		throw 'Error in setBuilder worker. Must supply either PlaneWidth or Scale';
	}
	
	let Power = 2;
	if (e.data.Power) {
		console.log("<worker_setBuilder> Using Power: " + Power);
		Power = e.data.Power;
	}
	
	
	var PlaneHeight = PlaneWidth / BoxAspectRatio;
	
	//console.log("<worker_setBuilder> algorithm started");
	
	let plane = new Array();
	plane = FillArray(-1.0, BoxWidth, BoxHeight)
	//planeDetails = FillArray({number: null, rate: -1.0, iterationCount: 0}, BoxWidth, BoxHeight)
	planeDetails = FillArray(null, BoxWidth, BoxHeight)
	
	//console.log("<worker_setBuilder> create Complex objects z and c");
	let z = new ComplexNumber(0, 0);
	let c = new ComplexNumber(0, 0);
	//let oldZ = new ComplexNumber(0, 0);
	
	let maxIteration=0;
	let minIteration=IterationThreshold;
	let iterationCounter;
	
	let LoadPercent = 0.0;
	let MilestoneStep = .01;
	let ReportMilestone = MilestoneStep;
	
	//console.log("<worker_setBuilder> Start Loop");
	for(let pixelX=0;pixelX<BoxWidth;pixelX++)
	{
		for(let pixelY=0;pixelY<BoxHeight;pixelY++)
		{
			////console.log("<worker_setBuilder> +++ (" + pixelX + "," + pixelY + ")");
		
			c = new ComplexNumber(LeftEdge + (pixelX * Scale), TopEdge - (pixelY * Scale));
			z = new ComplexNumber(LeftEdge + (pixelX * Scale), TopEdge - (pixelY * Scale));
			
			iterationCounter = 0;
			plane[pixelX][pixelY] = 0;
			planeDetails[pixelX][pixelY] = {rate: 0, iterationCount: 0, number: c};
			for(let count=0;count<IterationThreshold;count++)
			{
				//console.log("<worker_setBuilder> +++++++++ " + iterationCounter + "z: " + z.getValue());
				iterationCounter++;
				
				// Z = z^2 + c
				//z = z.square().add(c);
				
				//// Experimenting with different powers
				//z = z.multiply(z).multiply(z).multiply(z);
				let oldZ = z;
				for(let powerCount = 1; powerCount < Power;powerCount++) {
					z = z.multiply(oldZ);
				}
				z = z.add(c);
				
				
				if(z.getValue()>GrowthThreshold)
				{
					let rate = 1- (iterationCounter / IterationThreshold);
					
					plane[pixelX][pixelY] = rate;
					planeDetails[pixelX][pixelY].rate = rate;
					//console.log("<RunAlgorithm> +++++++++ " + iterationCounter + " - " + rate);

					if(iterationCounter>maxIteration)
						maxIteration = iterationCounter;
					if(iterationCounter<minIteration)
						minIteration = iterationCounter;
					break;
					
				}//If z > threshold
				
			}//Threshold loop
			planeDetails[pixelX][pixelY].iterationCount = iterationCounter;
			
		}//Loop Y
		
		LoadPercent = (pixelX) / BoxWidth;
		//console.log("<worker_setBuilder> LoadPercent: " + LoadPercent);
		if(LoadPercent > ReportMilestone) {
			//console.log("<worker_setBuilder> Reporting Load Percent");
			postMessage({id: id, Completed: false, LoadPercent: LoadPercent});
			ReportMilestone += MilestoneStep;
		}
		
		
		//console.log("<worker_setBuilder> LoadPercent: " + LoadPercent);
	}//Loop X
	
	//console.log("<worker_setBuilder> Loop completed ");
	//console.log("<worker_setBuilder> Max Iteration: " + maxIteration);
	//console.log("<worker_setBuilder> Min Iteration: " + minIteration);
	
	LoadPercent = 1.0
	//console.log("<worker_setBuilder> Completed. Posting result");
	
	if(e.data.BuildPlaneDetails) {
		postMessage({id: id, Completed: true, LoadPercent: LoadPercent, Plane: plane, PlaneDetails: planeDetails});
	} else {
		postMessage({id: id, Completed: true, LoadPercent: LoadPercent, Plane: plane});
	}
	
	self.close()
}


FillArray = function(value, width, height) {
	let array = new Array(width);
	for(let i=0;i<width;i++) {
		array[i] = new Array(height);
		for(let j=0;j<height;j++) {
			array[i][j] = value;
		}
	}
	return array;
}




/*

class ComplexNumber
{
	
	constructor (realComponent, imaginaryComponent)
	{
		this.real = realComponent;
		this.imaginary = imaginaryComponent;
	}
	
	add(num)
	{
		let newReal = 0.0;
		let newImaginary = 0.0;
		
		newReal = this.real + num.real;
		newImaginary = this.imaginary + num.imaginary;

		return new ComplexNumber(newReal, newImaginary);
	}
	
	subtract(num)
	{
		let newReal = 0.0;
		let newImaginary = 0.0;
		
		newReal = this.real - num.real;
		newImaginary = this.imaginary - num.imaginary;
		
		return new ComplexNumber(newReal, newImaginary);
	}
	
	multiply(num)
	{
		
		let newReal = 0.0;
		let newImaginary = 0.0;
		
		newReal = ( (this.real*num.real) - (this.imaginary*num.imaginary) );
		newImaginary = ( (this.imaginary*num.real) + (this.real*num.imaginary) );

		return new ComplexNumber(newReal, newImaginary);
	}
	
	square()
	{
		let newReal = 0.0;
		let newImaginary = 0.0;
		
		newReal = ( (this.real*this.real) - (this.imaginary*this.imaginary) );
		newImaginary = ( (this.imaginary*this.real) + (this.real*this.imaginary) );
		
		return new ComplexNumber(newReal, newImaginary);
	}
	
	
	setReal(realComponent)
	{
		this.real = realComponent;
	}
	
	setImaginary(imaginaryComponent)
	{
		this.imaginary = imaginaryComponent;
	}
	
	getReal()
	{
		return this.real;
	}
	
	getImaginary()
	{
		return this.imaginary;
	}
	
	//Used for determining whether or not the number has gone off to infinity
	getValue() 
	{
		return Math.max(this.real, this.imaginary);
	}
	
}

*/



