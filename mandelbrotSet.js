
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var ElementBottomMargin = 5;
var ElementRightMargin = 1;
var divSidebar = document.getElementById("divSidebar");

var DefaultCanvasWidth = window.innerWidth - divSidebar.offsetWidth-ElementRightMargin;
var DefaultCanvasHeight = window.innerHeight-ElementBottomMargin;

var CurrentOrientation = window.orientation;

var EnableStateInUrl = true;

var BoxMargin = 0;
var BoxX = BoxMargin;
var BoxY = BoxMargin;
var BoxWidth = DefaultCanvasWidth - (BoxMargin*2);
var BoxHeight = DefaultCanvasHeight - (BoxMargin*2);
var BoxAspectRatio = BoxWidth / BoxHeight;

var AllowBoxResizing = false;
var ResizeSelectionWidth = 10;
var BorderColor = "red";
var DisplayBorder = false;

var DisplayAxes = false;
var OriginX = 0;
var OriginY = 0;
var AxesColor = "red";

var UpdatePointStats = true;

var IsMouseDown = false;
var MouseMode = "";

var KeyState = {shift: false, control: false};
var ModifierKeys = {
	center: 67, //c
	pointStats: 80 //p
}

var DefaultZoomSelectionMode = "CORNER"
//If using a mobile device, default to CENTER
if (navigator.userAgent.match(/Mobi/)) {
	DefaultZoomSelectionMode = "CENTER"
}

var ZoomSelectionMode = DefaultZoomSelectionMode;
var ZoomSelectionX = 0;
var ZoomSelectionY = 0;
var ZoomSelectionWidth = 0;
var ZoomSelectionHeight = 0;
var ZoomSelectionBorderColor    = 'rgba(255, 0, 0, 1)';
var ZoomSelectionCrosshairColor = 'rgba(255, 0, 0, 1)';
var ZoomSelectionBackgroundColor = 'rgba(255, 255, 255, 0.3)';
var ZoomSelectionThreshold = 30;
var zoomCrosshairWidth = 10;

var UpdateCanvas = true;

var Plane = new Array();
var PlaneDetails = new Array();
var PlaneDetailsArrays = new Array();
var PlaneDetailsLoaded = false;
var BuildPlaneDetailsDefault = false;
var BuildPlaneDetails = BuildPlaneDetailsDefault;
//var PlaneX = -1;
//var PlaneY = -1;
/*
var LeftEdge = -1.5, RightEdge = .5;
var BottomEdge = -1, TopEdge = 1;
var PlaneWidth = RightEdge - LeftEdge;
var PlaneHeight = TopEdge - BottomEdge;
var Scale = PlaneWidth / BoxWidth;
var Scale = PlaneHeight / BoxHeight;
*/

var PlaneHistory = new Array();

// Default Scale ~ 0.0076481835564053535
var DefaultPlaneWidth = 4;

//DefaultCanvasWidth

//var DefaultScale = 0.0040481835564053535
var DefaultPlaneX = -.5;
var DefaultPlaneY  = 0;


//var DefaultLeftEdge = -2.5;
//var DefaultTopEdge = 1.166;
//var DefaultPlaneWidth = 4;

var Scale = DefaultPlaneWidth / DefaultCanvasWidth;
var PlaneX = DefaultPlaneX;
var PlaneY = DefaultPlaneY;

var PlaneWidth = BoxWidth*Scale;
var PlaneHeight = BoxHeight*Scale;

var LeftEdge = PlaneX - PlaneWidth/2;
var TopEdge = PlaneY + PlaneHeight/2;
var RightEdge = PlaneX + PlaneWidth/2;
var BottomEdge = PlaneY - PlaneHeight/2;


var PlaneImageData = ctx.createImageData(1,1); 
var UpdateImageData = false;

var IntervalID;
var IntervalValue = 50;

var PlaneIntervalID;
var PlaneIntervalValue = 50;

//Settings set in SetSettingsDefaultValues()
var DefaultGrowthThreshold = 25;
var DefaultIterationThreshold = 200;
var DefaultZPower = 2;
var DefaultZoomLevel = 3;

var GrowthThreshold = DefaultGrowthThreshold;
var IterationThreshold = DefaultIterationThreshold;
var ZPower = DefaultZPower;
var ZoomLevel = DefaultZoomLevel;
var LoadPercent = 0.0;
var LoadPercentArray = new Array();
var LoadingBarColor = "#888888";
var LoadingBarHeight = 7;

var SubLoadingBarColor = "#cccccc";
var SubLoadingBarHeight = 3;


var DefaultRenderingThreads = navigator.hardwareConcurrency;
var RenderingThreads = DefaultRenderingThreads;
var DefaultShowPartialLoading = false;
var ShowPartialLoading = DefaultShowPartialLoading;

//var Rendered = false;
var UpdatePlane = false;
//var z = new ComplexNumber(0, 0);
//var c = new ComplexNumber(0, 0);


var ColorType = {
	BlackWhite: "BLACK_WHITE",
	SingleColor: "COLOR",
	ReverseColor: "REVERSE_COLOR",
	ColorCycle: "COLOR_CYCLE",
}

var Color = {
	Red: 'red',
	Green: 'green',
	Blue: 'blue',
	Cyan: 'cyan',
	Magenta: 'magenta',
	Yellow: 'yellow'
}

var DefaultColorMode = ColorType.ReverseColor;
var DefaultPrimaryColor = Color.Cyan;
var DefaultColorCycleCycleCount = 2;
var DefaultColorCycleOrdering = [Color.Red, Color.Green, Color.Blue];

var ColorMode = DefaultColorMode;
var PrimaryColor = DefaultPrimaryColor;

var ColorCycleCycleCount = DefaultColorCycleOrdering;
var ColorCycleOrdering = DefaultColorCycleOrdering;
var ColorCycleLow = 0
var ColorCycleHigh = 255

/* HTML Controls */
var tbGrowthThreshold = document.getElementById("tbGrowthThreshold");
var tbIterationThreshold = document.getElementById("tbIterationThreshold");
var tbZPower = document.getElementById("tbZPower");
var tbZoomLevel = document.getElementById("tbZoomLevel");
var tbRenderingThreads = document.getElementById("tbRenderingThreads");
var cbShowPartialLoading = document.getElementById("cbShowPartialLoading");
var chDisplayAxes = document.getElementById("chDisplayAxes");
var ddlZoomSelectionMode = document.getElementById("ddlZoomSelectionMode");
var cbBuildPointStats = document.getElementById("cbBuildPointStats");

var ddlColorMode = document.getElementById("ddlColorMode");
var ddlPrimaryColor = document.getElementById("ddlPrimaryColor");
var ddlColorCycleOrdering = document.getElementById("ddlColorCycleOrdering");
var tbColorCycleCycleCount = document.getElementById("tbColorCycleCycleCount");

var divPrimaryColor = document.getElementById("divPrimaryColor");
var divColorCycle = document.getElementById("divColorCycle");

var lblX = document.getElementById("lblX");
var lblY = document.getElementById("lblY");
var lblLeftEdge = document.getElementById("lblLeftEdge");
var lblRightEdge = document.getElementById("lblRightEdge");
var lblTopEdge = document.getElementById("lblTopEdge");
var lblBottomEdge = document.getElementById("lblBottomEdge");
var lblScale = document.getElementById("lblScale");

