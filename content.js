// Create a button
const button = document.createElement("button");
button.textContent = "Open Dialog";

// Append the button to the LeetCode page (you need to identify the appropriate location)
document.body.appendChild(button);

// Add click event listener to the button
button.addEventListener("click", () => {
  // Open dialog in a new tab
  chrome.tabs.create({ url: chrome.runtime.getURL("dialog.html") });
});