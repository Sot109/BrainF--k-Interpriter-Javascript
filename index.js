class Machine {
	constructor() {
		this.tape = new Array(100);
		this.rw_head = this.tape.length / 2;

		for (let i = 0; i < this.tape.length; i++) {
			this.tape[i] = 0;
		}

		this.program = "";
		this.pc = 0;

		this.fixTape();
	}

	set(program) {
		this.program = program;
		this.pc = 0;
	}

	fixTape() {
		while (this.rw_head >= this.tape.length) {
			this.tape.push(0);
		}

		if (this.rw_head < 0) {
			this.rw_head = this.tape.length - 1;
		}
	}

	parseCommand(command) {
		if (command == '>') {
			this.rw_head += 1;
			this.fixTape();
		} else if (command == '<') {
			this.rw_head -= 1;
			this.fixTape();
		} else if (command == '+') {
			this.tape[this.rw_head] += 1;
		} else if (command == '-') {
			this.tape[this.rw_head] -= 1;
		} else if (command == '.') {
			alert("Tape Position " + String(this.rw_head) + ":\nValue:  " + String(this.tape[this.rw_head]) + "\nAscii:  " + String.fromCharCode(this.tape[this.rw_head]));
		} else if (command == ',') {
			this.tape[this.rw_head] = parseInt(prompt("Enter Value for Tape Position " + String(this.rw_head)));
		} else if (command == '[') {
			if (this.tape[this.rw_head] == 0) {
				for (let i = this.pc + 1; i >= this.program.length; i++) {
					if (this.program[i] == ']') {
						this.pc = i + 1;
						return;
					}
				}
			}
		} else if (command == ']') {
			if (this.tape[this.rw_head] != 0) {
				for (let i = this.pc - 1; i >= 0; i--) {
					if (this.program[i] == '[') {
						this.pc = i;
						return;
					}
				}
			}
		}
	}

	parse() {
		while (this.pc >= 0 && this.pc < this.program.length) {
			this.parseCommand(this.program[this.pc]);
			this.pc += 1;
		}
	}

	step() {
		if (this.pc >= 0 && this.pc < this.program.length) {
			this.parseCommand(this.program[this.pc]);
			this.pc += 1;
		}
	}

	show() {
		push();
			let scl = height / 6;

			translate(width / 2 - this.rw_head * scl - scl / 2, 0);
			textAlign(CENTER, CENTER);

			fill(0);
			triangle((this.rw_head + 0.5) * scl, height - scl * 0.9,
					  this.rw_head        * scl, height - scl * 2,
					 (this.rw_head + 1  ) * scl, height - scl * 2);

			for (let i = 0; i < this.tape.length; i++) {
				fill(255);
				rect(i * scl, height - scl, scl, scl);

				fill(0);
				textSize(scl / String(this.tape[i]).length);
				text(this.tape[i], i * scl + scl / 2, height - scl / 2);

				fill(255);
				textSize(scl / 2);
				text(i, i * scl + scl / 2, height - scl * 1.5);
			}
		pop();

		push();
			scl = min(width / this.program.length, height / 6);
			

			translate(width / 2, scl * 2);
			textSize(scl);
			textAlign(CENTER, CENTER);

			fill(255);

			for (let i = 0; i < this.program.length; i++) {
				text(this.program[i], (i - this.program.length / 2) * scl + scl / 2, 0);
			}

			fill(0);
			triangle((this.pc - this.program.length / 2 + 0.5) * scl, scl / 2,
					 (this.pc - this.program.length / 2      ) * scl, scl * 1.5,
					 (this.pc - this.program.length / 2 +   1) * scl, scl * 1.5);
		pop();
	}
}

var machine, paused, speed;

function reset() {
	machine = new Machine();
	machine.set(prompt("code", ",>,[<+>-]"));
}

function enterCommands() {
	machine.set(prompt("code", ",>,[<+>-]"));
}

function setup() {
	let canvas = createCanvas(innerWidth, innerHeight);
	canvas.parent("canvas-div");

	machine = new Machine();
	machine.set(prompt("code", ",>,[<+>-]"));

	paused = true;
	speed = 10;
}

function windowResized() {
	resizeCanvas(innerWidth, innerHeight);
}

function draw() {
	background(100);

	if (frameCount % speed == 0 && frameCount != 0 && !paused) {
		machine.step();
	}

	machine.show();
}
