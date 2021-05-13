// /scroll hide header------------------------------
let oldScroll = 0,
  newScroll = 0,
  customPageXOffset,
  customPageYOffset,
  customPageXLimit,
  customPageYLimit,
  tId = 0,
  headerVisible = false;

const header = document.querySelector("header");

//custom scroll eventlistener-----------------------------------------------------------
const handleScroll = (e) => {
  const { x: offsetX, y: offsetY } = e.offset;
  const { x: limitX, y: limitY } = e.limit;

  [customPageXOffset, customPageYOffset] = [offsetX, offsetY];
  [customPageXLimit, customPageYLimit] = [limitX, limitY];

  // changePageProgress();

  if (window.innerWidth >= 600) {
    changeHeader();
    listenScroll();
  }
};

//header change
const changeHeader = () => {
  if (customPageYOffset > 150) header.classList.remove("reveal-header");
  else header.classList.add("reveal-header");
};

// page scroll
function changePageProgress() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.querySelector("#progress-bar").style.height = `${scrolled}%`;
  document.querySelector(".progress-logo").style.top = `${scrolled}%`;
}

const listenScroll = (e) => {
  if (oldScroll >= newScroll) {
    //up
    if (headerVisible) return;
    else {
      handleHeader();
    }
  } else {
    //down
  }
  oldScroll = newScroll;
};

const showHeader = () => {
  headerVisible = true;
  header.classList.add("showHeader");
};

const hideHeader = () => {
  if (tId) clearTimeout(tId);

  tId = setTimeout(() => {
    header.classList.remove("showHeader");
    headerVisible = false;
  }, 3000);
};

const handleHeader = () => {
  if (window.innerWidth <= 600) {
    return;
  }

  showHeader();
  hideHeader();
};

//header mouse in mouse out
if (window.innerWidth >= 600) {
  header.addEventListener("mouseenter", () => {
    clearTimeout(tId);
    showHeader();
  });
  header.addEventListener("mouseleave", () => {
    hideHeader();
  });
}

// appply slick-----------------------------------------------------------
$(document).ready(function () {
  console.log("jquery loaded");

  $("#home .hero-slider-container").slick({
    infinite: true,
    speed: 1500,
    fade: false,
    cssEase: "ease",
    autoplay: true,
    autoplaySpeed: 3000,
    // adaptiveHeight: true,
    dots: true,
    arrows: false,
  });

  $("#contact .hero-slider-grid-container .hero-slider-container").slick({
    infinite: true,
    speed: 1000,
    fade: false,
    cssEase: "ease",
    autoplay: true,
    autoplaySpeed: 3000,
    // adaptiveHeight: true,
  });

  if (window.innerWidth <= 600) {
    header.classList.remove("reveal-header");
  }
});

//Intersection observer-----------------------------------------------------------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const { delay, animname, onetime, animtiming, timingfunction } =
      entry.target.dataset;

    if (entry.intersectionRatio > 0) {
      entry.target.style.animation = `${animname} ${animtiming || 1}s ${
        timingfunction || `ease`
      } ${delay || 0}s forwards`;

      // // handle the color change in bg
      // if ("data-anim-bg-color" in entry.target.attributes) {
      //   changeServicesBG(entry.target.attributes["data-anim-bg-color"].value);
      // } else {
      //   changeServicesBG("#111");
      // }
    } else if (onetime) return;
    else {
      entry.target.style.animation = `none`;
    }
  });
});

const selectors = ["[data-anim-bg-color]", "[data-anim]", "[data-animname]"];

selectors.forEach((selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    observer.observe(element);
  });
});

// hero slider click handle----------------------------------------------------------------
document
  .querySelectorAll("main #hero .hero-buttons-container .buttons button")
  .forEach((item) => {
    item.addEventListener(
      "click",
      (e) => {
        const ariaLabel =
          e.target.closest("button").attributes["aria-label"].value;
        const slickButton = document.querySelector(
          `.hero-slider-container [aria-label="${ariaLabel}"]`
        );
        slickButton.click();
      },
      true
    );
  });

//contact page tabs click handler------------------------------
document.querySelectorAll(".tabs .tab button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const { name } = e.target;
    const tabItems = document.querySelectorAll(".tabs .tab-item");

    tabItems.forEach((item) => {
      item.classList.add("display-out");
      document.querySelector(`.tabs #${name}`).classList.remove("display-out");
    });
  });
});