var lblPointStatsReal = document.getElementById("lblPointStatsReal");
var lblPointStatsImaginary = document.getElementById("lblPointStatsImaginary");
//var lblPointStatsPoint = document.getElementById("lblPointStatsPoint");
var lblPointStatsEscapeRate = document.getElementById("lblPointStatsEscapeRate");
var lblPointStatsIterationCount = document.getElementById("lblPointStatsIterationCount");
var divIterationHistory = document.getElementById("divIterationHistory");




HandleResize = function() {
	DefaultCanvasWidth = window.innerWidth - divSidebar.offsetWidth-ElementRightMargin;
	DefaultCanvasHeight = window.innerHeight-ElementBottomMargin;
	UpdateCanvasSize(DefaultCanvasWidth, DefaultCanvasHeight);
	
	if(window.orientation !== CurrentOrientation){
		CurrentOrientation = window.orientation;
		ReRender()
	}
}

window.addEventListener('resize', HandleResize);
window.addEventListener('orientationchange', HandleResize);

/****************** Drawing Stuff ***********************/

DrawCanvas = function () {
	
	//console.log("<DrawCanvas> Start");
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	
	//DrawBorder
	if(DisplayBorder) {
		ctx.strokeStyle = BorderColor;
		DrawLine(BoxX, BoxY, BoxX + BoxWidth, BoxY);
		DrawLine(BoxX, BoxY, BoxX, BoxY + BoxHeight);
		DrawLine(BoxX + BoxWidth, BoxY, BoxX + BoxWidth, BoxY + BoxHeight);
		DrawLine(BoxX, BoxY + BoxHeight, BoxX + BoxWidth, BoxY + BoxHeight);
	}
	
	if(Plane.length > 0) {
		if(UpdateImageData) {
			UpdateImageData = false;
			PlaneImageData = PlaneToImageData(Plane);
		}
		//console.log("<DrawCanvas> Putting ImageData onto context");
		ctx.putImageData(PlaneImageData, BoxX, BoxY);
	}
	
	if (LoadPercent > 0 && LoadPercent < 1) {
		//console.log("<DrawCanvas>LoadPercent: " + LoadPercent);
		ctx.fillStyle = LoadingBarColor;
		ctx.fillRect(BoxX, BoxY+BoxHeight-LoadingBarHeight, BoxWidth*LoadPercent, LoadingBarHeight);
		
		if(LoadPercentArray.length > 1) {
			//console.log(LoadPercentArray);
			ctx.fillStyle = SubLoadingBarColor;
			for(let i=0; i<LoadPercentArray.length; i++) {
				ctx.fillRect(BoxX, BoxY+BoxHeight - LoadingBarHeight - (SubLoadingBarHeight*(i+1)), BoxWidth*LoadPercentArray[i], SubLoadingBarHeight);
			}
		}
		
	}
	
	if(DisplayAxes) {
		if (OriginX > BoxX && OriginX < BoxX+BoxWidth) {
			ctx.strokeStyle = AxesColor;
			DrawLine(OriginX, BoxY+1, OriginX, BoxY+BoxHeight-1);
		}
		if (OriginY > BoxY && OriginY < BoxY+BoxHeight) {
			ctx.strokeStyle = AxesColor;
			DrawLine(BoxX+1, OriginY, BoxX+BoxWidth-1, OriginY);
		}
	}
	
	if(MouseMode == "ZOOM_SELECT") {
		ctx.strokeStyle = ZoomSelectionBorderColor;
		ctx.fillStyle = ZoomSelectionBackgroundColor;
		
		if(ZoomSelectionMode == "CORNER") {
			ctx.strokeRect(ZoomSelectionX, ZoomSelectionY, ZoomSelectionWidth, ZoomSelectionHeight);
			ctx.fillRect(ZoomSelectionX, ZoomSelectionY, ZoomSelectionWidth, ZoomSelectionHeight);
			
			if(Math.abs(ZoomSelectionWidth) > ZoomSelectionThreshold) {
				ctx.strokeStyle = ZoomSelectionCrosshairColor;
				let halfCross = zoomCrosshairWidth/2;
				let centerX = ZoomSelectionX + ZoomSelectionWidth/2;
				let centerY = ZoomSelectionY + ZoomSelectionHeight/2;
				
				DrawLine(centerX-halfCross, centerY, centerX+halfCross, centerY);
				DrawLine(centerX, centerY-halfCross, centerX, centerY+halfCross);
			
			}
			
		} else if (ZoomSelectionMode == "CENTER") {
			
			ctx.strokeRect(ZoomSelectionX-(ZoomSelectionWidth/2), ZoomSelectionY-(ZoomSelectionHeight/2), ZoomSelectionWidth, ZoomSelectionHeight);
			ctx.fillRect(ZoomSelectionX-(ZoomSelectionWidth/2), ZoomSelectionY-(ZoomSelectionHeight/2), ZoomSelectionWidth, ZoomSelectionHeight);
			
			if(Math.abs(ZoomSelectionWidth) > ZoomSelectionThreshold) {
				ctx.strokeStyle = ZoomSelectionCrosshairColor;
				let halfCross = zoomCrosshairWidth/2;
				DrawLine(ZoomSelectionX-halfCross, ZoomSelectionY, ZoomSelectionX+halfCross, ZoomSelectionY);
				DrawLine(ZoomSelectionX, ZoomSelectionY-halfCross, ZoomSelectionX, ZoomSelectionY+halfCross);
			
			}
			
		}
		
	}
	
	ctx.restore();
	//console.log("<DrawCanvas> End");
}


DrawLine = function(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}


PlaneToImageData = function(planeArray) {
	//console.log("<PlaneToImageData> start");

	let imageData = ctx.createImageData(Math.min(planeArray.length, BoxWidth), Math.min(planeArray[0].length, BoxHeight));
	let data = imageData.data;
	
	let pixelsColored = 0;
	
	for(let col=0;col<Math.min(planeArray.length, BoxWidth);col++) {
		for(let row=0;row<Math.min(planeArray[0].length, BoxHeight);row++) {
			//let color = PixelColorFromRate(planeArray[col][row].rate)
			let color = PixelColorFromRate(planeArray[col][row])
			
			let base = row * (imageData.width * 4) + col * 4
			data[base] = color.red;
			data[base+1] = color.green;
			data[base+2] = color.blue;
			data[base+3] = color.alpha;
		}
	}
	
	return imageData;
}



/******************* Coloring **********************/


