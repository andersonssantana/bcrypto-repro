import { Meteor } from "meteor/meteor";
import { onPageLoad } from "meteor/server-render";
import bcrypt from 'bcrypt';

Meteor.startup(async () => {
  const hash = await bcrypt.hash('galaxy-test', 10);
  console.log('bcrypt OK:', hash.slice(0, 20));
  console.log(`Greetings from ${module.id}!`);
});

onPageLoad(sink => {
  // Code to run on every request.
  sink.renderIntoElementById(
    "server-render-target",
    `Server time: ${new Date}`
  );
});
