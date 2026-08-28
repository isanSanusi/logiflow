import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore("times", () => {
  const isTime = ref(null);

  function timeAgo(date, locale = "en") {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
  
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
    };
  
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
    for (const unit in intervals) {
      const interval = Math.floor(diff / intervals[unit]);
      if (Math.abs(interval) >= 1) {
        return rtf.format(-interval, unit);
      }
    }
    return rtf.format(0, "second");
  }

  return { timeAgo, isTime };
});