PixelColorFromRate = function(rate) {
	
	let result = {red: 0, green: 0, blue: 0, alpha: 255}
	switch (ColorMode) {
		case ColorType.BlackWhite:
			//Black/White
			if(rate > 0) {
				result.red = 255;
				result.green = 255;
				result.blue = 255;
			} else {
				result.red = 0;
				result.green = 0;
				result.blue = 0;
			}
			break;
		case ColorType.SingleColor:
			if(rate > 0) {
				
				if(["red","green","blue"].includes(PrimaryColor)) {
					result.blue = 255*rate;
					result.red = 255*rate;
					result.green = 255*rate;
					result[cNameToProp(PrimaryColor)] = 255;
				} else {
					result.blue = 255;
					result.red = 255;
					result.green = 255;
					result[cNameToProp(PrimaryColor)] = 255*rate;
				}
				
				/*
				let colorAmount = 510*(rate);
				
				if(["red","green","blue"].includes(PrimaryColor)) {
					if(colorAmount <= 255) {
						result.red = result.blue = result.green = 0;
						result[cNameToProp(PrimaryColor)] = colorAmount;
					} else {
						result.red = result.blue = result.green = colorAmount-255;
						result[cNameToProp(PrimaryColor)] = 255;
					}
				} else {
					if(colorAmount <= 255) {
						result.red = result.blue = result.green = colorAmount;
						result[cNameToProp(PrimaryColor)] = 0;
					} else {
						result.red = result.blue = result.green = 255;
						result[cNameToProp(PrimaryColor)] = colorAmount-255;
					}
				}
				*/
				
			} else {
				result.red = 0;
				result.green = 0;
				result.blue = 0;
			}
			
			break;
		case ColorType.ReverseColor:
			if(rate > 0) {
				
				let colorAmount = 510*(1-rate);
				
				if(["red","green","blue"].includes(PrimaryColor)) {
					if(colorAmount <= 255) {
						result.red = result.blue = result.green = 0;
						result[cNameToProp(PrimaryColor)] = colorAmount;
					} else {
						result.red = result.blue = result.green = colorAmount-255;
						result[cNameToProp(PrimaryColor)] = 255;
					}
				} else {
					if(colorAmount <= 255) {
						result.red = result.blue = result.green = colorAmount;
						result[cNameToProp(PrimaryColor)] = 0;
					} else {
						result.red = result.blue = result.green = 255;
						result[cNameToProp(PrimaryColor)] = colorAmount-255;
					}
				}
				
				
			} else {
				result.red = 0;
				result.green = 0;
				result.blue = 0;
			}
			
			break;
		case ColorType.ColorCycle:
			if(rate > 0) {
				let colorRates = RainbowGetColorRates(rate, ColorCycleCycleCount);
				result[ColorCycleOrdering[0]] = (colorRates[0]*(ColorCycleHigh - ColorCycleLow)) + ColorCycleLow;
				result[ColorCycleOrdering[1]] = (colorRates[1]*(ColorCycleHigh - ColorCycleLow)) + ColorCycleLow;
				result[ColorCycleOrdering[2]] = (colorRates[2]*(ColorCycleHigh - ColorCycleLow)) + ColorCycleLow;
				
			} else {
				result.red = 0;
				result.green = 0;
				result.blue = 0;
			}
			break;
	}
	
	return result;
	
}


cNameToProp = function(colorName) {
	
	let result = "";
	switch (colorName) {
		case "red":
		case "cyan":
			result = "red";
			break;
		case "green":
		case "magenta":
			result = "green";
			break;
		case "blue":
		case "yellow":
			result = "blue";
			break;
	}
	return result;
}


RainbowGetColorRates = function(rate, cycleCount) {
	
	let x = (rate * 6 * cycleCount) % 6;
	let i = Math.floor(x);
	let d = x % 1;
	
	let colorRates = [0, 0, 0];
	
	switch (i) {
		case 0:
		case 6:
			colorRates = [1, d, 0];
			break;
		case 1:
			colorRates = [1-d, 1, 0];
			break;
		case 2:
			colorRates = [0, 1, d];
			break;
		case 3:
			colorRates = [0, 1-d, 1];
			break;
		case 4:
			colorRates = [d, 0, 1];
			break;
		case 5:
			colorRates = [1, 0, 1-d];
			break;
	}
	
	return colorRates
}



/****************** Mandelbrot Stuff ***********************/


CenterOnPoint = function(pixelX, pixelY) {
	let newCenterX = PixelToPlaneX(pixelX);
	let newCenterY = PixelToPlaneY(pixelY);
	SetPlaneValues(newCenterX, newCenterY, Scale);
}


ZoomIn = function() {
	let newScale = Scale / ZoomLevel;
	PlaneHistory.push({PlaneX: PlaneX, PlaneY: PlaneY, Scale: Scale});
	SetPlaneValues(PlaneX, PlaneY, newScale);
}


ZoomOut = function() {
	let newScale = Scale * ZoomLevel;
	PlaneHistory.push({PlaneX: PlaneX, PlaneY: PlaneY, Scale: Scale});
	SetPlaneValues(PlaneX, PlaneY, newScale);
}


ZoomToSelection = function() {
	
	let newPlaneX = 0.0;
	let newPlaneY = 0.0;
	
	if (ZoomSelectionMode == "CORNER") {
		newPlaneX = PixelToPlaneX(ZoomSelectionX + (ZoomSelectionWidth/2));
		newPlaneY = PixelToPlaneY(ZoomSelectionY + (ZoomSelectionHeight/2));
	} else if (ZoomSelectionMode == "CENTER") {
		newPlaneX = PixelToPlaneX(ZoomSelectionX);
		newPlaneY = PixelToPlaneY(ZoomSelectionY);
	}
	
	let ratio = Math.abs(ZoomSelectionWidth) / BoxWidth;
	let newScale = Scale * ratio;
	
	PlaneHistory.push({PlaneX: PlaneX, PlaneY: PlaneY, Scale: Scale});
	SetPlaneValues(newPlaneX, newPlaneY, newScale);
	
}

ZoomOutToHistory = function() {
	
	if(PlaneHistory.length > 0) {
		let newPosition = PlaneHistory.pop();
		
		SetPlaneValues(newPosition.PlaneX, newPosition.PlaneY, newPosition.Scale);
		UpdateCanvas = true;
	}
	
	
}


ZoomOutToDefault = function() {
	
	SetPlaneValues(DefaultPlaneX, DefaultPlaneY, (DefaultPlaneWidth / DefaultCanvasWidth));
	
}


SetPlaneValues = function(newPlaneX, newPlaneY, newScale, setUpdatePlane = true, updateUrl = true) {
	
	PlaneX = newPlaneX;
	PlaneY = newPlaneY;
	Scale = newScale

	PlaneWidth = BoxWidth*Scale;
	PlaneHeight = BoxHeight*Scale;

	LeftEdge = PlaneX - PlaneWidth/2;
	TopEdge = PlaneY + PlaneHeight/2;
	RightEdge = PlaneX + PlaneWidth/2;
	BottomEdge = PlaneY - PlaneHeight/2;
	
	if(updateUrl) {
		StorePlaneInUrl()
	}
	
	if(setUpdatePlane) {
		UpdatePlane = true;
	}
}

