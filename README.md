# SubSmash Frontend 🎨

SubSmash is a web app that integrates Twitch subscriptions with AI-generated character avatars, displaying them in real-time as alerts and slideshow overlays.

## 🚀 Features
- **Interactive Overlay Builder** – Users can create and customize Twitch alert/slideshow layouts.
- **AI-Generated Content** – Uses OpenAI APIs to generate character names and avatars.
- **Fully Customizable Prompting for the AI** - An intuitive prompt-builder and randomizer allowing users to fully personalize their subscriber avatars.
- **WebSocket Integration** – Live updates for new Twitch subscribers.
- **Drag-and-Drop UI** – Built with `React-Draggable` and `React-Beautiful-DnD`.
- **User Authentication** – OAuth login with Twitch.

## 🛠️ Tech Stack
- **Frontend:** React.js, Context API, WebSockets
- **UI Libraries:** React-Draggable, React-Beautiful-DnD
- **State Management:** useState, useEffect, Context API
- **Deployment:** Vercel

## 🔧 Getting Started
SubSmash is live at https://subsmash.io
You need a Twitch account to log in and must authorize SubSmash to connect with your Twitch account.
If you have subscribers, you will see them in a table on the dashboard:
![image](https://github.com/user-attachments/assets/2010d3bd-0758-423d-b221-a54f2748b290)

The OBS Browser Source urls can be added to a scene in OBS as browser sources and placed as desired. By default, the slideshow and alerts will have one of SubSmash's preset layouts.

![image](https://github.com/user-attachments/assets/98e7ef47-dd83-4bf2-84c8-57d9b9213ea9)

Go to "My Prompts" or "My Layouts" and start building your own randomizable prompt or slideshow/alert layout using the drag-and-drop UIs.
