import Alpine from "alpinejs";
import { initModals } from "flowbite";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

Alpine.data("videoModal", () => ({
  player: null,
  mpdal: null,
  init() {
    initModals();
    this.$nextTick(() => {
      if (this.$refs.videoElement) {
        this.player = new Plyr(this.$refs.videoElement, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "fullscreen",
          ],
          autoplay: false,
          muted: true,
          hideControls: true,
          resetOnEnd: true,
          playsinline: true,
          vimeo: {
            dnt: true,
            byline: false,
            portrait: false,
            title: false,
            speed: true,
            transparent: false,
          },
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
          },
        });
      }
    });
  },
  playVideo() {
    this.player.play();
  },
  pauseVideo() {
    this.player.pause();
  },
  closeModal() {
    this.pauseVideo()
  }
}));