//mouse following overlay
let shapeTracking = false;
let interval = 0;

const updatePos = (e) => {
  shapeTracking = true;
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  const x = (clientX / innerWidth) * 100;
  const y = (clientY / innerHeight) * 100;

  document.querySelector(".mouse-tracker").style.left = `${x}%`;
  document.querySelector(".mouse-tracker").style.top = `${y}%`;
};

window.onmousemove = (e) => {
  if (shapeTracking) return;
  else updatePos(e);

  setTimeout(() => {
    shapeTracking = false;
  }, interval);
};

//bg video check for playback
const bgVideo = $(".bg-body-video")[0];

if (bgVideo) {
  bgVideo.addEventListener("waiting", (event) => {
    console.log("Video is waiting for more data.");
  });

  bgVideo.addEventListener("playing", (event) => {
    console.log("playback started");
  });
}

//set the size for the mouse tracker
const elements = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
  "a",
  "button",
  "blockquote",
  "input",
  "textarea",
  "label",
  "address",
]
  .map((selector) => {
    return [...document.querySelectorAll(`${selector}`)];
  })
  .flat(Infinity);

document.body.addEventListener("mouseover", (e) => {
  const { target } = e;

  if (
    elements.some((element) => {
      if (element) {
        return element.isSameNode(target);
      }
    })
  ) {
    document.querySelector(".mouse-tracker").classList.add("shrink-item");
  } else {
    document.querySelector(".mouse-tracker").classList.remove("shrink-item");
  }
});

// ham-icon -----------------

const hamIcon = document.querySelector("#ham-icon-container .ham-icon");
hamIcon.addEventListener("click", () => {
  hamIcon.classList.toggle("opened");
  if (!hamIcon.classList.contains("opened")) {
    header.classList.add("reveal-header");
  } else {
    header.classList.remove("reveal-header");
  }
  header.classList.toggle("reveal-header");
  hamIcon.setAttribute("aria-expanded", hamIcon.classList.contains("opened"));
});

//custom scroll listener

const scrollbar = Scrollbar.init(
  document.querySelector("[data-custom-smooth-scroll]")
);

scrollbar.addListener(handleScroll);

function buildThresholdList(steps = 20) {
  let thresholds = [];

  for (let i = 1.0; i <= steps; i++) {
    let ratio = i / steps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
}

const parallaxOptions = {
  threshold: buildThresholdList(10),
  root: null,
  // rootMargin: "-10px 0 -10px 0px",
};

// parallax observer
const parallaxObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const { target, intersectionRatio } = entry;

      let unit = 500;
      let topRatio = intersectionRatio * unit;
      let bottomRatio = 100;

      target.style.objectPosition = `center ${topRatio}px`;
      // target.style.clipPath = `polygon(0 ${topRatio}%, 100% ${topRatio}%, 100% ${bottomRatio}%, 0% ${bottomRatio}%)`;
    }
  });
}, parallaxOptions);

// console.log({offsetY, limitY, ratio: offsetY/limitY})

const parallaxElements = document.querySelectorAll("[data-parallax]");
parallaxElements.forEach((element) => {
  // element.classList.add("add-transition");
  // parallaxObserver.observe(element);
});

// forms and form listners
const handlePayLoad = (data, messageElement) => {
  fetch("https://formsubmit.co/ajax/neeraj@sociomonkey.com ", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then(({ message }) => (messageElement.textContent = message))
    .catch(({ message }) => (messageElement.textContent = message))
    .finally(() => {
      setTimeout(() => {
        messageElement.textContent = "";
      }, 10000);
    });

  console.log(data);
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const formData = {};
  const { target: form } = e;
  const { id } = form;
  const formItems = document.querySelectorAll(`#${id} .form-item`);
  const message = document.querySelectorAll(`#${id} .form-item .message`)[0];
  formData["Form Type"] = id;
  formItems.forEach((formItem) => {
    if (formItem.children[0].isEqualNode(message)) return;

    const { name, value, type } = formItem.children[1];
    formData[name] = value.trim();
  });

  handlePayLoad(formData, message);
};

const forms = document.querySelectorAll(".contact-forms");
forms.forEach((form) => {
  form.addEventListener("submit", handleFormSubmit);
});
