var mockMarkdown = `
## Overview
Transform your GNOME Shell desktop with this powerful tool. By shifting core behaviors into a customizable framework, it allows seamless transition and a vastly improved workflow.

### Features
* **Customization:** Modify visual elements easily via an intuitive UI.
* **Compatibility:** Native support for Wayland and X11 sessions.
* **Performance:** Extremely lightweight, minimizing battery consumption on laptops.

### Installation & Usage
Just click install. After activation, open the Extension Preferences app to configure your perfect setup.
> **Note:** We recommend logging out and back in after the initial installation to ensure all shell hooks are perfectly synced.

### Technical Details
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
`;

var mockMedia = [
  { type: 'image', url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800&h=450' },
  { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450' },
  { type: 'video', url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.720p.vp9.webm', poster: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800&h=450' }
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

// Reusable Official GNOME Extension Icon (Puzzle Piece Fallback)
var defaultExtensionSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
  <path d="M16 11V7a2 2 0 00-2-2h-1V3.5a2.5 2.5 0 00-5 0V5H7a2 2 0 00-2 2v1H3.5a2.5 2.5 0 000 5H5v3a2 2 0 002 2h1v1.5a2.5 2.5 0 005 0V19h3a2 2 0 002-2v-1h1.5a2.5 2.5 0 000-5H16z" />
</svg>`;

// Map SVG for Analytics
var worldMapSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1008 650" class="w-full h-auto fill-current text-[#deddda] dark:text-[#3d3846]">
  <path d="M261.2 121.7c-2.3.2-4.1 1.7-4.1 4.1v6c0 1.2-.5 2.1-1.3 2.7-1.1.8-2.6 1-4.2 1.4-1.9.5-3.8.9-5.1 2.3-1.4 1.4-2.1 3.5-2.1 5.9 0 2.2-.6 4.3-1.6 6-1.1 1.8-2.6 3-4.3 4.2-1.7 1.2-3.5 2.2-5.4 3.4-1.9 1.2-3.8 2.5-5.5 4.3-1.6 1.7-2.9 3.8-3.7 6.1-.9 2.3-1.3 4.8-1.5 7.4-.2 2.6-.1 5.3.3 7.8.4 2.5 1.1 4.9 2.1 7 1.1 2.1 2.5 4 4.3 5.4 1.7 1.5 3.7 2.6 6 3.3 2.2.7 4.6 1.1 7.1 1.1 2.5 0 5-.4 7.4-1.2 2.3-.8 4.5-2 6.4-3.6 1.9-1.6 3.5-3.6 4.6-6 1.2-2.4 2-5 2.3-7.8.4-2.8.3-5.7-.3-8.5-.6-2.8-1.7-5.5-3.2-7.8-1.5-2.4-3.5-4.5-5.8-6.1-2.4-1.7-5.1-2.9-7.9-3.6-1.5-.4-3.2-.5-4.8-.5v-4.1c1.9 0 4 .3 6 .8 2.9.8 5.7 2 8 3.8 2.4 1.8 4.4 4.1 5.9 6.7 1.5 2.6 2.5 5.5 2.8 8.6.4 3.1.2 6.2-.5 9.1-.7 2.9-1.9 5.7-3.6 8.2-1.7 2.5-3.8 4.7-6.3 6.3-2.5 1.7-5.3 2.9-8.3 3.6-3 .7-6.1 1-9.2.7-3.1-.3-6.1-1.2-8.9-2.6-2.8-1.4-5.3-3.4-7.4-5.7-2.1-2.4-3.7-5.2-4.8-8.2-1.1-3-1.7-6.2-1.8-9.5-.1-3.2.4-6.5 1.4-9.5 1-3 2.5-5.8 4.5-8.3 2-2.4 4.5-4.5 7.3-6 2.8-1.5 5.8-2.6 9-3.2 1.6-.3 3.3-.4 5-.4v-4.1c-1.8 0-3.7.2-5.5.6-3 .7-5.9 1.8-8.5 3.4-2.6 1.6-4.9 3.7-6.8 6.1-1.9 2.4-3.4 5.2-4.3 8.2-1 3-1.4 6.2-1.4 9.4 0 3.2.5 6.4 1.4 9.5 1 3 2.5 5.9 4.5 8.4 2 2.5 4.5 4.6 7.4 6.2 2.8 1.6 6 2.7 9.3 3.4 3.3.7 6.7 1 10.1.8 3.4-.2 6.7-1 9.8-2.4 3.1-1.4 6-3.3 8.5-5.7 2.5-2.4 4.6-5.3 6.1-8.5 1.5-3.2 2.5-6.7 2.9-10.3.4-3.6.3-7.2-.4-10.7-.7-3.5-1.9-6.9-3.7-10.1-1.8-3.1-4.1-5.9-6.9-8.2-2.8-2.3-6-4.1-9.4-5.4z" />
  <path d="M471.1 201.2c-3.1.5-6 1.6-8.6 3.3-2.6 1.6-4.9 3.8-6.7 6.4-1.8 2.5-3.1 5.4-3.9 8.6-.8 3.1-1.1 6.4-1 9.7.1 3.3.8 6.5 2 9.5 1.2 3 2.9 5.8 5 8.3 2.1 2.4 4.7 4.5 7.6 6.1 2.9 1.5 6.1 2.6 9.4 3.1 3.3.5 6.8.5 10.2-.1 3.4-.6 6.7-1.8 9.6-3.6 3-1.8 5.6-4.1 7.7-6.9 2.1-2.7 3.8-5.9 4.9-9.3 1.1-3.4 1.6-6.9 1.5-10.5-.1-3.6-.8-7.1-2-10.4-1.3-3.3-3.1-6.4-5.4-9.1-2.3-2.7-5.1-4.9-8.2-6.6-3.1-1.7-6.5-2.9-10.1-3.5-3.5-.6-7.2-.6-10.8 0z" />
  <path d="M780.4 140.5c-4.2.8-8.1 2.3-11.7 4.5-3.5 2.2-6.7 5.1-9.3 8.5-2.5 3.4-4.5 7.3-5.8 11.5-1.3 4.2-1.9 8.6-1.8 13.1.1 4.5 1 8.9 2.6 13 1.6 4.1 3.8 7.9 6.6 11.2 2.8 3.4 6.1 6.2 9.8 8.4 3.8 2.2 7.9 3.8 12.3 4.7 4.4.9 8.9 1.1 13.4.5 4.5-.6 8.8-1.9 12.9-3.9 4.1-2 7.8-4.7 11.1-7.9 3.3-3.2 6.1-7 8.2-11.2 2.1-4.2 3.6-8.8 4.3-13.6.7-4.8.7-9.7-.1-14.5-.8-4.8-2.4-9.4-4.6-13.7-2.3-4.3-5.2-8.2-8.7-11.5-3.5-3.3-7.6-6.1-12-8.2-4.5-2.1-9.3-3.5-14.3-4.2-5-.6-10-.5-14.9.4z" />
  <path d="M120.3 350.2c-5.1 1.2-10 3.2-14.4 5.9-4.4 2.8-8.3 6.3-11.6 10.5-3.3 4.2-5.9 8.9-7.6 14.1-1.7 5.2-2.5 10.7-2.5 16.2 0 5.6 1.1 11.1 3 16.3 1.9 5.2 4.6 10.1 8 14.4 3.4 4.3 7.6 8.1 12.2 11.1 4.7 3 9.8 5.3 15.3 6.8 5.4 1.4 11.1 2 16.8 1.6 5.7-.4 11.2-1.8 16.4-4 5.2-2.2 10.1-5.3 14.4-9.1 4.3-3.8 8.1-8.3 11-13.4 3-5.1 5.2-10.7 6.4-16.5 1.2-5.8 1.4-11.8.6-17.7-.8-5.9-2.6-11.6-5.2-16.9-2.7-5.3-6.2-10.2-10.4-14.4-4.2-4.2-9-7.7-14.4-10.4-5.3-2.7-11-4.5-16.9-5.3-6-.8-12.1-.6-18 .5z" />
  <!-- Additional map dots / paths simplified for this mock -->
  <circle cx="280" cy="180" r="4" class="fill-gnome-blue animate-pulse" />
  <circle cx="340" cy="220" r="5" class="fill-gnome-blue animate-pulse" />
  <circle cx="480" cy="150" r="3" class="fill-gnome-blue animate-pulse" />
  <circle cx="510" cy="190" r="6" class="fill-gnome-blue animate-pulse" />
  <circle cx="720" cy="280" r="4" class="fill-gnome-blue animate-pulse" />
  <circle cx="850" cy="400" r="5" class="fill-gnome-blue animate-pulse" />
  <circle cx="200" cy="400" r="3" class="fill-gnome-blue animate-pulse" />
</svg>`;