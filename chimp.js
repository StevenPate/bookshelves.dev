const client = require('@mailchimp/mailchimp_marketing');

client.setConfig({
  apiKey: "595fcb4591e24f3f9af7c91de274193f",
  server: "us10",
});

const run = async () => {
  const response = await client.campaigns.getContent("dadd794625");
  console.log(response.plain_text);
};

run();

// const mailchimp = require('@mailchimp/mailchimp_transactional')('595fcb4591e24f3f9af7c91de274193f-us10');

// async function callPing() {
//   const response = await mailchimp.users.ping();
//   console.log(response);
// }

// callPing();