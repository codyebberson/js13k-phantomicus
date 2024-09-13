import { drawWorldText } from '../graphics/text';
import { Vec3 } from '../math/vec3';
import { Particle } from './particle';

export class FloatingText extends Particle {
  text: string;
  textColor: string;

  constructor(v: Vec3, text: string, textColor: string) {
    super(v);
    this.text = text;
    this.textColor = textColor;

    // By default, slowly float up
    this.shape.center[1] += 4;
    this.shape.velocity[1] = 2;
    this.acceleration[1] = 2;
  }

  render(): void {
    drawWorldText(this.text, this.shape.center, this.textColor);
  }
}
