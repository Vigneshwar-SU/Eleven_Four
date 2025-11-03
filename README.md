# Birthday site (static)

This is a small static single-page site scaffold to celebrate someone's 19th birthday. It contains a full-screen hero with video/image background and sections for family, friends, dream, vision, and memories.

## How to use
- Open `index.html` in your browser (no build step required).
- **Replace the hero background**: 
  - For video: Add your video file as `images/hero-video.mp4` (or update the `src` in index.html)
  - For image only: Replace `images/placeholder1.svg` with your photo and remove/comment out the `<video>` element
- Replace the placeholder images in the `images/` folder with your photos. Keep the same filenames or update the `src` attributes in `index.html`.
- Edit the text content (headings, paragraphs, captions, `[Her Name]`) to personalize the messages.

## Optional enhancements
- Add confetti (e.g., canvas-confetti from CDN) when the user clicks the "Open your surprise" button.
- Add audio by inserting an `<audio>` element and playing it from `script.js`.
- Replace the simple lightbox with a library like `basicLightbox` or `SimpleLightbox` if you want more features.

Deploy
- GitHub Pages: create a repo, push this folder to the `gh-pages` branch or enable Pages from `main` with `/` root.
- Netlify: drag-and-drop the folder or connect the repository.

Notes
- Keep images reasonably sized for web (800–1200px width). Compress with tools like Squoosh or tinyjpg.
