import Mailbox from "../modules/mailbox.js";

const testMailbox = new Mailbox("instance");
const testMessage = "test";

describe("mailbox", () => {
  describe("no spam detected", () => {
    before(() => {
      testMailbox.pre((mail, send) => {
        if (mail !== "spam") {
          send(mail);
        }
      });
    });
    it("should confirm the sending", done => {
      testMailbox.notify(() => {
        done();
      });
      testMailbox.sendMail(testMessage);
    });
  });
});