function RunAlgorithmInWorkerMultithread() {
	
	console.log("<RunAlgorithmInWorkerMultithread> start");
	console.time("RunAlgorithmInWorkerMultithread");
	
	Plane = FillArray(-1.0, BoxWidth, BoxHeight);
	LoadingPercent = 0;
	LoadPercentArray = FillArray(0, RenderingThreads, 0);
	
	PlaneDetailsArrays = FillArray(0, RenderingThreads, 0);
	PlaneDetailsLoaded = false;
	
	let subBoxWidth = Math.trunc(BoxWidth / RenderingThreads);
	let subBoxWidthOverflow = BoxWidth - (subBoxWidth * RenderingThreads);
	let subPlaneWidth = PlaneWidth / RenderingThreads;
	let testPlaneWidth = subBoxWidth * Scale;
	
	console.log({BoxWidth: BoxWidth, 
				RenderingThreads: RenderingThreads, 
				subBoxWidth: subBoxWidth, 
				subBoxWidthOverflow: subBoxWidthOverflow, 
				subPlaneWidth: subPlaneWidth, 
				testPlaneWidth: testPlaneWidth});
	
	
	for (let id = 0; id < RenderingThreads; id++) {
		
		let subLeftEdge = LeftEdge + (subPlaneWidth*id)
		
		//If this is the last chunk, we need to fill in the extra bit lost to rounding
		//This is not working. I think I need to switch it to use Scale instead of PlaneWidth
		
		let subBoxWidthToUse = subBoxWidth;
		//let subPlaneWidthToUse = subPlaneWidth;
		if(id == RenderingThreads - 1) {
			subBoxWidthToUse = subBoxWidth + subBoxWidthOverflow;
			//subPlaneWidthToUse = subBoxWidth * Scale;
		}
		
		
		let worker = new Worker("worker_setBuilder.js");
		console.log("<RunAlgorithmInWorkerMultithread> posting message to worker " + id);
		worker.postMessage({
			id: id,
			GrowthThreshold: GrowthThreshold, 
			IterationThreshold: IterationThreshold,
			BoxWidth: subBoxWidthToUse,
			BoxHeight: BoxHeight,
			LeftEdge: subLeftEdge,
			TopEdge: TopEdge,
			//PlaneWidth: subPlaneWidthToUse
			Scale: Scale,
			Power: ZPower,
			BuildPlaneDetails: BuildPlaneDetails
		});
		
		worker.onmessage = function(e) {
			let threadID = e.data.id;
			//console.log("<RunAlgorithmInWorkerMultithread> message received from workerID: " + threadID);
			
			LoadPercentArray[threadID] = e.data.LoadPercent;
			let totalLoadPercent = 0;
			for(let i=0; i < LoadPercentArray.length; i++) {
				totalLoadPercent += LoadPercentArray[i];
			}
			LoadPercent = totalLoadPercent / RenderingThreads;
			
			if(e.data.Completed) {
				console.log('<RunAlgorithmInWorkerMultithread> ---- worker' + threadID + ' Completed: ');
				
				//Plane = e.data.Plane;
				console.log('<RunAlgorithmInWorkerMultithread> ---- worker' + threadID + ' merging into Plane');
				Merge2DArrays(e.data.Plane, Plane, subBoxWidth*threadID, 0)
				//Merge2DArrays(e.data.PlaneDetails, PlaneDetails, subBoxWidth*threadID, 0)
				PlaneDetailsArrays[threadID] = e.data.PlaneDetails;
				
				if(ShowPartialLoading) {
					UpdateImageData = true;
					UpdateCanvas = true;
				}
				
			} else {
				//console.log('<RunAlgorithmInWorkerMultithread> ---- New LoadPercent worker' + threadID + ': ' + LoadPercent);
				//console.log('<RunAlgorithmInWorkerMultithread> ---- New Overall Load Percent: ' + LoadPercent);
				UpdateCanvas = true;
			}
			
			if(LoadPercent == 1) {
				OriginX = PlaneToPixelX(0);
				OriginY = PlaneToPixelY(0);
				
				UpdateImageData = true;
				UpdateCanvas = true;
				UpdatePositionUi()
				MergePlaneDetailsArrays()
				//console.timeEnd("RunAlgorithmInWorkerMultithread");
			}
		}
		
	}
	
	console.log("<RunAlgorithmInWorkerMultithread> End of function");
}


function MergePlaneDetailsArrays() {
	
	if(!BuildPlaneDetails) {
		return;
	}
	
	let worker = new Worker("worker_merge2DArrays.js");
	console.log("<MergePlaneDetailsArrays> posting message to worker ");
	worker.postMessage({arrays: PlaneDetailsArrays});
	
	worker.onmessage = function(e) {
		console.log("<MergePlaneDetailsArrays> response from worker");
		//console.log(e);
		PlaneDetails = e.data.result;
		PlaneDetailsLoaded = true;
	}
	
}


function Merge2DArrays(sourceArray, targetArray, x, y) {
	
	if(sourceArray.length + x > targetArray.length) {
		console.error("Error in MergeArrays. Target width plus x is too large");
		console.error({SourceWidth: sourceArray.length, x: x, TargetWidth: targetArray.length});
		throw 'Error in MergeArrays. Target width plus x is too large';
	}
	
	if(sourceArray[0].length + y > targetArray[0].length) {
		console.error("Error in MergeArrays. Target height plus y is too large");
		console.error({SourceHeight: sourceArray[0].length, y: y, TargetHeight: targetArray[0].length});
		throw "Error in MergeArrays. Target height plus y is too large";
	}
	
	for(let i=0; i<sourceArray.length; i++) {
		for(let j=0; j<sourceArray[0].length; j++) {
			targetArray[i+x][j+y] = sourceArray[i][j];
		}
	}
	
	return targetArray;
	
}

/*
function RunAlgorithm()
{
	//console.log("<RunAlgorithm> started");
	
	//console.log("<RunAlgorithm> reset Plane array");
	Plane = FillArray(-1.0, BoxWidth, BoxHeight)
	
	
	//console.log("<RunAlgorithm> create Complex objects z and c");
	let z = new ComplexNumber(0, 0);
	let c = new ComplexNumber(0, 0);
	//let oldZ = new ComplexNumber(0, 0);
	
	let maxIteration=0;
	let minIteration=-1;
	let iterationCounter;
	
	//Rendered = false;
	LoadPercent = 0.0;
	
	//console.log("<RunAlgorithm> Start Loop");
	for(let pixelX=BoxX;pixelX<BoxX+BoxWidth;pixelX++)
	{
		for(let pixelY=BoxY;pixelY<BoxY+BoxHeight;pixelY++)
		{
			//console.log("<RunAlgorithm> +++ (" + pixelX + "," + pixelY + ")");
		
			c = new ComplexNumber(PixelToPlaneX(pixelX), PixelToPlaneY(pixelY));
			z = new ComplexNumber(PixelToPlaneX(pixelX), PixelToPlaneY(pixelY));
			
			iterationCounter = 0;
			for(let count=0;count<IterationThreshold;count++)
			{
				//console.log("<RunAlgorithm> +++++++++ " + iterationCounter + "z: " + z.getValue());
				iterationCounter++;
				
				// Z = z^2 + c
				z = z.square().add(c);
				
				//// Experimenting with different powers
				//z = z.multiply(z).multiply(z).multiply(z);
				//oldZ = z;
				//for(int powerCount = 1; powerCount < power;powerCount++) {
				//	z = z.multiply(oldZ);
				//}
				//z = z.add(c);
				
				
				if(z.getValue()>GrowthThreshold)
				{
					let rate = 1- (iterationCounter / IterationThreshold);
					
					Plane[pixelX-BoxX][pixelY-BoxY] = rate;
					//console.log("<RunAlgorithm> +++++++++ " + iterationCounter + " - " + rate);
					if(iterationCounter>maxIteration)
						maxIteration = iterationCounter;
					if(minIteration==-1 || iterationCounter<minIteration)
						minIteration = iterationCounter;
					break;
					
				} else {
					
					Plane[pixelX-BoxX][pixelY-BoxY] = 0;
					
				}//If z > or < thresholdGrowth
				
			}//Threshold loop
			
		}//Loop Y
		
		LoadPercent = (pixelX-BoxX) / BoxWidth;
		//console.log("<RunAlgorithm> LoadPercent: " + LoadPercent);
	}//Loop X
	
	//console.log("<RunAlgorithm> Loop completed ");
	//console.log("<RunAlgorithm> Max Iteration: " + maxIteration);
	//console.log("<RunAlgorithm> Min Iteration: " + minIteration);
	
	LoadPercent = 1.0
	UpdateImageData = true;
	UpdateCanvas = true;

	//console.log("<RunAlgorithm> ended");
	
}//runAlgorthm()

*/

