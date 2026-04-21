/**
* --------------------------------
* main JS
* --------------------------------
*/
const fn = (function () {
  "use strict";

  return {
    // 공통
    common: function () {
      fn.hideOtherList();
      fn.scrollAnimation();
    },

    // other list 페이지별로 제어
    hideOtherList: function () {
      const contents = document.querySelector(".contents");
      const sectionWrapID = contents ? contents.id : "";

      const otherProjectLink = document.querySelector(".other-project-link");
      if (!otherProjectLink) return;

      const listItems = otherProjectLink.querySelectorAll(".list-other li");

      listItems.forEach((li) => {
        const anchor = li.querySelector("a");

        if (anchor && anchor.id === sectionWrapID) {
          li.style.display = "none";
        } else {
          li.style.display = "block";
        }
      });
    },

    // scroll animation
    scrollAnimation: function () {
      aniEvent();

      document.addEventListener("scroll", function () {
        const scrTop = window.scrollY;
        const header = document.querySelector(".header-container");
        const headerHt = header ? header.offsetHeight : 0;

        const btnHome = document.querySelector(".btn.home");
        const clientHt = document.documentElement.scrollHeight;
        const winHt = window.innerHeight;

        const footer = document.querySelector(".footer");
        const footerHt = footer ? footer.offsetHeight : 0;

        // scroll event common
        if (scrTop > headerHt) {
          aniEvent();
          if (btnHome) {
            btnHome.style.bottom = "-10%";
          }
        }

        // btnHome 위치 제어
        if (btnHome) {
          if (scrTop === 0) {
            btnHome.style.bottom = "18px";
          } else if (scrTop >= (clientHt - winHt) - (footerHt + 300)) {
            btnHome.style.bottom = "80px";
          }
        }
      });

      function aniEvent() {
        const boxAniList = document.querySelectorAll(".box-ani");

        boxAniList.forEach((el) => {
          const winHt = window.innerHeight;
          const winTop = window.scrollY + winHt;
          const elOffTop = el.getBoundingClientRect().top + window.scrollY;

          if (winTop >= elOffTop) {
            el.classList.add("aniload");
          }
        });
      }
    },
  };
})();

window.addEventListener("load", function () {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }

  fn.common();
});
