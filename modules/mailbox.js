export default class Mailbox {
  static instances = {};

  #callbacks = {
    pre: [],
    notify: []
  };

  #noSpam = true;

  #mail = "";

  constructor(name) {
    this.#check(name, "name");

    if (
      Mailbox.instances.hasOwnProperty(name) &&
      Mailbox.instances[name] instanceof Mailbox
    )
      return Mailbox.instances[name];

    Mailbox.instances[name] = this;
  }

  #check = (value, match) => {
    switch (match) {
      case "name":
      case "mail":
        if (typeof value !== "string" || value === "") {
          throw new TypeError(
            `${match.charAt(0).toUpperCase() +
              match.slice(1)} should be a non-empty string.`
          );
        }
        break;
    }
  };

  #send = mail => {
    if (mail === this.#mail) this.#noSpam = true;
  };

  get send() {
    this.#noSpam = false;
    return this.#send;
  }

  pre(cb) {
    this.#callbacks.pre.push(cb);
  }

  notify(cb) {
    this.#callbacks.notify.push(cb);
  }

  sendMail(mail) {
    this.#check(mail, "mail");

    this.#mail = mail;

    if (this.#callbacks.pre.length) {
      for (let cb of this.#callbacks.pre) {
        cb(this.#mail, this.send);
        if (!this.#noSpam) return undefined;
      }
    }

    if (this.#callbacks.notify.length) {
      for (let cb of this.#callbacks.notify) {
        cb(this.#mail);
      }
    }
  }
}