ReRender = function() {
	UpdatePlane = true;
	UpdateCanvas = true;
	StoreSettingsInLocalStorage();
}


/******************* Conversions **********************/

/* Plane To Pixel */
/*
PlaneToPixelPoint = function(planePoint) {
	
	let pixelX = BoxX + ((planePoint.x - LeftEdge)/Scale);
	let pixelY = BoxY + ((TopEdge - planePoint.y)/Scale);
	
	return {x: pixelX, y: pixelY}
}
*/

PlaneToPixelX = function(x) {
	return BoxX + ((x - LeftEdge)/Scale);
}

PlaneToPixelY = function(y) {
	return BoxY + ((TopEdge - y)/Scale);
}


/* Pixel To Plane */
/*
PixelToPlanePoint = function(pixelPoint) {
	
	let planeX = LeftEdge + ((pixelPoint.x - BoxX) * Scale);
	let planeY = TopEdge - ((pixelPoint.y - BoxY) * Scale);
	
	return {x: planeX, y: planeY}
}
*/

PixelToPlaneX = function(x) {
	return LeftEdge + ((x - BoxX) * Scale);
}

PixelToPlaneY = function(y) {
	return TopEdge - ((y - BoxY) * Scale);
}



/****************** MOUSE/KEYBOARD STUFF ***********************/


document.onkeydown= function(event){
	console.log("<onkeydown> keyCode: " + event.keyCode);
	
	//Enter
	if(event.keyCode == 13) {
		ReRender();
	} else if(event.keyCode == 16) {
		KeyState.shift = true;
	} else if(event.keyCode == 17) {
		KeyState.control = true;
	} else if(event.keyCode == ModifierKeys.center && !KeyState.control) {
		MouseMode = "CENTER";
		canvas.style.cursor = "crosshair";
	}
};

document.onkeyup= function(event){
	console.log("<onkeyup> keyCode: " + event.keyCode);
	if(event.keyCode == 16) {
		KeyState.shift = false;
	} else if(event.keyCode == 17) {
		KeyState.control = false;
	} else if(event.keyCode == ModifierKeys.center && MouseMode == "CENTER") {
		MouseMode = "";
		canvas.style.cursor = "default";
	}
};


canvas.onmousedown = function(mouse) {
	IsMouseDown = true;
	let mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
	let mouseY = mouse.clientY - canvas.getBoundingClientRect().top;
	
	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input
	
	if(MouseMode == "CENTER") {
		
		CenterOnPoint(mouseX, mouseY)
		
	} else if(MouseMode == "SELECT" && mouse.button == 0 && !KeyState.shift) {
		
		ZoomSelectionX = mouseX;
		ZoomSelectionY = mouseY;
		ZoomSelectionWidth = 0;
		ZoomSelectionHeight = 0;
		MouseMode = "ZOOM_SELECT";
	}

}

canvas.onmouseup = function(mouse) {
	IsMouseDown = false;
	
	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input
	
	if(MouseMode == "SELECT") {
		/*
		//I didn't like the feel of this, so I removed it.
		//Leaving it here in case I change my mind.
		if(MouseMode == "SELECT" && mouse.button == 0 && KeyState.shift) {
			console.log("<onmouseup> Mouse up in SELECT mode with shift key");
			console.log("<onmouseup> Zooming out");
			ZoomOutToHistory();
		}
		*/
		
	} else if(MouseMode == "ZOOM_SELECT" && mouse.button == 0) {
		//console.log("<onmouseup> Mouse up in ZOOM_SELECT");
		//console.log("<onmouseup> Switching to SELECT mode");
		MouseMode = "SELECT"
		if(Math.max(Math.abs(ZoomSelectionWidth), Math.abs(ZoomSelectionHeight)) > ZoomSelectionThreshold) {
			//console.log("<onmouseup> Zooming in");
			ZoomToSelection();
		} else {
			//CenterOnPoint(ZoomSelectionX, ZoomSelectionY)
		}
		UpdateCanvas = true;
	} else if(MouseMode.includes("RESIZE")) {
		UpdatePlane = true;
	}

}

canvas.onmousemove = function(mouse) {
	let mouseX = mouse.clientX - canvas.getBoundingClientRect().left;
	let mouseY = mouse.clientY - canvas.getBoundingClientRect().top;

	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input

	if(!IsMouseDown) {

		if(AllowBoxResizing && (mouseX > canvas.width-ResizeSelectionWidth && mouseX < canvas.width + ResizeSelectionWidth && mouseY < canvas.height + ResizeSelectionWidth)) {

			if (mouseY > canvas.height-ResizeSelectionWidth && mouseY < canvas.height + ResizeSelectionWidth) {
				document.body.style.cursor = "nw-resize";
				MouseMode = "RESIZE_BOTH";
			} else {
				document.body.style.cursor = "e-resize";
				MouseMode = "RESIZE_RIGHT";
			}
		} else if (AllowBoxResizing && (mouseY > canvas.height-ResizeSelectionWidth && mouseY < canvas.height + ResizeSelectionWidth && mouseX < canvas.width + ResizeSelectionWidth)) {
			document.body.style.cursor = "n-resize";
			MouseMode = "RESIZE_DOWN";
		} else if (mouseX > BoxX + 1 && mouseX < BoxX + BoxWidth - 1 && mouseY > BoxY + 1 && mouseY < BoxY + BoxHeight - 1 ) {
			if(MouseMode == "") {
				document.body.style.cursor = "default";
				MouseMode = "SELECT";
			}
			
			if(UpdatePointStats) {
				UpdatePointStatsUi(mouseX, mouseY)
			}
		} else {
			document.body.style.cursor = "default";
			MouseMode = "";
		}

	} else {

		if(MouseMode == "SELECT") {
			
		} else if (MouseMode == "ZOOM_SELECT") {
			
			if((mouseX - ZoomSelectionX) * (mouseY - ZoomSelectionY) > 0) {
				//Top-left or bottom-right quadrants
				ZoomSelectionWidth = mouseX - ZoomSelectionX;
				ZoomSelectionHeight = ZoomSelectionWidth / BoxAspectRatio;
				
				if(Math.abs(mouseY - ZoomSelectionY) > Math.abs(ZoomSelectionHeight)) {
					ZoomSelectionHeight = mouseY - ZoomSelectionY;
					ZoomSelectionWidth = ZoomSelectionHeight * BoxAspectRatio;
				}
			} else { 
				//Top-right or bottom-left quadrants
				ZoomSelectionWidth = mouseX - ZoomSelectionX;
				ZoomSelectionHeight = ZoomSelectionWidth / BoxAspectRatio * -1;
				
				if(Math.abs(mouseY - ZoomSelectionY) > Math.abs(ZoomSelectionHeight)) {
					ZoomSelectionHeight = mouseY - ZoomSelectionY;
					ZoomSelectionWidth = ZoomSelectionHeight * BoxAspectRatio * -1;
				}
				
			}
			

			if (ZoomSelectionMode == "CENTER") {
				ZoomSelectionWidth *= 2
				ZoomSelectionHeight *= 2
			}
			
			UpdateCanvas = true;
			
		} else if (AllowBoxResizing && MouseMode == "RESIZE_RIGHT") {
			UpdateCanvasSize(mouseX, canvas.height);
			StoreSettingsInLocalStorage();
		} else if (AllowBoxResizing && MouseMode == "RESIZE_DOWN") {
			UpdateCanvasSize(canvas.width, mouseY);
			StoreSettingsInLocalStorage();
		}else if (AllowBoxResizing && MouseMode == "RESIZE_BOTH") {
			UpdateCanvasSize(mouseX, mouseY);
			StoreSettingsInLocalStorage();
		}

	}

}


