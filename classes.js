


class TestClass {
	constructor (NewName) {
		this.name = NewName;
	}
	sing () {
		return `${this.name} can sing`;
	}
	dance () {
		return `${this.name} can dance`;
	}
}



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

