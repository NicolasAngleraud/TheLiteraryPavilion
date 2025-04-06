const REPO_NAME = "TheLiteraryPavilion";

const isLocalDev = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";

const getBasePath = () => {
  return isLocalDev ? "/" : `/${REPO_NAME}/`;
};

const normalizeAttributes = (element, base) => {
  const fixAttr = (attr) => {
    element.querySelectorAll("[" + attr + "]").forEach((el) => {
      let val = el.getAttribute(attr);
      if (val && val.startsWith("/") && !val.startsWith("//")) {
        if (!val.startsWith(base)) {
          el.setAttribute(attr, base + val.slice(1));
        }
      }
    });
  };
  fixAttr("src");
  fixAttr("href");
};


const loadComponent = (id, compPath) => {
  const base = getBasePath();
  const compURL = base + compPath;

  fetch(compURL)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - ${compURL}`);
      }
      return res.text();
    })
    .then((html) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      normalizeAttributes(wrapper, base);
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = wrapper.innerHTML;
      } else {
        console.error(`Container with id "${id}" not found.`);
      }
    })
    .catch((err) => {
      console.error("Error loading component:", err);
    });
};
