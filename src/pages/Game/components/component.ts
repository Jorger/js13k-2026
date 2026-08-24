abstract class Component {
  abstract render(): string;

  mount(): void {}

  toString(): string {
    return this.render();
  }
}

export default Component;
