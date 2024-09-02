import Alpine from "alpinejs";

// id darkMode ==> in html x-data="darkMode"
Alpine.data("darkMode", () => ({
    isdark: false,
    htmlclass: "",

    init() {
      if (localStorage.getItem("theme") === "dark") {
        this.isdark = true;
      } else {
        this.isdark = false;
      }

      //使用魔法方法“监视”组件属性
      this.$watch("isdark", (value) => {
        if (value) {
          this.htmlclass = "dark";
          localStorage.setItem("theme", "dark");
        } else {
          this.htmlclass = "";
          localStorage.setItem("theme", "light");
          document.documentElement.classList.remove("dark");
        }
      });
    },

    // call me @click="toggleDarkmode()"
    toggleDarkmode() {
      this.isdark = !this.isdark;
      localStorage.setItem("theme", this.isdark.toString());
    },
  })
);