document.onwheel = function(event){
	/*
	console.log("<onwheel> deltaX: " + event.deltaX);
	console.log("<onwheel> deltaY: " + event.deltaY);
	console.log("<onwheel> deltaZ: " + event.deltaZ);
	console.log("<onwheel> deltaMode: " + event.deltaMode);
	*/
	
};


/**** Touch Events ****/

canvas.ontouchstart = function(event) {
	if (event.target == canvas) {
		event.preventDefault();
	}
	
	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input
	
	let touch = event.touches[0];
	let touchX = touch.clientX;
	let touchY = touch.clientY;
	
	if (touchX > BoxX + 1 && touchX < BoxX + BoxWidth - 1 && touchY > BoxY + 1 && touchY < BoxY + BoxHeight - 1 ) {
		if(MouseMode == "") {
			MouseMode = "SELECT";
		}
	}
	
	var mouseEvent = new MouseEvent("mousedown", {
		clientX: touchX,
		clientY: touchY,
		button: 0
	});
	canvas.dispatchEvent(mouseEvent);
}


canvas.ontouchend = function(event) {
	if (event.target == canvas) {
		event.preventDefault();
	}
	
	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input
	
	var touch = event.touches[0];
	var mouseEvent = new MouseEvent("mouseup", {
		button: 0
	});
	canvas.dispatchEvent(mouseEvent);
}

canvas.ontouchmove = function(event) {
	if (event.target == canvas) {
		event.preventDefault();
	}
	
	if(UpdatePlane || LoadPercent < 1.0) return; //If we're loading, don't accept input
	
	var touch = event.touches[0];
	let touchX = touch.clientX;
	let touchY = touch.clientY;
	
	var mouseEvent = new MouseEvent("mousemove", {
		clientX: touchX,
		clientY: touchY,
		button: 0
	});
	canvas.dispatchEvent(mouseEvent);
}




/**** Browser Back Button ****/

window.addEventListener('popstate', (event) => {
	RetrieveSettingsFromUrl();
	ZoomToPlaneUrl();
});


/****************** SETTINGS ***********************/

UpdateUiFromSettings = function() {
	
	tbGrowthThreshold.value = GrowthThreshold;
	tbIterationThreshold.value = IterationThreshold;
	tbZPower.value = ZPower;
	tbZoomLevel.value = ZoomLevel;
	tbRenderingThreads.value = RenderingThreads;
	cbShowPartialLoading.checked = ShowPartialLoading;
	chDisplayAxes.checked = DisplayAxes;
	ddlZoomSelectionMode.value = ZoomSelectionMode;
	
	ddlColorMode.value = ColorMode;
	ddlPrimaryColor.value = PrimaryColor;
	ddlColorCycleOrdering.value = ColorCycleOrdering.join()
	tbColorCycleCycleCount.value = ColorCycleCycleCount;
	
	cbBuildPointStats.checked = BuildPlaneDetails;
	
}

UpdateSettingsFromUi = function() {
	
	GrowthThreshold = tbGrowthThreshold.value;
	IterationThreshold = tbIterationThreshold.value;
	ZPower = tbZPower.value;
	ZoomLevel = tbZoomLevel.value;
	RenderingThreads = tbRenderingThreads.value;
	ShowPartialLoading = cbShowPartialLoading.checked;
	DisplayAxes = chDisplayAxes.checked;
	ZoomSelectionMode = ddlZoomSelectionMode.value;
	
	ColorMode = ddlColorMode.value;
	PrimaryColor = ddlPrimaryColor.value;
	ColorCycleOrdering = ddlColorCycleOrdering.value.split(',');
	ColorCycleCycleCount = tbColorCycleCycleCount.value;
	
	BuildPlaneDetails = cbBuildPointStats.checked;
	
	StoreSettingsInLocalStorage();
	StoreSettingsInUrl()
}

UpdateSettingsFromUiUpdateImageData = function() {
	UpdateSettingsFromUi();
	UpdateImageData = true;
	UpdateCanvas = true;
}

StoreSettingsInUrl = function() {
	
	let url = new URL(window.location);
	
	UpdateSettingInUrl(url, 'gt', GrowthThreshold, DefaultGrowthThreshold);
	UpdateSettingInUrl(url, 'it', IterationThreshold);
	UpdateSettingInUrl(url, 'zp', ZPower, DefaultZPower);
	UpdateSettingInUrl(url, 'cm', ColorMode);
	UpdateSettingInUrl(url, 'c', PrimaryColor);
	UpdateSettingInUrl(url, 'cco', ColorCycleOrdering.join(), DefaultColorCycleOrdering.join());
	UpdateSettingInUrl(url, 'cccc', ColorCycleCycleCount, DefaultColorCycleCycleCount);
	
	if(EnableStateInUrl) {
		window.history.replaceState({}, '', url);
	}
}

UpdateSettingInUrl = function(url, key, value, defaultValue = "") {
	if(value != defaultValue) 
		url.searchParams.set(key, value);
	else
		url.searchParams.delete(key);
}

StorePlaneInUrl = function() {
	
	let url = new URL(window.location);
	UpdateSettingInUrl(url, 'x', PlaneX, DefaultPlaneX);
	UpdateSettingInUrl(url, 'y', PlaneY, DefaultPlaneY);
	UpdateSettingInUrl(url, 'scale', Scale, (DefaultPlaneWidth / DefaultCanvasWidth));
	UpdateSettingInUrl(url, 'it', IterationThreshold);
	
	if(EnableStateInUrl) {
		window.history.pushState({}, '', url);
	}
	
}


