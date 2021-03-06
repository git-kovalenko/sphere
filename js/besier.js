//https://github.com/lampaa/Bezier.js

var Bezier = function() {

}

Bezier.prototype = {
	'mathMin': function(array) {
		return Math.min.apply(null, array);
	},
	'mathMax': function(array) {
		return Math.max.apply(null, array);
	},
	'prepare': function(arCoords, step, minX, maxX) {
		this.step = step || 1;
		this.minX = minX || -1;
		this.maxX = maxX || -1;
		this.factorialLookup = [];
	
		this.arX = [];
		this.arY = [];
		this.arCoords = arCoords || [];
		
		if(arCoords.length < 5) {
			throw new Exception('Too few coordinates (' + arCoords.length + ', min: 5.)');		
		}
		
		for(var i=0; i < arCoords.length; i++) {
			this.arX.push(arCoords[i][0]);
			this.arY.push(arCoords[i][1]);
		}
		
		this.coordsN = this.arX.length;
		
		
		if(this.minX == -1) this.minX = this.mathMin(this.arX);
		if(this.maxX == -1) this.maxX = this.mathMax(this.arX);
		
		
		return this;
	},
	'process':function() {
		var ptind = [];
		var coords = [];
		
		for(var i=0;i < this.arX.length; i++) {
			ptind.push(this.arX[i]);
			ptind.push(this.arY[i]);
		}

		var p = this.Bezier2D(ptind, (this.maxX - this.minX) / this.step);
		
		for (i=0; i < p.length / 2; i++) {
			coords.push([p[i * 2], p[i * 2 + 1]]);
		}

		return coords;
	},
	'Bezier2D': function(b, cpts) {
		var p = [];
		var npts = b.length / 2;
		var icount = 0;
		var t = 0;
		var step = 1.0 / (cpts - 1);
		var jcount = 0;
		var i = 0;
		var basis;
		
		for (var i1 = 0; i1 != cpts; i1++) {
		
			//console.log(i1, cpts);
		
			if ((1.0 - t) < 5e-6) t = 1.0;
			jcount = 0;
			p[icount] = 0.0;
			p[icount + 1] = 0.0;
			
			for (i = 0; i != npts; i++) {
				basis = this.Bernstein(npts - 1, i, t);
				p[icount]+= basis * b[jcount];
				p[icount + 1]+= basis * b[jcount + 1];
				jcount = jcount + 2;
			}

			icount+= 2;
			t+= step;
		}
		
		return p;
	},
	'Bernstein': function(n, i, t) {
		var ti, tni;
		
		if (t == 0.0 && i == 0) ti = 1.0;
		else ti = Math.pow(t, i);
		if (n == i && t == 1.0) tni = 1.0;
		else tni = Math.pow((1 - t) , (n - i));

		return this.Ni(n, i) * ti * tni;
	},
	'Ni': function(n, i) {
		var a1 = this.factorial(n);
		var a2 = this.factorial(i);
		var a3 = this.factorial(n - i);
		
		return a1 / (a2 * a3);
	},
	'factorial': function (n) {
		if (n > 170) throw new Exception('Too max coordinates (' + n + ', max: 170.)');		
		
		var f, i;
		
		if (this.factorialLookup[n] == undefined) {
			f = 1;
			for (i=2; i <= n; i++) {
				f *= i;
			}

			this.factorialLookup[n] = f;
		}

		return this.factorialLookup[n]; 
	}
}

if(typeof module !== 'undefined' && module.exports) {
	module.exports = Bezier;
}
else {
	window['Bezier'] = Bezier;
}