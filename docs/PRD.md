Technical Specification (PRD)
Project: WordPress Custom Pinterest Share Plugin
Objective: Create a lightweight WordPress plugin that allows the site administrator to selectively pin images from the frontend to Pinterest using a custom modal window and Pinterest Web Share URL approach (no official API / OAuth 2.0 registration required).

1. General Requirements & Architecture
   Target Site: https://humoraf.ru/ (and general WordPress compatibility).

Language: The user interface (UI) of the plugin (modal, buttons, text fields) must be in English.

Method: Pinterest Web Share (URL-based sharing). The plugin generates a specific pinterest.com/pin/create/button/ URL and opens it in a popup window (window.open).

Stack: PHP (WordPress Plugin Boilerplate), Vanilla JS (or jQuery since it's bundled with WP), CSS3.

2. Plugin Structure
   Plaintext
   wp-custom-pinterest-share/
   │
   ├── wp-custom-pinterest-share.php # Main plugin file (Header info, asset enqueuing)
   └── assets/
   ├── css/
   │ └── public.css # Styles for hover button and modal UI
   └── js/
   └── public.js # DOM manipulation, modal logic, URL builder
3. Functional Requirements
   3.1. Front-end Image Hover Button
   Targeting: The script should target images (<img> tags) within the main content area (e.g., inside .entry-content, article, or post bodies).

Exclusion Criteria: Ignore micro-images, icons, and avatars (e.g., skip images where width < 200px or height < 200px).

Behavior: \* When a user hovers over a valid image, a "Pin it" button should appear in the corner of the image (absolute positioning).

The button must be styled cleanly (e.g., a small Pinterest-red button or elegant icon with text "Pin it").

Clicking this button must prevent default actions and trigger the Custom Modal.

3.2. Custom Modal Window UI
Clicking "Pin it" opens a responsive modal overlay over the current page. The modal must contain the following elements (all in English):

Header: Title text (e.g., "Pin to Pinterest").

Preview Image: A small thumbnail of the selected image.

Input Field 1 (Title):

Label: Title

Type: Text input.

Placeholder: Enter pin title... (Max 100 chars).

Input Field 2 (Description):

Label: Description

Type: Textarea.

Placeholder: Enter pin description... (Max 800 chars).

Input Field 3 (Link Type Selection):

Radio buttons or a Dropdown with two options:

Option A: Current Page URL (Selected by default).

Option B: Custom URL.

If Custom URL is selected, dynamically show a hidden Text input field with placeholder https://....

Footer Action Buttons:

Button 1: Cancel (Closes the modal, clears inputs).

Button 2: Pin it (Primary action button, Pinterest styled).

4. Technical Logic & URL Construction
   When the user clicks the final "Pin it" button inside the modal, the JavaScript must perform the following:

4.1. Text Merging Logic
Since the Pinterest Web Share URL structure does not natively support a separate title parameter, the JS must concatenate the Title and Description into a single string for the description parameter.

Format: [Title Value]\n\n[Description Value]

Example: If Title is "Funny Meme" and Description is "Check this out", the merged string should be "Funny Meme\n\nCheck this out".

4.2. Target URL Selection
If "Current Page URL" is chosen: Use window.location.href.

If "Custom URL" is chosen: Use the value from the custom text input.

4.3. URL Compilation & Encoding
All parameters must be safely encoded using encodeURIComponent().
Construct the destination URL exactly as follows:

Plaintext
https://www.pinterest.com/pin/create/button/?url={TARGET_URL}&media={IMAGE_SOURCE_URL}&description={MERGED_TITLE_AND_DESCRIPTION}
4.4. Window Popup Execution
Open the constructed URL in a standard centered popup window:

JavaScript
window.open(pinterestUrl, 'Pinterest', 'width=750,height=600,toolbar=0,status=0');
Note: Board selection is handled natively by Pinterest inside this popup window.

5. Security & WordPress Best Practices
   Use standard wp_enqueue_script and wp_enqueue_style hooks inside PHP to inject assets.

Restrict the button rendering script so it only loads on single posts/pages (is_singular()), avoiding unnecessary script execution on archives or main pages if not needed.

Ensure proper escaping (esc_url, esc_attr) if any backend variables are passed to the frontend.

6. Expected UX Design Specs (CSS Guide)
   Overlay: Dark semi-transparent background (rgba(0,0,0,0.5)).

Modal Box: Centered, white background, rounded corners (8px), smooth box-shadow. Max-width 500px. Fully responsive on mobile screens.

Inputs: Modern flat design with clean borders, changing color on :focus.

Primary Button: Brand color #E60023 (Pinterest Red) with white text.