RetrieveSettingsFromUrl = function() {
	
	let url = new URL(window.location);
	let searchParams = url.searchParams;
	if (searchParams.has("gt")) GrowthThreshold = searchParams.get("gt"); else GrowthThreshold = DefaultGrowthThreshold;
	if (searchParams.has("it")) IterationThreshold = searchParams.get("it"); else IterationThreshold = DefaultIterationThreshold;
	if (searchParams.has("zp")) ZPower = searchParams.get("zp"); else ZPower = DefaultZPower;
	if (searchParams.has("cm")) ColorMode = searchParams.get("cm"); else ColorMode = DefaultColorMode;
	if (searchParams.has("c")) PrimaryColor = searchParams.get("c"); else PrimaryColor = DefaultPrimaryColor;
	if (searchParams.has("cco")) ColorCycleOrdering = searchParams.get("cco").split(','); else ColorCycleOrdering = DefaultColorCycleOrdering;
	if (searchParams.has("cccc")) ColorCycleCycleCount = searchParams.get("cccc"); else ColorCycleCycleCount = DefaultColorCycleCycleCount;
	
	UpdateUiFromSettings();
	ShowHideColorSections();
}


ZoomToPlaneUrl = function() {
	
	let newPlaneX = DefaultPlaneX;
	let newPlaneY = DefaultPlaneY;
	let newScale = DefaultPlaneWidth / DefaultCanvasWidth;
	
	let url = new URL(window.location);
	let searchParams = url.searchParams;
	if (searchParams.has("x")) newPlaneX = parseFloat(searchParams.get("x"));
	if (searchParams.has("y")) newPlaneY = parseFloat(searchParams.get("y"));
	if (searchParams.has("scale")) newScale = parseFloat(searchParams.get("scale"));
	
	SetPlaneValues(newPlaneX, newPlaneY, newScale, true, false);
}

StoreSettingsInLocalStorage = function() {
	
	//localStorage.GrowthThreshold = GrowthThreshold;
	//localStorage.IterationThreshold = IterationThreshold;
	//localStorage.ZPower = ZPower;
	//localStorage.ZoomLevel = ZoomLevel;
	//localStorage.RenderingThreads = RenderingThreads;
	//localStorage.ShowPartialLoading = ShowPartialLoading;
	//localStorage.ZoomSelectionMode = ZoomSelectionMode;
	
	//localStorage.BuildPlaneDetails = BuildPlaneDetails;
	
	//localStorage.ColorMode = ColorMode;
	//localStorage.PrimaryColor = PrimaryColor;
	
	//localStorage.CanvasWidth = canvas.width;
	//localStorage.CanvasHeight = canvas.height;
}



RetrieveSettingsFromLocalStorage = function() {
		
	if (localStorage.getItem("GrowthThreshold") != null) GrowthThreshold = localStorage.GrowthThreshold;
	if (localStorage.getItem("IterationThreshold") != null) IterationThreshold = localStorage.IterationThreshold;
	if (localStorage.getItem("ZPower") != null) ZPower = localStorage.ZPower;
	if (localStorage.getItem("ZoomLevel") != null) ZoomLevel = localStorage.ZoomLevel;
	if (localStorage.getItem("RenderingThreads") != null) RenderingThreads = localStorage.RenderingThreads;
	if (localStorage.getItem("ZoomSelectionMode") != null) ZoomSelectionMode = localStorage.ZoomSelectionMode;
		
	//Apparently, all values are converted to strings when stored in Local Storage
	//So booleans (and other non-string/non-numeric types) need to be handled differently
	if (localStorage.getItem("ShowPartialLoading") != null) {
		ShowPartialLoading = (localStorage.ShowPartialLoading.toLowerCase() == "true");
	}
	if (localStorage.getItem("BuildPlaneDetails") != null) {
		BuildPlaneDetails = (localStorage.BuildPlaneDetails.toLowerCase() == "true");
	}
	
	if (localStorage.getItem("ColorMode") != null) ColorMode = localStorage.ColorMode;
	if (localStorage.getItem("PrimaryColor") != null) PrimaryColor = localStorage.PrimaryColor;
	
	UpdateUiFromSettings();
	

}

SetSettingsDefaultValues = function() {
	
	GrowthThreshold = DefaultGrowthThreshold;
	IterationThreshold = DefaultIterationThreshold;
	ZPower = DefaultZPower;
	ZoomLevel = DefaultZoomLevel;
	RenderingThreads = DefaultRenderingThreads;
	ShowPartialLoading = DefaultShowPartialLoading;
	ZoomSelectionMode = DefaultZoomSelectionMode;
	BuildPlaneDetails = BuildPlaneDetailsDefault;
	
	ColorMode = DefaultColorMode;
	PrimaryColor = DefaultPrimaryColor;
	ColorCycleOrdering = DefaultColorCycleOrdering;
	ColorCycleCycleCount = DefaultColorCycleCycleCount;
	
	UpdateUiFromSettings();
	ShowHideColorSections();
	
	UpdateCanvasSize(DefaultCanvasWidth, DefaultCanvasHeight);
}

SetPlaneDefaultValues = function() {
	SetPlaneValues(DefaultPlaneX, DefaultPlaneY, (DefaultPlaneWidth / DefaultCanvasWidth));
	PlaneHistory = new Array();
}

/*
//Deprecated in favor of ResetApplication()
RestoreDefaultValuesAndRedraw = function() {
	SetSettingsDefaultValues();
	SetPlaneDefaultValues();
	UpdateUiFromSettings();
	ShowHideColorSections();
	StoreSettingsInUrl();
	StorePlaneInUrl();
	localStorage.clear();
	UpdatePlane = true;
	UpdateCanvas = true;
}
*/

ResetApplication = function() {
	localStorage.clear();
	window.location = window.location.pathname;
}


UpdatePositionUi = function() {
	
	// Left/Right
	let digitsToKeepLR = GetDigitsToKeep(LeftEdge, RightEdge);
	let displayLeft = TrimNumberToDigits(LeftEdge, digitsToKeepLR);
	let displayRight = TrimNumberToDigits(RightEdge, digitsToKeepLR);
	
	// Top/Bottom
	let digitsToKeepTB = GetDigitsToKeep(TopEdge, BottomEdge);
	let displayTop = TrimNumberToDigits(TopEdge, digitsToKeepTB);
	let displayBottom = TrimNumberToDigits(BottomEdge, digitsToKeepTB);
	
	// Display X/Y
	let digitsToKeepXY = Math.max(digitsToKeepLR, digitsToKeepTB);
	let displayX = TrimNumberToDigits(PlaneX, digitsToKeepXY);
	let displayY = TrimNumberToDigits(PlaneY, digitsToKeepXY);
	
	
	// Set labels
	lblX.innerText = displayX;
	lblY.innerText = displayY;
	lblLeftEdge.innerText = displayLeft;
	lblRightEdge.innerText = displayRight;
	lblTopEdge.innerText = displayTop;
	lblBottomEdge.innerText = displayBottom;
	lblScale.innerText = Scale;
	
	console.log("<UpdatePositionUi> Positions");
	console.log({LeftEdge: LeftEdge, RightEdge: RightEdge, displayLeft: displayLeft, displayRight: displayRight, digitsToKeepLR: digitsToKeepLR});
	console.log({TopEdge: TopEdge, BottomEdge: BottomEdge, displayTop: displayTop, displayBottom: displayBottom, digitsToKeepTB: digitsToKeepTB});
	
}


