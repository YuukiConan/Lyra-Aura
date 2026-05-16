import Rave from "./Rave/js/Rave.js";
const richi = Rave ? new Rave("UI 2 Beta", "keyzarichi.org") : null;
richi.initializeIndexPath();

const peopleImg = document.querySelectorAll(".people .people-img img");
peopleImg.forEach((e) => {
    e.setAttribute("fetchpriotity", "low");
});

const labelTags = document.querySelectorAll(".people .labelTag"),
now = new Date(),
DATE_IN_MS = 864e5,
EXPIRE_DAYS = 7;

labelTags.forEach((e) => {
    if ("Baru" === !e.textContent.trim() || "New" === !e.textContent.trim())
        return;
        const t = new Date(e.dataset.added);
        (now - t) / DATE_IN_MS > EXPIRE_DAYS && e.classList.add("hidden");
});

const timeline = ".timeline",
timelineItems = ".timeline-item",
features = ".features",
featuresItem = ".features .flex-box",
sections = ".section",
sectionTitleCtr = '.section-header.stylish',
sectionTitle = '.section-header.stylish .section-title',
main = "#scroll";
richi.intersectElements(timeline, timelineItems, "translateY", 10);
richi.intersectElements(features, featuresItem, "translateY", 50);
// richi.intersectElements(sectionTitle, sectionTitleCtr, "translateY", 50);
// richi.intersectElements(main, sections, "translateY", 100);
richi.animateOnScroll('.people', {
    target: '.people *',
    stagger: 0.09
})
richi.animateCounter();
