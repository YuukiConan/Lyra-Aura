const url = "./json/peopleBio.json";
fetch(url)
    .then(res => res.json())
    .then(data => {
        const map = new Map();

        document.querySelectorAll(".people-bio").forEach(el => {
            const key = el.dataset.people;

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key).push(el);
        });

        data.forEach(person => {
            const elements = map.get(String(person.id));
            if (!elements) return;

            elements.forEach(el => {
                const container = el.closest(".people");
                const name = el.querySelectorAll(".name h2");
                const nickname = el.querySelectorAll(".name span");
                const desc = el.querySelectorAll("p");

                // Set name
                name.forEach(n => {
                    n.textContent = person.name;
                });

                // Set nickname / alias
                nickname.forEach(nick => {
                    let text = person.nickname.replace(/&bull;/g, "/");

                    if (!person.aliases?.trim()) {
                        if (person.other_name?.trim()) {
                            text = `${person.other_name} | ${text}`;
                        }
                    }

                    nick.textContent = text;
                });

                // Set description
                desc.forEach(p => {
                    p.textContent = "";

                    if (!person.description?.trim()) {
                        p.textContent = "Tidak ada biografi";
                        p.classList.add("empty");
                        return;
                    }

                    const lines = person.description
                        .replace(/&bull;/g, "•")
                        .split("<br>");

                    const fragment = document.createDocumentFragment();

                    lines.forEach((line, i) => {
                        fragment.appendChild(document.createTextNode(line.trim()));

                        if (i < lines.length - 1) {
                            fragment.appendChild(document.createElement("br"));
                        }
                    });

                    p.appendChild(fragment);
                });

                const profileImg = container.querySelector(".people-img img");
                const link = container.querySelector(".people-btns a");

                if (profileImg) {
                    profileImg.alt = `${person.name}'s profile picture.`;
                }

                if (link) {
                    link.ariaLabel = `Learn more about ${person.nickname}`;
                }
            });
        });
    })
    .catch((e) => console.error("Error fetching people JSON: ", e));

document.addEventListener('DOMContentLoaded', () => {
    const people = document.querySelectorAll('.people');
    const overlay = document.querySelector('.overlay');
    let peopleData = [];
    
    fetch(url)
    .then(res => res.json())
    .then(data => {
        peopleData = data;
        console.log(peopleData[0]);
        })
        .catch((e) => console.error("Error fetching people JSON: ", e));
    
    const panel = document.querySelector('.people-panel');
    const panelHeader = document.querySelector('.people-panel .panel-header');
    const nameEl = panel.querySelector('.name h2');
    const nicknameEl = panel.querySelector('.nickname');
    const desc = panel.querySelector('p');
    const bio = panel.querySelector('.people-bio h1');
    const img = panel.querySelector('.people-img');
    const badges = panel.querySelector('.badge-container');
    const peopleCtr = document.querySelector('.people-container');
    const activeMembers = ["richi", "keke", "anastasya", "anneta", "yosia", "caca", "lusiana", "fini", "chelsy"];
    let hiddenCounts = 0;

    panel.addEventListener('scroll', () => {
        if (panel.scrollTop > ((bio.getBoundingClientRect().top - panel.getBoundingClientRect().top) / 0.5)) {
            panelHeader.classList.add('scrolled');
        } else {
            panelHeader.classList.remove('scrolled');
        }
    })

    let activeCard = null;
    
    people.forEach(card => {
        const key = card.querySelector('.people-bio').dataset.people;

        if (!activeMembers.includes(key)) {
            card.classList.add('hidden');
            hiddenCounts++;
        }
        card.addEventListener('click', () => {
            document.body.style.overflowY = 'hidden';
            document.querySelectorAll('.side-panel div').forEach((item, i) => {
                setTimeout(() => {
                    item.classList.add('fade-in');
                    
                }, i * 70)
            })
            const bio = card.querySelector('.people-bio');
            
            const key = bio.dataset.people;
            
            const person = peopleData.find(p => String(p.id) === key);
            
            panel.classList.remove('hidden');
            overlay.classList.add('showOverlay');
            

            activeCard = card;
            activeCard.classList.add('focus');


            nameEl.textContent = person.name;
            const topbarName = document.querySelector('#people-topbar');
            if (topbarName) {
                topbarName.textContent = person.name;
            }
    
            let nickname = person.nickname.replace(/&bull;/g, "/");
            if (!person.aliases?.trim()) {
                if (person.other_name?.trim()) {
                    nickname = `${person.other_name} | ${nickname}`;
                }
            }
            nicknameEl.textContent = nickname;
            
            desc.textContent = "";
    
            if (!person.description?.trim()) {
                desc.textContent = "Tidak ada biografi";
                desc.classList.add("empty");
                return;
            }
    
            const lines = person.description
                .replace(/&bull;/g, "•")
                .split("<br>");
    
            const fragment = document.createDocumentFragment();
    
            lines.forEach((line, i) => {
                fragment.appendChild(document.createTextNode(line.trim()));
    
                if (i < lines.length - 1) {
                    fragment.appendChild(document.createElement("br"));
                }
            });
    
            desc.appendChild(fragment);
    
            const profileImg = panel.querySelector(".people-img img");
            const link = panel.querySelector(".people-btns a");
    
            if (profileImg) {
                const image = person.image;
                profileImg.alt = `${person.name}'s profile picture.`;
                profileImg.src = image;
            }
    
            if (link) {
                link.ariaLabel = `Learn more about ${person.nickname}`;
            }
            
            const cardLink = card.querySelector(".people-btns .social-media");
            const panelBtns = panel.querySelector(".people-btns");

            if (cardLink && panelBtns) {
                panelBtns.innerHTML = "";
                panelBtns.appendChild(cardLink.cloneNode(true));
            }
            
            if (cardLink.children.length < 1) {
                const p = document.createElement("p");
                p.textContent = "No social media are available for this member.";
                panelBtns.appendChild(p);
            }

            const badgesArray = person.badges;
            badges.textContent = '';
            
            if (badgesArray && badgesArray.length > 0) {
                badgesArray.map(badge => {

                    const category = document.createElement('div');
                    category.classList.add('badge');
                    category.textContent = badge;
                    
                    badges.appendChild(category);
                }) 
            } else {
                badges.textContent = `No badges for ${person.nickname.replace(/&bull;/g, "/")}`;
            }

        })
    })

    if (hiddenCounts > 0) {
        const info = document.createElement('div');
        info.textContent = `and ${hiddenCounts} other unknown members`;
        peopleCtr.appendChild(info);
    }
    
    function closePanel() {
        requestAnimationFrame(() => {
            panel.style.animation = 'windows8OutLeft .6s cubic-bezier(0.25, 0.1, 0.25, 1.0)';
    
            panel.addEventListener('animationend', () => {
                if (panel.style.animation.includes('windows8OutLeft')) {
                    if (activeCard) {
                        activeCard.classList.remove('focus');
                    }
                    panel.style.animation = '';
                    panel.scrollTop = 0;
                    panel.classList.add('hidden');
                    overlay.classList.remove('showOverlay')
                }
            }, {once: true})
        });
    }

    overlay.addEventListener('click', closePanel);
    document.querySelector('#close-panel').addEventListener('click', closePanel);
})