function GetDigitsToKeep(num1, num2) {
	//Determine minimum significant figures to keep in order to show a difference
	
	let extraDigits = 3;
	
	if (num1 = num2 * -1) {
		return 1 + extraDigits;
	}
	
	let string1 = num1.toString().replace('-', '').replace('.', '');
	let string2 = num2.toString().replace('-', '').replace('.', '');
	let digitsToKeep = 0;
	while(string1[digitsToKeep] == string2[digitsToKeep] && digitsToKeep <= Math.min(string1.length, string2.length)) {
		digitsToKeep++;
	}
	digitsToKeep += extraDigits;
	
	return digitsToKeep;
}

function TrimNumberToDigits(value, numDigits) {
	
	let string = value.toString();
	if(string[0] == "-") {
		numDigits++;
	}
	if(string.includes(".")) {
		numDigits++;
	}
	
	return string.slice(0, numDigits);
	
}

function UpdatePointStatsUi(screenPixelX, screenPixelY) {
	
	let fillerText = "";
	if(!BuildPlaneDetails) {
		fillerText = "n/a";
	} else if(!PlaneDetailsLoaded) {
		fillerText = "loading..."
	}
	if (!BuildPlaneDetails || !PlaneDetailsLoaded ) {
		lblPointStatsReal.innerText = fillerText;
		lblPointStatsImaginary.innerText = fillerText;
		lblPointStatsEscapeRate.innerText = fillerText;
		lblPointStatsIterationCount.innerText = fillerText;
		return;
	}
	
	let planeX = PixelToPlaneX(screenPixelX);
	let planeY = PixelToPlaneY(screenPixelY);
	
	planePixelX = screenPixelX - BoxX;
	planePixelY = screenPixelY - BoxY;
	
	if(planePixelX < PlaneDetails.length && planePixelY < PlaneDetails[0].length) {
		lblPointStatsReal.innerText = PlaneDetails[planePixelX][planePixelY].number.real;
		lblPointStatsImaginary.innerText = PlaneDetails[planePixelX][planePixelY].number.imaginary;
		lblPointStatsEscapeRate.innerText = PlaneDetails[planePixelX][planePixelY].rate;
		lblPointStatsIterationCount.innerText = PlaneDetails[planePixelX][planePixelY].iterationCount;
	} else {
		fillerText = "out of range"
		lblPointStatsReal.innerText = fillerText;
		lblPointStatsImaginary.innerText = fillerText;
		lblPointStatsEscapeRate.innerText = fillerText;
		lblPointStatsIterationCount.innerText = fillerText;
	}
	
	
	/*
	let pointString = planeX;
	if( planeY >= 0) {
		pointString += "+";
	}
	pointString += planeY + "i";
	
	lblPointStatsPoint.innerText = pointString;
	*/
}

ShowHideColorSections = function() {
	
	if(ddlColorMode.value == "BLACK_WHITE") {
		divPrimaryColor.style.display = "none";
		divColorCycle.style.display = "none";
	} else if(ddlColorMode.value == "COLOR_CYCLE") {
		divPrimaryColor.style.display = "none";
		divColorCycle.style.display = "block";
	} else {
		divPrimaryColor.style.display = "block";
		divColorCycle.style.display = "none";
	}
	
}


ToggleHelpModal = function() {
	divWelcomeModal.classList.toggle("ModalShow");
	divWelcomeModalBackground.classList.toggle("ModalBackgroundShow");
}

/****************** ARRAY FUNCTIONS ***********************/


FillArray = function(value, width, height) {
	let array = new Array(width);
	for(let i=0;i<width;i++) {
		if(height == 0) {
			array[i] = value;
		} else {
			array[i] = new Array(height);
			for(let j=0;j<height;j++) {
				array[i][j] = value;
			}
		}
	}
	return array;
}

CopyArray = function(grid, width, height, defaultValue) {
	let array = new Array(width);
	for(let i=0;i<width;i++) {
		array[i] = new Array(height);
		for(let j=0;j<height;j++) {
			if(i < grid.length && j < grid[i].length) {
				array[i][j] = grid[i][j];
			} else {
				array[i][j] = defaultValue;
			}
		}
	}
	return array;
}


/****************** RESIZE TO FIT ***********************/

UpdateCanvasSize = function(newWidth, newHeight) {
	
	canvas.width = newWidth;
	canvas.height = newHeight;
	
	UpdateBoxSize(canvas.width-BoxMargin*2, canvas.height-BoxMargin*2)
	UpdateCanvas = true;
}


UpdateBoxSize = function(newWidth, newHeight) {

	BoxWidth = newWidth;
	BoxHeight = newHeight;
	BoxAspectRatio = BoxWidth / BoxHeight;
	
	let newScale = PlaneWidth / BoxWidth;
	SetPlaneValues(PlaneX, PlaneY, newScale, false, false)
	
}

/****************** INTERVAL ***********************/

function IntervalUpdate() {
	//console.log("<IntervalUpdate>");
	//FrameCount++;

	//if(StepAutoRun) {
	//	var StepFrameCountInterval = Math.ceil(1000 / (IntervalValue * StepSpeed));
	//	if(FrameCount % StepFrameCountInterval == 0) {
	//		Step();
	//	}
	//}
	
	/*
	if(UpdatePlane) {
		UpdatePlane = false;
		//RunAlgorithm();
		setTimeout(RunAlgorithm, 1);
		UpdateCanvas = true;
	}
	*/
	
	if(UpdateCanvas) {
		//console.log("<IntervalUpdate> LoadPercent:" + LoadPercent);
		UpdateCanvas = false;
		DrawCanvas();
	}
}
stopInterval = function() {
	clearInterval(IntervalID);
}
restartInterval = function() {
	clearInterval(IntervalID);
	IntervalID = setInterval(IntervalUpdate, IntervalValue);
}


function PlaneIntervalUpdate() {
	//console.log("<PlaneIntervalUpdate>");
	if(UpdatePlane) {
		UpdatePlane = false;
		//RunAlgorithm();
		//RunAlgorithmInWorker();
		RunAlgorithmInWorkerMultithread();
		UpdateCanvas = true;
	}
	
}


function WorkerTest() {
	console.log("<WorkerTest> start");
	
	let worker = new Worker("worker_test.js");
	worker.postMessage({Value1: 5, Value2: 10});
	worker.onmessage = function(e) {
		textContent = e.data;
		console.log('<WorkerTest>Message received from worker');
		console.log(textContent);
	}
	
	console.log("<WorkerTest> End");
}

/****************** START IT UP ***********************/

SetSettingsDefaultValues();
RetrieveSettingsFromLocalStorage();
RetrieveSettingsFromUrl();
UpdateCanvasSize(canvas.width, canvas.height);
ZoomToPlaneUrl();
UpdatePlane = true;
IntervalID = setInterval(IntervalUpdate, IntervalValue);
PlaneIntervalID = setInterval(PlaneIntervalUpdate, PlaneIntervalValue);


