## Farcaster Frames V2 Demo

Farcaster Frames V2 Demo is the ultimate educational tool to start the exploration of farcaster frames v2. With links to the docs, tutorials, guides, examples and reusable components. Mastering this repo will bring your frame skills to the next level. Are you ready to build the future, anon?

#### Disclaimer
While you can access the website with no problem and get access to the static content, we encourage everyone to open it in the warpcast app or any other farcaster client for a better performance and get access to all features.

This application includes code from other educational resources like links to the docs, all the links from the v2frames website, the og frames demo by deodad and horsefacts, and adapted versions of the swap token and yoink components by horsefacts.
The idea is to showcase how easy is to stack educational content and components from several sources and encourage the collaboration for building a better educational tool.

### Explore, Learn, Reuse, Contribute

All components and sections are designed to help builders in the process of learning and building frames. Including the most essential and basic features like reading and writing onchain transactions or notifications. They all are reusable and we encourage everyone to build and contribute with their own components and help growing this educational application.

Every component include a github link to access the code of the component easily. Every component is loading the farcaster sdk and context and calling the `sdk.actions.ready` function, allowing easy reusability, just copy pasting the component.

The examples, the quiz, the tutorials and guides are all designed to grow with your collaboration and help us creating the ultimate learning reosurce for building frames.

### Basic Features

 - Social. View Your Profile. View Custom Profile.
 - Add Frame.
 - Open external and internal links.
 - Navigate between screens, open/close the frame.
 - Auth. Sign In With Farcaster.
 - Event Listeners on add frame, remove frame, enable/disable notifications.
 - Connect, disconnect, switch chain, send eth, call a contract, sign message and typed data.
 - Webhook and notifications management.
 - Basic instant notifications.
 - Store and manage user notification token in external redis database.
 - Complex scheduled notifications including daily cron tasks leveraging databases and external hosts.
 - Input text, datetimes and forms.
 - Free/paid transactions. Minting nfts. Storing and retrieving onchain data.
 - Fetch quotes and prices. Perform a swap.
 - Tutorials, docs and quiz.

### Demo

#### Features

 - Farcaster sdk.
 - Social. Open profiles with `sdk.viewProfile{ fid }`.
 - Actions and Navigation. AddFrame, open links, close frame...
 - Sign In With Farcaster. Try the SIWF button.
 - Event Listeners. Add frame, remove frame, enable/disable notifications.
 - Notifications. Instant, 1 hour later and daily notifications.
 - Wallet. Explore the connect, disconnect, switch chain, send eth, call a contract, sign message and typed data features.

### Onchain

Onchain section include the same as wallet in previous section in a more accesible under a well known word that resonates with all of us. Onchain. 

#### Features

 - Farcaster sdk.
 - Basic onchain feaures: connect, disconnect, switch chain, send eth, call contract, sign message and typed data.
 - Navigation.

### Alaarma!

Alaarma section is an exploration of the notification system. Set and process reminders with custom text and datetime. With basic and advanced capabilities like daily reminders with cron tasks and retries leveraging external hosting platforms.

#### Features

 - Farcaster sdk.
 - Notifications. Set and process notifications with custom text and datetime.
 - Text Input. Set the custom text.
 - Datetime Input. Pick and set a custom datetime.
 - Navigation.

### Swap Token

Token swap frame demo by horsefacts.

#### Features

 - Farcaster sdk.
 - Read onchain data.
 - Write onchain data.
 - Navigation.

### Words

The Words section is the more complex including a mix of everything in a very simple frame application. Write a new free word or tip the dev by calling a payable contract function and change the golden word exploring free and paid transactions to write onchain data and display the new word in the UI by reading the data from the blockchain. With notifications after a new word this small frame includes all building legos to start exploring more complex v2 frames.

#### Features

 - Farcaster sdk.
 - Read onchain data.
 - Write onchain data. Send free/paid transactions.
 - Notifications. Receive notification after set a new word.
 - Text Input. Set the custom word.
 - Navigation.

### Yoink

The classic yoink game by horsefacts.

#### Features

 - Farcaster sdk.
 - Write onchain data.
 - Navigation.
 
### Quiz

Just a small quiz with 10 questions to test your knowdledge. Good luck. 💜️


## Set Up

- Git clone the repo, install the dependencies, fill env variables and run in development mode.
```
git clone https://farcaster-frames-v2-demo.git
npm install
cp .env.example .env
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build

- Run `npm run build` for production build.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
