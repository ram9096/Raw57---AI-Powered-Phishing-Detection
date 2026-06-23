tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      animation: {
        "blob-1": "float-1 25s infinite ease-in-out",
        "blob-2": "float-2 22s infinite ease-in-out",
        "blob-3": "float-3 20s infinite ease-in-out",
      },
      keyframes: {
        "float-1": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(40px, -60px) scale(1.15)" },
          "66%": { transform: "translate(-20px, 30px) scale(0.95)" },
        },
        "float-2": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(-50px, 40px) scale(1.2)" },
        },
        "float-3": {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "40%": { transform: "translate(50px, 50px) scale(0.9)" },
        },
      },
    },
  },
};

const folderCard = document.getElementById("folder-card");
const fileInput = document.getElementById("image-upload-input");
const analyzeBtn = document.getElementById("folder-analyze-btn");

let selectedFiles = [];

const sheets = [
  {
    el: document.getElementById("sheet-1"),
    preview: document
      .getElementById("sheet-1")
      .querySelector(".sheet-preview"),
    lines: document
      .getElementById("sheet-1")
      .querySelector(".sheet-default-lines"),
    deleteBtn: document
      .getElementById("sheet-1")
      .querySelector(".sheet-delete-btn"),
  },
  {
    el: document.getElementById("sheet-2"),
    preview: document
      .getElementById("sheet-2")
      .querySelector(".sheet-preview"),
    lines: document
      .getElementById("sheet-2")
      .querySelector(".sheet-default-lines"),
    deleteBtn: document
      .getElementById("sheet-2")
      .querySelector(".sheet-delete-btn"),
  },
  {
    el: document.getElementById("sheet-3"),
    preview: document
      .getElementById("sheet-3")
      .querySelector(".sheet-preview"),
    lines: document
      .getElementById("sheet-3")
      .querySelector(".sheet-default-lines"),
    deleteBtn: document
      .getElementById("sheet-3")
      .querySelector(".sheet-delete-btn"),
  },
];
const moreBadge = document.getElementById("sheet-more-badge");

// Handle Folder Card Click to trigger upload
folderCard.addEventListener("click", (e) => {
  // Trigger only if we didn't click delete or settings buttons
  if (
    e.target.closest(".sheet-delete-btn") ||
    e.target.closest("#folder-settings-btn")
  ) {
    return;
  }
  fileInput.click();
});

// Handle File Input Change
fileInput.addEventListener("change", async (e) => {
  try {
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const request = await fetch("/auth/analyze", {
      method: "POST",
      body: formData,
    });

    const result = await request.json();
    if (!result.succcess) {
      showError("Error while uploading..");
      return;
    }
    showSuccess("Analysing wait....");
  } catch (e) {
    console.log(e);
  }
});

// Handle Drag & Drop Events
["dragenter", "dragover"].forEach((eventName) => {
  folderCard.addEventListener(
    eventName,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      folderCard.classList.add(
        "scale-[1.03]",
        "shadow-[0_35px_80px_rgba(216,58,14,0.6)]",
      );
    },
    false,
  );
});

["dragleave", "drop"].forEach((eventName) => {
  folderCard.addEventListener(
    eventName,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      folderCard.classList.remove(
        "scale-[1.03]",
        "shadow-[0_35px_80px_rgba(216,58,14,0.6)]",
      );
    },
    false,
  );
});

folderCard.addEventListener(
  "drop",
  (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  },
  false,
);

// Process selected files
function handleFiles(files) {
  const imageFiles = Array.from(files).filter((file) =>
    file.type.startsWith("image/"),
  );
  if (imageFiles.length === 0 && files.length > 0) {
    alert("Please upload image files only.");
    return;
  }

  // Append to selectedFiles
  selectedFiles = [...selectedFiles, ...imageFiles];
  updateSheets();

  // Reset input value so same file can be selected again if needed
  fileInput.value = "";
}

