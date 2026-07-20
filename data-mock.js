var mockMarkdown = ` ## Overview
Transform your GNOME Shell desktop with this powerful tool. By shifting core behaviors into a customizable framework, it allows seamless transition and a vastly improved workflow.

### Features
* **Customization:** Modify visual elements easily via an intuitive UI.
* **Compatibility:** Native support for Wayland and X11 sessions.
* **Performance:** Extremely lightweight, minimizing battery consumption on laptops.

### Installation & Usage
Just click install. After activation, open the Extension Preferences app to configure your perfect setup.
> **Note:** We recommend logging out and back in after the initial installation to ensure all shell hooks are perfectly synced.

### Technical Details
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`;

var mockMedia = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800&h=450' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450' },
  { type: 'video', url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm', poster: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800&h=450' },
  { type: 'video', url: 'https://www.youtube.com/watch?v=bSeav8Rltn8' }
];

var mockReviews = [
  { user: "Alice C.", date: "2 days ago", rating: 5, text: "Absolutely essential for my workflow. Works flawlessly on Wayland!" },
  { user: "Bob_Linux", date: "1 week ago", rating: 4, text: "Great extension, but occasionally glitches after waking up from sleep. Otherwise fantastic and I highly recommend it." },
  { user: "GnomeFan99", date: "1 month ago", rating: 5, text: "I can't imagine using my desktop without this. Thank you to the developer for keeping it updated so consistently!" }
];

var mockVersions = [
  { version: '10', status: 'Active', comment: 'Approved. Looks great on GNOME 48.' },
  { version: '9', status: 'Rejected', comment: 'Reviewer: Please ensure you are disconnecting the signals in the disable() function. There is a memory leak.' },
  { version: '8', status: 'Active', comment: 'Approved without issues.' }
];