import { behaviorLog } from "./utils";

// ===========================================================================
export class BackgroundBehavior
{
  debug(msg) {
    behaviorLog(msg, "debug");
  }

  log(msg) {
    behaviorLog(msg, "info");
  }
}

// ===========================================================================
export class Behavior extends BackgroundBehavior
{
  constructor() {
    super();
    this._running = null;
    this.paused = null;
    this._unpause = null;
    this.state = {};

    this.scrollOpts = {behavior: "smooth", block: "center", inline: "center"};
  }

  start() {
    this._running = this.run();
  }

  done() {
    return this._running ? this._running : Promise.resolve();
  }

  async run() {
    try {
      for await (const step of this) {
        this.log(step);
        if (this.paused) {
          await this.paused;
        }
      }
      this.log(this.getState("done!"));
    } catch (e) {
      this.log(this.getState(e));
    }
  }

  pause() {
    if (this.paused) {
      return;
    }
    this.paused = new Promise((resolve) => {
      this._unpause = resolve;
    });
  }

  unpause() {
    if (this._unpause) {
      this._unpause();
      this.paused = null;
      this._unpause = null;
    }
  }

  getState(msg, incrValue) {
    if (incrValue) {
      if (this.state[incrValue] === undefined) {
        this.state[incrValue] = 1;
      } else {
        this.state[incrValue]++;
      }
    }

    return {state: this.state, msg};
  }

  cleanup() {

  }

  setOpts(opts) {
    this.opts = opts;
  }

  getOpt(opt) {
    return this.opts ? this.opts[opt] : null;
  }

  static load() {
    if (self.__bx_behaviors) {
      self.__bx_behaviors.load(this);
    } else {
      console.warn(
        `Could not load ${this.name} behavior: window.__bx_behaviors is not initialized`
      );
    }
  }
}
