export interface Input {
  down: boolean;
  downCount: number;
  upCount: number;
}

/**
 * Creates a new input.
 */
export const newInput = (): Input => ({ down: false, downCount: 0, upCount: 2 });

/**
 * Updates the up/down counts for an input.
 * @param input
 */
export const updateInput = (input: Input): void => {
  if (input.down) {
    input.downCount++;
    input.upCount = 0;
  } else {
    input.downCount = 0;
    input.upCount++;
  }
};

export class InputSet {
  readonly count: number;
  readonly inputs: Input[];

  constructor(count: number) {
    this.count = count;
    this.inputs = new Array(count);
    for (let i = 0; i < count; i++) {
      this.inputs[i] = newInput();
    }
  }

  clear(): void {
    // this.inputs.length = 0;
    for (let i = 0; i < this.count; i++) {
      this.inputs[i].down = false;
      this.inputs[i].downCount = 0;
    }
  }

  get(key: number): Input {
    // let input = this.inputs[key];
    // if (!input) {
    //   input = newInput();
    //   this.inputs[key] = input;
    // }
    // return input;
    return this.inputs[key];
  }

  updateAll(): void {
    // this.inputs.forEach(updateInput);
    for (let i = 0; i < this.count; i++) {
      updateInput(this.inputs[i]);
    }
  }

  isAnyDown(): boolean {
    // return this.inputs.some((i) => i.down);
    for (let i = 0; i < this.count; i++) {
      if (this.inputs[i].down) {
        return true;
      }
    }
    return false;
  }
}