// Delete button click handlers
sheets.forEach((sheet, idx) => {
  sheet.deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedFiles.splice(idx, 1);
    updateSheets();
  });
});

// Update Folder Sheets and Previews
function updateSheets() {
  // Clear old object URLs to avoid memory leaks
  sheets.forEach((sheet) => {
    if (sheet.preview.src && sheet.preview.src.startsWith("blob:")) {
      URL.revokeObjectURL(sheet.preview.src);
    }
  });

  if (selectedFiles.length === 0) {
    // Reset to default blank/lines state
    sheets.forEach((sheet) => {
      sheet.preview.classList.add("hidden");
      sheet.preview.src = "";
      sheet.lines.classList.remove("hidden");
      sheet.deleteBtn.classList.add("hidden");
    });
    moreBadge.classList.add("hidden");

    // Hide Analyze Button
    analyzeBtn.classList.add(
      "opacity-0",
      "pointer-events-none",
      "scale-95",
    );
    analyzeBtn.classList.remove(
      "opacity-100",
      "pointer-events-auto",
      "scale-100",
    );
  } else {
    // Render images inside sheets
    for (let i = 0; i < 3; i++) {
      const sheet = sheets[i];
      if (i < selectedFiles.length) {
        const file = selectedFiles[i];
        const url = URL.createObjectURL(file);
        sheet.preview.src = url;
        sheet.preview.classList.remove("hidden");
        sheet.lines.classList.add("hidden");
        sheet.deleteBtn.classList.remove("hidden");
      } else {
        sheet.preview.classList.add("hidden");
        sheet.preview.src = "";
        sheet.lines.classList.remove("hidden");
        sheet.deleteBtn.classList.add("hidden");
      }
    }

    // Handle sheet more badge (+N more) on the 3rd sheet
    if (selectedFiles.length > 3) {
      moreBadge.textContent = `+${selectedFiles.length - 2}`;
      moreBadge.classList.remove("hidden");
    } else {
      moreBadge.classList.add("hidden");
    }

    // Show Analyze Button
    analyzeBtn.classList.remove(
      "opacity-0",
      "pointer-events-none",
      "scale-95",
    );
    analyzeBtn.classList.add(
      "opacity-100",
      "pointer-events-auto",
      "scale-100",
    );
  }
}

// Handle Analyze button click
analyzeBtn.addEventListener("click", () => {
  alert(
    `Submit action triggered: Simulating analysis of ${selectedFiles.length} image(s).`,
  );
});

//Card

const card = document.getElementById("collectible-card");
const glare = document.getElementById("card-glare");
const coinWrapper = document.getElementById("gold-coin-wrapper");
const coin = document.getElementById("gold-coin");

// Add gentle rotation behavior based on mouse move
card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Map to values between -1 and 1
  const xc = (x - rect.width / 2) / (rect.width / 2);
  const yc = (rect.height / 2 - y) / (rect.height / 2);

  // Calculate angles (max 12 degrees tilt)
  const rotateX = yc * 12;
  const rotateY = xc * 12;

  // Apply tilt transform on the blister card itself
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  // Dynamic Glare Gradient following cursor
  const glareX = (x / rect.width) * 100;
  const glareY = (y / rect.height) * 100;
  glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 55%)`;

  // 3D Parallax: Shift the coin in the opposite direction slightly for visual depth
  const coinParallaxX = xc * -12;
  const coinParallaxY = yc * 12; // inverse Y to create depth

  // Slightly rotate coin to simulate visual tilt
  const coinRotate = xc * 6;

  coinWrapper.style.transform = `translate3d(${coinParallaxX}px, ${coinParallaxY}px, 25px) rotate(${coinRotate}deg)`;
});

// Reset card and coin to default orientation on mouse leave
card.addEventListener("mouseleave", () => {
  card.style.transform =
    "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  glare.style.background =
    "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 100%)";
  coinWrapper.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
});